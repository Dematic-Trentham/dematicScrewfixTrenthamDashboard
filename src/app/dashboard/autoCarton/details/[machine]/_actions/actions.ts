"use server";

import { excludedFaults2 } from "../../../excludedFaults";

import db from "@/db/db";
import { hasPermission } from "@/utils/getUser";

type autoCartonMachineType =
	| "erector"
	| "Lidder"
	| "iPack"
	| "labeler"
	| "barcoder";

export async function getAutoCartonFaults(
	minutes: number,
	machineType: autoCartonMachineType,
	line: number
) {
	const faultCodes = await db.autoCartonFaultCodeLookup.findMany();

	// Fetch only relevant fault codes first to reduce data size
	const faultCodeIds = faultCodes.map((fc) => fc.ID);

	const data = await db.autoCartonFaults.findMany({
		where: {
			timestamp: {
				gte: new Date(Date.now() - minutes * 60 * 1000),
			},
			machineType,
			line,
			faultCode: { in: faultCodeIds }, // filter to only known fault codes
		},
		select: {
			// select only needed fields to reduce payload
			faultCode: true,
			// add other fields you actually use below
			timestamp: true,
			// ...etc
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
		const faultCode = faultCodes.find(
			(code: { ID: number }) => code.ID === item.faultCode
		);

		return {
			...item,
			faultCode: faultCode?.faultMessage || "Unknown",
		};
	});

	return mergedData;
}
