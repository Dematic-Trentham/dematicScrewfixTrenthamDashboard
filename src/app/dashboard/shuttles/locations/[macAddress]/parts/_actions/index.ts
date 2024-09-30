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

	return shuttle;
};

export const getShuttleFaults = async (macAddress: string, days: number) => {
	let faults = await db.dmsShuttleFaultLogs.findMany({
		where: {
			macAddress: macAddress,
			timestamp: {
				gte: new Date(new Date().getTime() - days * 24 * 60 * 60 * 1000),
			},
		},
		orderBy: {
			timestamp: "desc",
		},
	});

	return faults;
};

export const getLocationFaults = async (
	aisle: number,
	level: number,
	days: number
) => {
	let faults = await db.dmsShuttleFaultLogs.findMany({
		where: {
			aisle: aisle,
			level: level,
			timestamp: {
				gte: new Date(new Date().getTime() - days * 24 * 60 * 60 * 1000),
			},
		},
		orderBy: {
			timestamp: "desc",
		},
	});

	return faults;
};

export const getFaultCodeLookup = async () => {
	let faultCodes = await db.dmsShuttleFaultCodeLookup.findMany();

	return faultCodes;
};
