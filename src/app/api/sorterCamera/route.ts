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

type SorterCameraPositionType = {
	date: string;
	cellNumber: number;
	ulType: string;
	xPosition: number;
	yPosition: number;
	rotation: number;
	width: number;
	height: number;
	confidence: number;
};

export async function POST(request: Request) {
	try {
		//get the request body
		const requestBody = await request.json();

		//check if the request body has all the required keys and types
		if (
			!requestBody.hasOwnProperty("date") ||
			!requestBody.hasOwnProperty("cellNumber") ||
			!requestBody.hasOwnProperty("ulType") ||
			!requestBody.hasOwnProperty("xPosition") ||
			!requestBody.hasOwnProperty("yPosition") ||
			!requestBody.hasOwnProperty("rotation") ||
			!requestBody.hasOwnProperty("width") ||
			!requestBody.hasOwnProperty("height") ||
			!requestBody.hasOwnProperty("confidence") ||
			typeof requestBody.date !== "string" ||
			typeof requestBody.cellNumber !== "number" ||
			typeof requestBody.ulType !== "string" ||
			typeof requestBody.xPosition !== "number" ||
			typeof requestBody.yPosition !== "number" ||
			typeof requestBody.rotation !== "number" ||
			typeof requestBody.width !== "number" ||
			typeof requestBody.height !== "number" ||
			typeof requestBody.confidence !== "number"
		) {
			return new Response(
				"Bad Request: Invalid request body missing " +
					[
						!requestBody.hasOwnProperty("date") ? "date" : null,
						!requestBody.hasOwnProperty("cellNumber") ? "cellNumber" : null,
						!requestBody.hasOwnProperty("ulType") ? "ulType" : null,
						!requestBody.hasOwnProperty("xPosition") ? "xPosition" : null,
						!requestBody.hasOwnProperty("yPosition") ? "yPosition" : null,
						!requestBody.hasOwnProperty("rotation") ? "rotation" : null,
						!requestBody.hasOwnProperty("width") ? "width" : null,
						!requestBody.hasOwnProperty("height") ? "height" : null,
						!requestBody.hasOwnProperty("confidence") ? "confidence" : null,
					]
						.filter((key) => key !== null)
						.join(", "),
				{
					status: 400,
				}
			);
		}
		console.log(requestBody);

		//if the request body is valid, add the sorter camera position to the in memory cache
		cacheForSorterCameraPositions.push(requestBody);
	} catch (err) {
		const error = err as Error;

		return new Response(`Internal Server Error: ${error.message}`, {
			status: 500,
		});
	}
}

export async function GET(request: Request) {
	try {
		//if we have a query parameter called cellNumber, then filter the sorter camera positions by cellNumber
		const url = new URL(request.url);
		const cellNumber = url.searchParams.get("cellNumber");

		let cacheForSorterCameraPositionsTemp: SorterCameraPositionType[] = [];

		if (cellNumber) {
			cacheForSorterCameraPositionsTemp = cacheForSorterCameraPositions.filter(
				(position) => position.cellNumber === Number(cellNumber)
			);
		} else {
			cacheForSorterCameraPositionsTemp = cacheForSorterCameraPositions;
		}

		//return the sorter camera positions from the in memory cache
		return new Response(
			JSON.stringify(
				cacheForSorterCameraPositionsTemp ?? cacheForSorterCameraPositions,
				null,
				2
			),
			{
				status: 200,
			}
		);
	} catch (err) {
		const error = err as Error;

		console.error("Error in GET /api/sorterCamera:", error);

		return new Response(`Internal Server Error: ${error.message}`, {
			status: 500,
		});
	}
}

//remove sorter camera positions from the in memory cache that are older than 2 hours every 5 minutes
setInterval(
	() => {
		const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;

		//remove sorter camera positions from the in memory cache that are older than 2 hours
		for (let i = cacheForSorterCameraPositions.length - 1; i >= 0; i--) {
			const position = cacheForSorterCameraPositions[i];

			if (new Date(position.date).getTime() < twoHoursAgo) {
				cacheForSorterCameraPositions.splice(i, 1);
			}
		}
	},
	5 * 60 * 1000
);
