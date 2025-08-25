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

	const missionCounts = counts.reduce(
		(acc, count) => {
			const key = count.aisle + "." + count.level;

			acc[key] = (acc[key] || 0) + 1;

			return acc;
		},
		{} as Record<string, number>
	);

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
