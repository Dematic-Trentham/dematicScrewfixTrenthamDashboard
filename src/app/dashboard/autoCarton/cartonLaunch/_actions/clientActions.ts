import { getCartonClosingAllTimed } from "./../../cartonClosing/_actions/getAutoCarton";

import { TimePromise } from "@/utils/timePromise";
import config from "@/config";

export async function fetchData(
	totalTime: number,
	setLoading: any,
	setError: any,
	setDataold: any,
	setData: any
) {
	const tasks = [
		{
			name: "fetchOldData",
			task: TimePromise(fetchOldData(totalTime, setDataold)),
		},
		{
			name: "fetchNewData",
			task: TimePromise(fetchNewData(totalTime, setData)),
		},
	];

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const results = await Promise.all(
		tasks.map(({ name, task }) =>
			task.catch((error) => {
				// eslint-disable-next-line no-console
				console.error(`Error in function ${name}:`, error);
				setError(error);
			})
		)
	);

	setLoading(false);
}

//fetch data http://10.4.5.227:8080/json/mysqlGrouped?totalTime=
async function fetchOldData(totalTime: number, setDataold: any) {
	const url =
		"http://10.4.5.227:8080/json/mysqlGrouped?totalTime=" +
		totalTime.toString();

	try {
		const response = await fetch(url);
		const data = await response.json();
		const parsedData = await parseDataOld(data);

		setDataold(parsedData);

		return { status: "success", data: parsedData };
	} catch (err) {
		return { error: err };
	}
}

async function fetchNewData(totalTime: number, setData: any) {
	try {
		//get data from server
		const newData = await getCartonClosingAllTimed(totalTime);

		//if empty data then return
		if (!newData) {
			return { error: "No data found" };
		}

		const parsedData2 = await parseData(newData);

		setData(parsedData2);

		return { status: "success", data: parsedData2 };
	} catch (err) {
		return { error: err };
	}
}

//parse data
function parseDataOld(data: any) {
	const parsedData: {
		[key: string]: { [key: string]: { faults: any[]; connected: boolean } };
	} = {};

	for (const item of data.rows) {
		//strip out machine types that are not needed
		if (item.machinetype == "Lidder" || item.machinetype == "iPack") {
			continue;
		}

		const line = item.line.toString();
		const machinetype = item.machinetype;
		const fault = item.fault;
		const count = item.count;
		const timestamp = item.timestamp;

		if (!parsedData[line]) {
			parsedData[line] = {};
		}

		if (!parsedData[line][machinetype]) {
			parsedData[line][machinetype] = {
				faults: [],
				connected: false,
			};
		}

		parsedData[line][machinetype].faults.push({ fault, count });
		//do we have any data in the last x minutes
		const timeDifference = new Date().getTime() - new Date(timestamp).getTime();

		if (timeDifference < 5 * 60 * 1000) {
			parsedData[line][machinetype].connected = true;
		}
	}

	//if we dont have a line then we need to set it to an empty object
	for (let i = 1; i <= 6; i++) {
		if (!parsedData[i.toString()]) {
			parsedData[i.toString()] = {};
		}
	}

	return parsedData;
}

async function parseData(data: {
	[key: string]: {
		ID: number;
		line: number;
		faultName: string;
		timestamp: Date;
		machineType: string;
	};
}) {
	const parsedData: {
		[line: string]: {
			[machineType: string]: { faults: any[]; connected: boolean };
		};
	} = {};

	for (const key in data) {
		const item = data[key];
		const line = item.line.toString();
		const machinetype = item.machineType;
		const fault = item.faultName;
		const timestamp = item.timestamp;

		if (!parsedData[line]) {
			parsedData[line] = {};
		}

		if (!parsedData[line][machinetype]) {
			parsedData[line][machinetype] = {
				faults: [],
				connected: false,
			};
		}

		//check if we have the fault already
		const faultIndex = parsedData[line][machinetype].faults.findIndex(
			(f) => f.fault === fault
		);

		if (faultIndex > -1) {
			parsedData[line][machinetype].faults[faultIndex].count++;
		} else {
			parsedData[line][machinetype].faults.push({ fault, count: 1 });
		}

		//check each item and if we have any data in the last 2 minutes then we set connected to true
		const timeDifference = new Date().getTime() - new Date(timestamp).getTime();

		if (timeDifference < config.allowedWatchdogTimeCartonClosing) {
			parsedData[line][machinetype].connected = true;
		}
	}

	return parsedData;
}
