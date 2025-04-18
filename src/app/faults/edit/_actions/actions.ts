"use server";

import db from "@/db/db";

export async function getAllFaultLogCodes() {
	const data = await db.faultText.findMany({});

	return data;
}

export async function getFaultLogCodeById(id: string) {
	const data = await db.faultText.findUnique({
		where: { id },
	});

	return data;
}

interface FaultLogCodeData {
	title: string;
	message: string;
}

export async function createFaultLogCode(data: FaultLogCodeData) {
	const newFaultLogCode = await db.faultText.create({
		data: {
			title: data.title,
			message: data.message,
		},
	});

	return newFaultLogCode;
}

export async function updateFaultLogCode(id: string, data: FaultLogCodeData) {
	const updatedFaultLogCode = await db.faultText.update({
		where: { id },
		data: {
			title: data.title,
			message: data.message,
		},
	});

	return updatedFaultLogCode;
}

export async function deleteFaultLogCode(id: string) {
	const deletedFaultLogCode = await db.faultText.delete({
		where: { id },
	});

	return deletedFaultLogCode;
}
