"use server";

import db from "@/db/db";

export const getShuttleFromId = async (shuttleID: string) => {
	let shuttle = await db.dmsShuttleLocations.findFirst({
		where: {
			shuttleID: shuttleID,
		},
	});

	return shuttle;
};

export const getShuttleFromMac = async (macAddress: string) => {
	let shuttle = await db.dmsShuttleLocations.findUnique({
		where: {
			macAddress: macAddress,
		},
	});

	return shuttle;
};

export const updateShuttleId = async (
	macAddress: string,
	newShuttleId: string
) => {
	let shuttle = await db.dmsShuttleLocations.update({
		where: {
			macAddress: macAddress,
		},
		data: {
			shuttleID: newShuttleId,
		},
	});
};
