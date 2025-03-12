"use server";

import { autoCartonFaults } from "@prisma/client";

import db from "@/db/db";
import { hasPermission } from "@/utils/getUser";

interface FaultCodeLookup {
	ID: number;
	faultMessage: string;
}

interface ResultObject {
	[key: string]: {
		ID: number;
		line: number;
		faultName: string;
		timestamp: Date;
		machineType: string;
	};
}

export const getCartonClosingAllTimed = async (
	minutes: number
): Promise<ResultObject> => {
	const result: autoCartonFaults[] = await db.autoCartonFaults.findMany({
		where: {
			timestamp: {
				gte: new Date(Date.now() - minutes * 60 * 1000),
			},
		},
	});

	const faultCodes: FaultCodeLookup[] =
		await db.autoCartonFaultCodeLookup.findMany();

	let resultObject: ResultObject = {};

	for (const res of result) {
		const faultCode = faultCodes.find((code) => code.ID === res.faultCode);

		if (faultCode) {
			resultObject[res.ID] = {
				ID: res.ID,
				line: res.line,
				faultName: faultCode.faultMessage,
				timestamp: res.timestamp,
				machineType: res.machineType.toString(),
			};
		}
	}

	return resultObject;
};
