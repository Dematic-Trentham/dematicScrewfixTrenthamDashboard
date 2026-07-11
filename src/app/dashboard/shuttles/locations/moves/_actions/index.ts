"use server";
import db from "@/db/db";

//move type
export type ShuttleMove = {
	ID: string;
	timestamp: Date;
	aisle: number;
	level: number;
	oldMacAddress: string;
	newMacAddress: string;
	oldShuttleID: string;
	newShuttleID: string;
};

export async function getAllShuttleMoves(): Promise<ShuttleMove[]> {
	const moves = await db.dmsShuttleSwapLogs.findMany({
		orderBy: {
			timestamp: "desc",
		},
	});

	return moves;
}
