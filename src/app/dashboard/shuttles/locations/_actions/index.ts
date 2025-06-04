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

export const getTotalMissions = async (days: number) => {
	let missions = await db.dmsShuttleMissions.findMany({
		where: {
			timeStamp: {
				gte: new Date(new Date().getTime() - days * 24 * 60 * 60 * 1000),
			},
		},
	});

	//add the missions together
	let totalMissions = missions.reduce((acc, mission) => {
		return acc + mission.totalDrops + mission.totalPicks + mission.totalIATs;
	}, 0);

	return totalMissions;
};

export const getTotalFaults = async (days: number) => {
	let faults = await db.dmsShuttleFaultLogs.findMany({
		where: {
			timestamp: {
				gte: new Date(new Date().getTime() - days * 24 * 60 * 60 * 1000),
			},
		},
	});

	//add the faults together
	let totalFaults = faults.reduce((acc, fault) => {
		return acc + 1;
	}, 0);

	return totalFaults;
};
