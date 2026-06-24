import db from "@/db/db";

const testingMode = process.env.TESTING_MODE === "true";

const cacheForCartonClosingFaults = new Map<string, any>();

export async function GET() {
	try {
		//get the carton closing faults from the database if they are not already cached
		if (!cacheForCartonClosingFaults.has("cartonClosingFaults")) {
			const cartonClosingFaults = await db.autoCartonFaultCodeLookup.findMany(
				{}
			);

			cacheForCartonClosingFaults.set(
				"cartonClosingFaults",
				cartonClosingFaults
			);
		}

		return Response.json({
			data: cacheForCartonClosingFaults.get("cartonClosingFaults"),
		});
	} catch (error) {
		return Response.json(
			{ error: "Failed to fetch carton closing faults" },
			{ status: 500 }
		);
	}
}

export async function POST(request: Request) {
	try {
		//get the carton closing faults from the database if they are not already cached
		if (!cacheForCartonClosingFaults.has("cartonClosingFaults")) {
			const cartonClosingFaults = await db.autoCartonFaultCodeLookup.findMany(
				{}
			);

			cacheForCartonClosingFaults.set(
				"cartonClosingFaults",
				cartonClosingFaults
			);
		}

		//get the request body
		const requestBody = await request.json();

		//validate the request body ( line, machineType, faultMessage)
		if (
			!requestBody.line ||
			!requestBody.machineType ||
			!requestBody.faultMessage
		) {
			return Response.json(
				//send back an error message with the missing fields
				{
					error:
						"Missing required fields. Required fields are:" +
						formatRequiredFields(
							["line", "machineType", "faultMessage"],
							requestBody
						),
				},
				{ status: 400 }
			);
		}

		//check if feild values are valid
		if (timestampIsInvalid(requestBody.timestamp)) {
			return Response.json(
				{
					error:
						"Invalid timestamp format, format should be yyyy-MM-ddTHH:mm:ss.sssZ",
				},
				{ status: 400 }
			);
		}

		//check if the fault message is in the cached carton closing faults
		const cachedCartonClosingFaults = cacheForCartonClosingFaults.get(
			"cartonClosingFaults"
		);

		const faultMessageExists = cachedCartonClosingFaults.some(
			(fault: { faultMessage: string }) =>
				fault.faultMessage === requestBody.faultMessage
		);

		//if the fault message does not exist, then make a new entry in the database and update the cache and also add the new fault message to the db
		if (!faultMessageExists) {
			await db.autoCartonFaultCodeLookup.create({
				data: {
					faultMessage: requestBody.faultMessage,
				},
			});

			//update the cache
			cacheForCartonClosingFaults.set(
				"cartonClosingFaults",
				await db.autoCartonFaultCodeLookup.findMany({})
			);
		}

		//find the fault code for the fault message
		const faultCode = await db.autoCartonFaultCodeLookup.findFirst({
			where: {
				faultMessage: requestBody.faultMessage,
			},
		});

		//if the fault code is not found, return an error
		if (!faultCode) {
			return Response.json(
				{ error: "Fault code not found for the given fault message" },
				{ status: 400 }
			);
		}

		//make a timestamp for the new fault entry
		const timestamp = new Date().toISOString();

		//add the new fault to the autoCartonFaultLog table
		const result = await db.autoCartonFaults.create({
			data: {
				timestamp: timestamp,
				line: requestBody.line,
				machineType: requestBody.machineType,
				faultCode: faultCode.ID,
			},
		});

		//return the result of the insertion
		return Response.json({ data: result });
	} catch (error) {
		if (testingMode) {
			console.error("Error adding new fault:", error);

			return Response.json(
				{ error: error instanceof Error ? error.message : String(error) },
				{ status: 500 }
			);
		} else {
			return Response.json(
				{ error: "Failed to add new fault" },
				{ status: 500 }
			);
		}
	}
}

function formatRequiredFields(requiredFields: string[], requestBody: any) {
	const missingFields = requiredFields.filter((field) => !requestBody[field]);

	return missingFields.length > 0 ? ` ${missingFields.join(", ")}` : "";
}

function timestampIsInvalid(timestamp: string) {
	const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;

	return !isoRegex.test(timestamp);
}
