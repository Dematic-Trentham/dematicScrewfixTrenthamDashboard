import db from "@/db/db";
import { checkObjectForKeysAndTypes } from "@/utils/findMissingParam.js";

const testingMode = process.env.TESTING_MODE === "true";

//in memory cache for the sorter camera positions mapped by cellId +timestamp
const cacheForSorterCameraPositions = new Array<SorterCameraPositionType>();

const SorterCameraPosition = {
	date: Date,
	cellNumber: Number,
	ulType: String,
	xPosition: Number,
	yPosition: Number,
	rotation: Number,
	width: Number,
	height: Number,
	confidence: Number,
};

type SorterCameraPositionType = typeof SorterCameraPosition;

export async function POST(request: Request) {
	try {
		//get the request body
		const requestBody = await request.json();

		const typeCheckResult = checkObjectForKeysAndTypes(
			requestBody,
			SorterCameraPosition
		);

		if (!typeCheckResult.failed) {
			return new Response(
				`Validation Error: Missing Keys: ${typeCheckResult.missingKeys?.join(
					", "
				)} Type Errors: ${typeCheckResult.typeErrors?.join(", ")}`,
				{
					status: 400,
				}
			);
		}

		//if the request body is valid, add the sorter camera position to the in memory cache
		cacheForSorterCameraPositions.push(requestBody);
	} catch (err) {
		const error = err as Error;

		return new Response(`Internal Server Error: ${error.message}`, {
			status: 500,
		});
	}
}

export async function GET() {
	try {
		//return the sorter camera positions from the in memory cache
		return new Response(JSON.stringify(cacheForSorterCameraPositions), {
			status: 200,
		});
	} catch (err) {
		const error = err as Error;

		return new Response(`Internal Server Error: ${error.message}`, {
			status: 500,
		});
	}
}
