"use server";

import db from "@/db/db";

export const getOrderStartStats = async () => {
	const result = await db.siteParameters.findMany();

	//convert into an object where the key is the name
	let resultObject: {
		[key: string]: {
			id: string;
			lastUpdated: Date;
			name: string;
			location: string;
			description: string;
			value: string;
		};
	} = {};

	result.forEach((res) => {
		resultObject[res.name] = res;
	});

	return resultObject;
};
