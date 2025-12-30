"use server";

import db from "@/db/db";

export const getShuttleFromId = async (shuttleID: string) => {
	let shuttle = await db.dmsShuttleLocations.findFirst({
		where: {
			shuttleID: shuttleID,
		},
	});

	return shuttle;
};

export const getShuttleFromMac = async (macAddress: string) => {
	let shuttle = await db.dmsShuttleLocations.findUnique({
		where: {
			macAddress: macAddress,
		},
	});

	return shuttle;
};

export const deleteShuttle = async (macAddress: string) => {
	//check if macAddress is empty
	if (macAddress === "") {
		return {
			error: "Mac Address cannot be empty",
		};
	}

	//check shuttle id exists
	let shuttle = await db.dmsShuttleLocations.findUnique({
		where: {
			macAddress: macAddress,
		},
	});

	if (!shuttle) {
		return {
			error: "Shuttle ID does not exist",
		};
	}

	// if shuttle is in a location then it cannot be deleted
	if (shuttle.currentLocation !== "") {
		return {
			error: "Shuttle ID is in a location and cannot be deleted",
		};
	}

	//delete shuttle
	const result = await db.dmsShuttleLocations.delete({
		where: {
			macAddress: macAddress,
		},
	});

	if (!result) {
		return {
			error: "Failed to delete shuttle",
		};
	}

	return {
		message: "Shuttle deleted successfully",
	};
};

export const updateShuttleId = async (
	macAddress: string,
	newShuttleId: string
) => {
	//check if shuttleID already exists
	let shuttleExists = await db.dmsShuttleLocations.findFirst({
		where: {
			shuttleID: newShuttleId,
		},
	});

	if (shuttleExists) {
		return {
			error: "Shuttle ID already exists",
		};
	}
	//check if shuttleID is empty

	if (newShuttleId === "") {
		return {
			error: "Shuttle ID cannot be empty",
		};
	}
	//check if shuttleID is too long
	if (newShuttleId.length > 20) {
		return {
			error: "Shuttle ID cannot be more than 20 characters",
		};
	}

	//check if shuttleID is too short
	if (newShuttleId.length < 3) {
		return {
			error: "Shuttle ID cannot be less than 3 characters",
		};
	}

	//if should start with a F or S
	if (!/^[FS]/.test(newShuttleId)) {
		return {
			error: "Shuttle ID should start with a F or S",
		};
	}

	//then a -
	if (!/^[FS]-/.test(newShuttleId)) {
		return {
			error: "Shuttle ID should start with a F or S followed by a -",
		};
	}

	//then 3 numbers
	if (!/^[FS]-\d{3}/.test(newShuttleId)) {
		return {
			error:
				"Shuttle ID should start with a F or S followed by a - and 3 numbers",
		};
	}

	let shuttle = await db.dmsShuttleLocations.update({
		where: {
			macAddress: macAddress,
		},
		data: {
			shuttleID: newShuttleId,
		},
	});

	return shuttle;
};

export const getShuttleFaults = async (macAddress: string, days: number) => {
	let faults = await db.dmsShuttleFaultLogs.findMany({
		where: {
			macAddress: macAddress,
			timestamp: {
				gte: new Date(new Date().getTime() - days * 24 * 60 * 60 * 1000),
			},
		},
		orderBy: {
			timestamp: "desc",
		},
	});

	return faults;
};

export const getLocationFaults = async (
	aisle: number,
	level: number,
	days: number
) => {
	let faults = await db.dmsShuttleFaultLogs.findMany({
		where: {
			aisle: aisle,
			level: level,
			timestamp: {
				gte: new Date(new Date().getTime() - days * 24 * 60 * 60 * 1000),
			},
		},
		orderBy: {
			timestamp: "desc",
		},
	});

	return faults;
};

export const getShuttleMovementLogsByMac = async (
	macAddress: string,
	days: number
) => {
	let logs = await db.dmsShuttleSwapLogs.findMany({
		where: {
			AND: [
				{
					OR: [{ oldMacAddress: macAddress }, { newMacAddress: macAddress }],
				},
				{
					timestamp: {
						gte: new Date(new Date().getTime() - days * 24 * 60 * 60 * 1000),
					},
				},
			],
		},
		orderBy: {
			timestamp: "desc",
		},
	});

	return logs;
};

export const getShuttleMovementLogsByLocation = async (
	aisle: number,
	level: number,
	days: number
) => {
	let logs = await db.dmsShuttleSwapLogs.findMany({
		where: {
			aisle: aisle,
			level: level,
			timestamp: {
				gte: new Date(new Date().getTime() - days * 24 * 60 * 60 * 1000),
			},
		},
		orderBy: {
			timestamp: "desc",
		},
	});

	return logs;
};

export const getFaultCodeLookup = async () => {
	let faultCodes = await db.dmsShuttleFaultCodeLookup.findMany();

	return faultCodes;
};

export const getAllCounts = async (days: number) => {
	let counts = await db.dmsShuttleMissions.findMany({
		where: {
			timeStamp: {
				gte: new Date(new Date().getTime() - days * 24 * 60 * 60 * 1000),
			},
		},
	});

	return counts;
};

export const getShuttleCountsByID = async (ID: string, days: number) => {
	let counts = await db.dmsShuttleMissions.findMany({
		where: {
			shuttleID: ID,
			timeStamp: {
				gte: new Date(new Date().getTime() - days * 24 * 60 * 60 * 1000),
			},
		},
	});

	return counts;
};

export const getShuttleCountsByLocation = async (
	aisle: number,
	level: number,
	days: number
) => {
	let counts = await db.dmsShuttleMissions.findMany({
		where: {
			aisle: aisle,
			level: level,
			timeStamp: {
				gte: new Date(new Date().getTime() - days * 24 * 60 * 60 * 1000),
			},
		},
		orderBy: {
			timeStamp: "desc",
		},
	});

	return counts;
};

export const getLastMaintenances = async (macAddress: string) => {
	let maintenances = await db.dmsShuttleLastMaintenance.findMany({
		where: {
			macAddress: macAddress,
		},
		orderBy: {
			lastMaintenanceDate: "desc",
		},
	});

	if (maintenances.length === 0) {
		return null;
	}

	console.log("Last maintenance fetched:", maintenances.length);

	return maintenances;
};
