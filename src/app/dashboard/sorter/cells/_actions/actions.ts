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
