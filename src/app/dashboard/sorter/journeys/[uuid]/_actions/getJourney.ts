"use server";

import db from "@/db/db";

export async function getJourney(uuid: string) {
	const result = await db.sorterJourneyRequests.findFirst({
		where: {
			id: uuid,
		},
	});

	if (!result) {
		throw new Error("No requests found");
	}

	return result;
}
