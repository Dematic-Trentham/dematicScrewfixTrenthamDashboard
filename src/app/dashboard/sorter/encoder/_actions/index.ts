"use server";

import db from "@/db/db";
const cacheStore: Record<string, { timestamp: number }> = {};

import { unstable_cache } from "next/cache";

import { getParameterFromDB } from "@/utils/getParameterFromDB";

export async function resetEncoderAlarm() {}

export async function getEncoderAlarm() {}

export async function getLastSorterEncoderFaults(hours: number) {
	return await unstable_cache(
		async () => {
			const data = await getLastSorterEncoderFaultsDB(hours);

			cacheStore[`getShuttleFaultsAndCountsNumbers-${hours}`] = {
				timestamp: Date.now(),
			};

			return data;
		},
		[`getShuttleFaultsAndCountsNumbers-${hours}`], // unique key per "hours" and "alarmAt"
		{ revalidate: 60 } // 1m cache
	)();
}

export async function getLastSorterEncoderFaultsDB(hours: number) {
	//try {
	const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);

	const encoderHasNotSeenCell = await db.sorterEncoderHasNotSeenCell.findMany({
		where: {
			createdAt: {
				gte: cutoffTime,
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	const encoderHasNotSeenPhotoCell =
		await db.sorterEncoderHasSeenPhotoCell.findMany({
			where: {
				createdAt: {
					gte: cutoffTime,
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		});

	return { encoderHasNotSeenCell, encoderHasNotSeenPhotoCell };
	//} catch (error) {
	//	console.error("Error fetching sorter encoder faults:", error);

	//	return { error: { message: "Database query failed", error } };
	//}
}

export async function getShouldWeBeAlarmingForSorterEncoder() {
	const alarmAtAmountOfFaults =
		(await getParameterFromDB("sorterEncoderAlarmAtAmountOfFaults", "10").then(
			Number
		)) || 10;

	const cutoffTime = new Date(Date.now() - 1 * 60 * 60 * 1000); // last 1 hour

	// Sum the "countPerHourcoloum" column for records in the last hour
	const sumResult = await db.sorterEncoderHasNotSeenCell.aggregate({
		where: {
			createdAt: {
				gte: cutoffTime,
			},
		},
		_sum: {
			countPerHour: true,
		},
	});

	const faults = sumResult._sum.countPerHour ?? 0;

	return {
		shouldAlarm: faults >= alarmAtAmountOfFaults,
		faults,
		alarmAtAmountOfFaults,
	};
}

export async function cacheGetShouldWeBeAlarmingForSorterEncoder() {
	return await unstable_cache(
		async () => {
			const data = await getShouldWeBeAlarmingForSorterEncoder();

			return data;
		},
		[`getShouldWeBeAlarmingForSorterEncoder`], // unique key per "hours" and "alarmAt"
		{ revalidate: 60 } // 1m cache
	)();
}
