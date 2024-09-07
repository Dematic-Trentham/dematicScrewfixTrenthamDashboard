"use server";

import db from "@/db/db";

export async function getAllJourneys() {
	const result = await db.sorterJourneyRequests.findMany({
		orderBy: {
			createdDate: "desc",
		},
	});

	if (!result) {
		throw new Error("No requests found");
	}

	return result;
}
