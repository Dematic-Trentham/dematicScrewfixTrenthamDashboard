"use server";
import db from "@/db/db";

export const getLocations = async () => {
	let locations = await db.dmsShuttleLocations.findMany();

	return locations;
};

export const getShuttleFaults = async (days: number) => {
	let faults = await db.dmsShuttleFaultLogs.findMany({
		where: {
			timestamp: {
				gte: new Date(new Date().getTime() - days * 24 * 60 * 60 * 1000),
			},
		},
	});

	return faults;
};
