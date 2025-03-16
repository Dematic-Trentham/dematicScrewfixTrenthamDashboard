"use server";

import { excludedFaults2 } from "../../../excludedFaults";

import db from "@/db/db";
import { hasPermission } from "@/utils/getUser";

type autoCartonMachineType = "erector" | "Lidder" | "iPack";

export async function getAutoCartonFaults(
	minutes: number,
	machineType: autoCartonMachineType,
	line: number
) {
	const faultCodes = await db.autoCartonFaultCodeLookup.findMany();

	const data = await db.autoCartonFaults.findMany({
		where: {
			timestamp: {
				gte: new Date(Date.now() - minutes * 60 * 1000),
			},
			machineType: machineType,
			line: line,
		},
	});

	// if no data is found, return an error
	if (data.length === 0) {
		return { error: "No data found" };
	}

	// if no fault codes are found, return an error
	if (faultCodes.length === 0) {
		return { error: "No fault codes found" };
	}

	// merge the fault codes with the data
	const mergedData = data.map((item: { faultCode: number }) => {
		const faultCode = faultCodes.find((code) => code.ID === item.faultCode);

		return {
			...item,
			faultCode: faultCode?.faultMessage || "Unknown",
		};
	});

	return mergedData;
}
