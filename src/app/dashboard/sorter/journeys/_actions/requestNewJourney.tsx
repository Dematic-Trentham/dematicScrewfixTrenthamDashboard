"use server";

import { revalidatePath } from "next/cache";

import db from "@/db/db";

export async function requestNewJourneyToDB(ul: string) {
	//screwfix uses a 8 digit number
	if (ul.length !== 8) {
		throw new Error("Please enter a valid UL");
	}

	//add to db

	const result = await db.sorterJourneyRequests.create({
		data: {
			requestedUL: ul,
			status: "REQUESTED",
			createdDate: new Date(),
			journey: "",
		},
	});

	revalidatePath("/dashboard/sorter/journeys");

	return ul;
}
