"use server";

import db from "@/db/db";
import { hasPermission } from "@/utils/getUser";
import { exec } from "child_process";
import { promisify } from "util";

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

	result.forEach(
		(res: {
			id: string;
			lastUpdated: Date;
			name: string;
			location: string;
			description: string;
			value: string;
		}) => {
			resultObject[res.name] = res;
		}
	);

	return resultObject;
};

export const getsystemErrors = async () => {
	const result = await db.dashboardSystemErrors.findMany();

	return result;
};

export const getSystemErrorsNamed = async (system: string) => {
	const results = await getsystemErrors();

	return (
		results.filter(
			(result: { system: string; error: string }) => result.system === system
		)[0]?.error || ""
	);
};

export const restartWMSSystem = async () => {
	//ENSURE PERMISSIONS ARE CHECKED BEFORE CALLING THIS FUNCTION
	const permission = await hasPermission("RestartOrderStartStats");

	if (!permission) {
		return {
			success: false,
			error: "You do not have permission to restart the WMS system",
		};
	}

	//ssh into the server and restart the WMS system
	//get the IP address from the database
	const ip = await db.dashboardSystemParameters.findFirst({
		where: {
			parameter: "dockerhostIP",
		},
	});

	if (!ip) {
		return { success: false, error: "IP address for docker host not found" };
	}
	const sshCommand = `sshpass -p 'dematicdematic' ssh -o StrictHostKeyChecking=no -p 22 dematic@${ip.value} "docker restart dematic-dashboard-screwfix-trentham-wmstodb-1"`;
	const execPromise = promisify(exec);
	try {
		const { stdout, stderr } = await execPromise(sshCommand);
		if (stderr) {
			console.error(`Stderr: ${stderr}`);
			return { success: false, error: `Stderr: ${stderr}` };
		}

		console.log(`Stdout: ${stdout}`);

		return { success: true, message: "WMS system restarted successfully" };
	} catch (error) {
		console.error(`Error: ${error}`);
		return { success: false, error: `Error: ${error}` };
	}
};

export const restartPLCSystem = async () => {
	//ENSURE PERMISSIONS ARE CHECKED BEFORE CALLING THIS FUNCTION
	const permission = await hasPermission("RestartOrderStartStats");

	if (!permission) {
		return {
			success: false,
			error: "You do not have permission to restart the PLC system",
		};
	}

	//ssh into the server and restart the PLC system
	//get the IP address from the database
	const ip = await db.dashboardSystemParameters.findFirst({
		where: {
			parameter: "dockerhostIP",
		},
	});

	if (!ip) {
		return { success: false, error: "IP address for docker host not found" };
	}
	const sshCommand = `sshpass -p 'dematicdematic' ssh -o StrictHostKeyChecking=no -p 22 dematic@${ip.value} "docker restart dematic-dashboard-screwfix-trentham-plctodb-1"`;
	const execPromise = promisify(exec);
	try {
		const { stdout, stderr } = await execPromise(sshCommand);
		if (stderr) {
			console.error(`Stderr: ${stderr}`);
			return { success: false, error: `Stderr: ${stderr}` };
		}

		console.log(`Stdout: ${stdout}`);

		return { success: true, message: "PLC system restarted successfully" };
	} catch (error) {
		console.error(`Error: ${error}`);
		return { success: false, error: `Error: ${error}` };
	}
};

export const resetWMSpassword = async () => {
	//ENSURE PERMISSIONS ARE CHECKED BEFORE CALLING THIS FUNCTION
	const permission = await hasPermission("RestartOrderStartStats");

	if (!permission) {
		return {
			success: false,
			error: "You do not have permission to reset the WMS password",
		};
	}

	const result = await db.dashboardSystemParameters.update({
		where: {
			parameter: "dematic_dashboard_WMS_Credentials_Pass",
		},
		data: {
			value: "Dematic1",
		},
	});

	await db.dashboardSystemParameters.update({
		where: {
			parameter: "WMSFAILED",
		},
		data: {
			value: "true",
		},
	});

	if (!result) {
		return { success: false, error: "Failed to reset WMS password" };
	}

	return { success: true, message: "WMS password reset successfully" };
};
