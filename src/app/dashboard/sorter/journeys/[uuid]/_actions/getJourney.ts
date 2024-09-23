"use server";

import db from "@/db/db";

export async function getJourney(uuid: string) {
	const result = await db.sorterJourneyRequests.findFirst({
		where: {
			id: uuid,
		},
	});

	if (!result) {
		return null;
	}

	return result;
}

export async function deleteAJourney(uuid: string) {
	const result = await db.sorterJourneyRequests.delete({
		where: {
			id: uuid,
		},
	});

	if (!result) {
		throw new Error("Failed to delete journey");
	}

	return result;
}
