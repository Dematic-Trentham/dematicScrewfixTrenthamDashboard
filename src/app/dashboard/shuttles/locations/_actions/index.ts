"use server";
import db from "@/db/db";

export const getLocations = async () => {
	let locations = await db.dmsShuttleLocations.findMany();

	return locations;
};
