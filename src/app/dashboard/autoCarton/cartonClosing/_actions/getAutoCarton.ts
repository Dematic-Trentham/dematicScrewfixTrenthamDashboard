"use server";

import db from "@/db/db";
import { autoCartonMachineType } from "@prisma/client";

export const getAutoCartonFaults = async (
	timePeriod: number,
	wantedMachines: autoCartonMachineType[]
): Promise<{ faults: any[]; faultCodes: any[] } | { error: string }> => {
	// Get the faults and fault codes from the database concurrently
	const [result, faultCodes] = await Promise.all([
		db.autoCartonFaults.findMany({
			where: {
				AND: [
					{
						timestamp: {
							gte: new Date(Date.now() - timePeriod * 60 * 1000),
						},
					},
					{
						machineType: {
							in: [...wantedMachines],
						},
					},
				],
			},
		}),
		db.autoCartonFaultCodeLookup.findMany(),
	]);

	//has both the faults and fault codes returned okay

	if (result === null || faultCodes === null) {
		if (result === null) {
			console.log("get autoCarton Error fetching faults from the database");
		}
		if (faultCodes === null) {
			console.log(
				"get autoCarton Error fetching fault codes from the database"
			);
		}

		return { error: "Error fetching data from the database" };
	}

	//send the data back to the client
	return { faults: result, faultCodes: faultCodes };
};
