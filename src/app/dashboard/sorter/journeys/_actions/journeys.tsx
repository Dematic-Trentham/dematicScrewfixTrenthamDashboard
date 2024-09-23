"use server";

import db from "@/db/db";

export async function getAllJourneys() {
	const result = await db.sorterJourneyRequests.findMany({
		where: {
			requestedUL: {
				not: "master",
			},
		},
		orderBy: {
			createdDate: "desc",
		},
	});

	if (!result) {
		throw new Error("No requests found");
	}

	return result;
}

//get master journey (actually status)
export async function getMasterJourney() {
	const result = await db.sorterJourneyRequests.findFirst({
		where: {
			requestedUL: "master",
		},
	});

	if (!result) {
		throw new Error("No requests found");
	}

	return result;
}
