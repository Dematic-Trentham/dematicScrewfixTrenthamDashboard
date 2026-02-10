"use server";

import db from "@/db/db";

export async function getParameter(parameter: string) {
	const param = await db.dashboardSystemParameters.findUnique({
		where: { parameter: parameter },
	});

	return param ? param.value : null;
}

export async function getAllParameters() {
	try {
		const params = await db.dashboardSystemParameters.findMany({
			orderBy: { parameter: "asc" },
		});
		const paramObject: Record<string, [string, Date | null]> = {};

		params.forEach((param) => {
			paramObject[param.parameter] = [param.value, param.lastModified];
		});

		return paramObject;
	} catch (error) {
		return { error: (error as Error).message };
	}
}

export type typeParameter = {
	parameter: string;
	value: string;
	lastModified: Date | null;
};
export type typeParameters = {
	[key: string]: [string, Date | null];
};

export async function updateParameter(parameter: string, value: string) {
	const updatedParam = await db.dashboardSystemParameters.upsert({
		where: { parameter: parameter },
		update: { value: value },
		create: { parameter: parameter, value: value },
	});

	return updatedParam;
}

export async function updateMultipleParameters(params: Record<string, string>) {
	console.log("Updating multiple parameters:", params);

	console.log("Updating multiple parameters:", params);

	for (const [parameter, value] of Object.entries(params)) {
		console.log(`Updating parameter: ${parameter} with value: ${value}`);

		await db.dashboardSystemParameters
			.upsert({
				where: { parameter: parameter },
				update: { value: value, lastModified: new Date() },
				create: {
					parameter: parameter,
					value: value,
					lastModified: new Date(),
				},
			})
			.then((updatedParam) => {
				console.log(
					`Parameter ${parameter} updated successfully:`,
					updatedParam
				);
			})
			.catch((error) => {
				console.error(`Error updating parameter ${parameter}:`, error);
			});
	}
}
