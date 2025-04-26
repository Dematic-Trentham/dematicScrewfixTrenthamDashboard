"use server";
import { unstable_cache } from "next/cache";

import db from "@/db/db";
import { hasPermission } from "@/utils/getUser";

export async function getStatus(): Promise<{
	error: string | null;
	data:
		| {
				id: string;
				ipAddress: string;
				machineName: string;
				plc: boolean;
				plcSlot: number;
				pingStatus: boolean;
				pingTimeMS: number;
				plcStatus: boolean;
				lastUpdated: Date;
		  }[]
		| [];
}> {
	const data = await db.ipsToPing.findMany({
		orderBy: {
			machineName: "asc",
		},
	});

	if (data === null) {
		return {
			error: "Failed to fetch IPs",
			data: [],
		};
	}

	if (data.length === 0) {
		return {
			error: "No IPs to check",
			data: [],
		};
	}

	return {
		error: null,
		data: data.map((item) => ({
			id: item.id,
			ipAddress: item.ipAddress,
			machineName: item.machineName ?? "Unknown",
			plc: item.plc ?? false,
			plcSlot: item.plcSlot ?? 0,
			pingStatus: item.pingStatus ?? false,
			pingTimeMS: item.pingTimeMS ?? 0,
			plcStatus: item.plcStatus ?? false,
			lastUpdated: item.lastUpdated ?? new Date(),
		})),
	};
}

export async function getStatusById(id: string) {
	const data = await db.ipsToPing.findUnique({
		where: {
			id: id,
		},
	});

	if (data === null) {
		return {
			error: "Failed to fetch IP",
			data: null,
		};
	}

	return {
		error: null,
		data: data,
	};
}

export async function getHistoryByIP(ip: string, limit: number) {
	const data = await db.pingHistory.findMany({
		where: {
			ipAddress: ip,
		},
		take: limit,
		orderBy: {
			createdAt: "desc",
		},
	});

	if (data === null) {
		return {
			error: "Failed to fetch history",
			data: null,
		};
	}

	return {
		error: null,
		data: data,
	};
}

export async function addIp(
	ipAddress: string,
	machineName: string,
	isPLC: boolean,
	plcSlot: number
) {
	if ((await hasPermission("systemScanner")) === false) {
		return {
			error: "You do not have permission to add IPs",
			data: null,
		};
	}
	const existingIp = await db.ipsToPing.findUnique({
		where: {
			ipAddress: ipAddress,
		},
	});

	if (existingIp) {
		return {
			error: "IP address already exists",
			data: null,
		};
	}

	const existingMachineName = await db.ipsToPing.findFirst({
		where: {
			machineName: machineName,
		},
	});

	if (existingMachineName) {
		return {
			error: "Machine name already exists",
			data: null,
		};
	}

	const data = await db.ipsToPing.create({
		data: {
			ipAddress: ipAddress,
			machineName: machineName,
			plc: isPLC,
			plcSlot: plcSlot,
		},
	});

	if (data === null) {
		return {
			error: "Failed to add IP",
			data: null,
		};
	}

	return {
		error: null,
		data: data,
	};
}

export async function deleteIp(id: string) {
	if ((await hasPermission("systemScanner")) === false) {
		return {
			error: "You do not have permission to delete IPs",
			data: null,
		};
	}

	const data = await db.ipsToPing.delete({
		where: {
			id: id,
		},
	});

	if (data === null) {
		return {
			error: "Failed to delete IP",
			data: null,
		};
	}

	return {
		error: null,
		data: data,
	};
}

export async function updateIp(
	id: string,
	ipAddress: string,
	machineName: string,
	isPLC: boolean,
	plcSlot: number
) {
	if ((await hasPermission("systemScanner")) === false) {
		return {
			error: "You do not have permission to update IPs",
			data: null,
		};
	}

	const data = await db.ipsToPing.update({
		where: {
			id: id,
		},
		data: {
			ipAddress: ipAddress,
			machineName: machineName,
			plc: isPLC,
			plcSlot: plcSlot,
		},
	});

	if (data === null) {
		return {
			error: "Failed to update IP",
			data: null,
		};
	}

	return {
		error: null,
		data: data,
	};
}
