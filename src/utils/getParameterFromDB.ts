import db from "@/db/db";

export async function getParameterFromDB(parameter: string) {
	const result = await db.dashboardSystemParameters.findFirst({
		where: {
			parameter: parameter,
		},
	});

	//if no result raise an error
	if (!result) {
		//create the parameter with empty value
		await db.dashboardSystemParameters.create({
			data: {
				parameter: parameter,
				value: "",
			},
		});

		throw new Error(
			`Parameter ${parameter} not found in the database and has been created with an empty value`
		);
	}

	return result?.value;
}
