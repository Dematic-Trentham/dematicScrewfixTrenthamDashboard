"use server";
import { unstable_cache } from "next/cache";

import db from "@/db/db";
import { getParameterFromDB } from "@/utils/getParameterFromDB";

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

export const getAllCounts = async (days: number) => {
	const counts = await db.dmsShuttleMissions.findMany({
		where: {
			timeStamp: {
				gte: new Date(new Date().getTime() - days * 24 * 60 * 60 * 1000),
			},
		},
	});

	return counts;
};

export const getShuttleLocations = async () => {
	const locations = await db.dmsShuttleLocations.findMany();

	return locations;
};

export const getShuttleFaultsAndCountsNumbers = async (days: number) => {
	console.log("❌ MISS: fetching fresh data for", days);
	const [faults, counts, locations] = await Promise.all([
		getShuttleFaults(days),
		getAllCounts(days),
		getShuttleLocations(),
	]);

	const faultCounts = faults.reduce(
		(acc, fault) => {
			const key = fault.shuttleID;

			acc[key] = (acc[key] || 0) + 1;

			return acc;
		},
		{} as Record<string, number>
	);

	//console.log(counts);

	let missionCounts: Record<string, number> = {};

	for (const count of counts) {
		const key = count.aisle.toString() + "." + count.level.toString();

		missionCounts[key] =
			(missionCounts[key] || 0) +
			count.totalDrops +
			count.totalPicks +
			count.totalIATs;
	}

	console.log(missionCounts);

	// Sort the keys alphabetically
	const sortedFaultCounts = Object.fromEntries(
		Object.entries(faultCounts).sort(([a], [b]) => a.localeCompare(b))
	);

	const sortedMissionCounts = Object.fromEntries(
		Object.entries(missionCounts).sort(([a], [b]) => a.localeCompare(b))
	);

	const totalFaults = Object.values(sortedFaultCounts).reduce(
		(acc, count) => acc + count,
		0
	);

	const totalMissions = Object.values(sortedMissionCounts).reduce(
		(acc, count) => acc + count,
		0
	);

	return {
		sortedFaultCounts,
		sortedMissionCounts,
		totalFaults,
		totalMissions,
		locations,
	};
};

export const getShuttleFaultsAndCountsNumbersCache = async (days: number) => {
	return await unstable_cache(
		async () => {
			const data = await getShuttleFaultsAndCountsNumbers(days);

			cacheStore[`getShuttleFaultsAndCountsNumbers-${days}`] = {
				timestamp: Date.now(),
			};

			return data;
		},
		[`getShuttleFaultsAndCountsNumbers-${days}`], // unique key per "days"
		{ revalidate: 60 } // 1m cache
	)();
};

const cacheStore: Record<string, { timestamp: number }> = {};

export const hasShuttleFaultsAndCountsNumbersCache = async (
	days: number
): Promise<boolean> => {
	const key = `getShuttleFaultsAndCountsNumbers-${days}`;

	// Check if the cache exists and is still valid
	if (cacheStore[key]) {
		const { timestamp } = cacheStore[key];
		const isValid = Date.now() - timestamp < 60 * 1000; // 1 minute cache

		return isValid;
	}

	return false;
};

export const aisleAndLevelAmount = async () => {
	const amountOfAislesResult = await getParameterFromDB("dmsAmountOfAisles");
	const amountOfLevelsResult = await getParameterFromDB("dmsAmountOfLevels");

	return {
		amountOfAisles: amountOfAislesResult,
		amountOfLevels: amountOfLevelsResult,
	};
};

export const addMaintenanceLog = async (
	macAddress: string,
	maintenanceLog: string
) => {
	try {
		const shuttle = await db.dmsShuttleLocations.findUnique({
			where: { macAddress: macAddress },
		});

		if (!shuttle) {
			return { error: "Shuttle not found" };
		}
		await db.dmsShuttleLastMaintenance.create({
			data: {
				macAddress: macAddress,
				shuttleID: shuttle.shuttleID, // Add shuttleID from the found shuttle
				maintenanceDetails: maintenanceLog,
				lastMaintenanceDate: new Date(),
			},
		});

		return { success: true };
	} catch (error) {
		return { error: "Failed to add maintenance log" };
	}
};

export const getMaintenanceLogs = async (macAddress: string) => {
	try {
		const logs = await db.dmsShuttleLastMaintenance.findMany({
			where: { macAddress: macAddress },
			orderBy: { lastMaintenanceDate: "desc" },
		});

		return logs;
	} catch (error) {
		return { error: "Failed to retrieve maintenance logs" };
	}
};
