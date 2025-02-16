"use server";

import db from "@/db/db";

export async function getCellHistory(
	cell: string
): Promise<{ errorString?: string; data?: any }> {
	//parse cell number
	const cellNumber = parseInt(cell);

	//did we get a valid cell number?
	if (isNaN(cellNumber)) {
		return { errorString: "Invalid cell number" };
	}

	const result = await db.sorterDisabledCellsHistory.findMany({
		where: {
			cellNumber: cellNumber,
		},
		orderBy: {
			date: "desc",
		},
	});

	if (!result || result.length === 0) {
		return { errorString: "No history found" };
	}

	return { data: result };
}
