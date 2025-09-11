"use server";

import { unstable_cache } from "next/cache";

import db from "@/db/db";

export const getAllLiftMissionsLast24Hours = unstable_cache(
	async () => {
		const result = await db.dMSLiftMovements.findMany({
			where: {
				timestamp: {
					gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
				},
			},
		});

		//group data by aisle and lift number
		const groupedData = result.reduce<Record<string, typeof result>>( // Explicit type
			(acc, mission) => {
				const key = `${mission.aisle}-${mission.liftNumber}`;

				if (!acc[key]) {
					acc[key] = [];
				}
				acc[key].push(mission);

				return acc;
			},
			{}
		);

		// the count is a total we want the difference for the first and last record of each group
		const finalData = Object.entries(groupedData).reduce<
			Record<string, number>
		>((acc, [key, missions]) => {
			if (missions.length > 0) {
				const first = missions[0];
				const last = missions[missions.length - 1];

				acc[key] = last.totalAtTime - first.totalAtTime;
			}

			return acc;
		}, {});

		return finalData;
	},
	["getAllLiftMissionsLast24Hours"],
	{ revalidate: 300 } // cache for 5 minutes
);

export const getAllLiftMissionsLast24HoursHourly = unstable_cache(
	async () => {
		const result = await db.dMSLiftMovements.findMany({
			where: {
				timestamp: {
					gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
				},
			},
		});

		//group data by aisle and lift number
		const groupedData = result.reduce<Record<string, typeof result>>( // Explicit type
			(acc, mission) => {
				const key = `${mission.aisle}-${mission.liftNumber}`;

				if (!acc[key]) {
					acc[key] = [];
				}
				acc[key].push(mission);

				return acc;
			},
			{}
		);

		console.log("Fetched lift missions from DB:", result.length);
		console.log(groupedData);

		return groupedData;
	},
	["getAllLiftMissionsLast24Hours"],
	{ revalidate: 300 } // cache for 5 minutes
);

export const getAllLiftMissionsLastXGroupedHourly = unstable_cache(
	async (hours: number) => {
		type MissionWithDifference = {
			ID: number;
			timestamp: Date;
			aisle: number;
			liftNumber: number;
			totalAtTime: number;
			difference?: number;
		};

		const result = (await db.dMSLiftMovements.findMany({
			where: {
				timestamp: {
					gte: new Date(Date.now() - hours * 60 * 60 * 1000), // Last X hours
				},
			},
		})) as MissionWithDifference[];

		//group data by aisle and lift number
		const groupedData = result.reduce<Record<string, MissionWithDifference[]>>( // Explicit type
			(acc, mission) => {
				const key = `${mission.aisle}-${mission.liftNumber}`;

				if (!acc[key]) {
					acc[key] = [];
				}
				acc[key].push(mission);

				return acc;
			},
			{}
		);

		//add difference between each record and the previous record as a new field "difference"
		Object.values(groupedData).forEach((missions) => {
			missions.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

			for (let i = 1; i < missions.length; i++) {
				const prev = missions[i - 1];
				const curr = missions[i];

				curr.difference = curr.totalAtTime - prev.totalAtTime;
			}
		});

		//sort newest to oldest
		Object.values(groupedData).forEach((missions) => {
			missions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
		});

		return groupedData;
	},

	//sort newest to oldest

	["getAllLiftMissionsLastXHoursHourly"],
	{ revalidate: 300 } // cache for 5 minutes
);

export const getAllLiftMissionsLastXGroupedDays = unstable_cache(
	async (hours: number) => {
		type MissionWithDifference = {
			ID: number;
			timestamp: Date;
			aisle: number;
			liftNumber: number;
			totalAtTime: number;
			difference?: number;
		};

		const result = (await db.dMSLiftMovements.findMany({
			where: {
				timestamp: {
					gte: new Date(Date.now() - hours * 60 * 60 * 1000), // Last X hours
				},
			},
		})) as MissionWithDifference[];
		//group data by aisle and lift number
		const groupedData = result.reduce<Record<string, MissionWithDifference[]>>( // Explicit type
			(acc, mission) => {
				const key = `${mission.aisle}-${mission.liftNumber}`;

				if (!acc[key]) {
					acc[key] = [];
				}
				acc[key].push(mission);

				return acc;
			},
			{}
		);

		//for each aisle and lift number , group by day
		const dailyGroupedData: Record<string, MissionWithDifference[]> = {};

		Object.entries(groupedData).forEach(([key, missions]) => {
			const dailyGroups: Record<string, MissionWithDifference[]> = {};

			missions.forEach((mission) => {
				const dayKey = mission.timestamp.toISOString().split("T")[0]; // YYYY-MM-DD

				if (!dailyGroups[dayKey]) {
					dailyGroups[dayKey] = [];
				}
				dailyGroups[dayKey].push(mission);
			});
			//for each day, get the first and last record and calculate the difference
			Object.values(dailyGroups).forEach((dayMissions) => {
				dayMissions.sort(
					(a, b) => a.timestamp.getTime() - b.timestamp.getTime()
				);
				if (dayMissions.length > 0) {
					const first = dayMissions[0];
					const last = dayMissions[dayMissions.length - 1];

					last.difference = last.totalAtTime - first.totalAtTime;
					if (!dailyGroupedData[key]) {
						dailyGroupedData[key] = [];
					}
					dailyGroupedData[key].push(last);
				}
			});
		});

		//sort newest to oldest
		Object.values(dailyGroupedData).forEach((missions) => {
			missions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
		});

		return dailyGroupedData;
	},
	["getAllLiftMissionsLastXDays"],
	{ revalidate: 300 } // cache for 5 minutes
);
