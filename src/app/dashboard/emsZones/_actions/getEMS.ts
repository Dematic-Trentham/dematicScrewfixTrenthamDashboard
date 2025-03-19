"use server";
import db from "@/db/db";

export const getEMS = async () => {
	const ems = await (
		await db.siteEMS.findMany()
	).sort((a, b) => a.name.localeCompare(b.name));

	//error handling
	if (!ems) {
		return { error: "No EMS found" };
	}

	return ems;
};
