"use server";

import db from "@/db/db";

export async function getAllCells() {
	const result = await db.sorterDisabledCells.findMany({
		orderBy: {
			cellNumber: "asc",
		},
	});

	return result;
}

export async function getAllCellsHistory(timeToSearchDays: number) {
	const result = await db.sorterDisabledCellsHistory.findMany({
		orderBy: {
			dateChanged: "desc",
		},
		where: {
			dateChanged: {
				gte: new Date(Date.now() - timeToSearchDays * 24 * 60 * 60 * 1000), // Convert days to milliseconds
			},
		},
	});

	return result;
}
