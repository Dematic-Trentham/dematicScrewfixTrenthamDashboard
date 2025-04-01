"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { totalTimeSelector } from "../../../../components/pickers/totalTimeSelector";

import CartonClosingComponent from "./_components/cartonClosing";
import { getCartonClosingAllTimed } from "./_actions/getAutoCarton";

import Loading from "@/components/visual/loading";
import AdminBox from "@/components/adminBox";

const CartonClosingPage: React.FC = () => {
	const router = useRouter();

	//get returnURL form the url
	const searchParams = useSearchParams();

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [data, setData] = useState<any | null>(null);
	const [dataold, setDataold] = useState<any | null>(null);

	const allowedWatchdogTime = 2 * 60 * 1000; //2 minutes

	const [onlyShowBoxes, setOnlyShowBoxes] = useState(false);

	const [totalTime, setTotalTime] = useState(60);

	useEffect(() => {
		const url =
			"http://10.4.5.227:8080/json/mysqlGrouped?totalTime=" +
			totalTime.toString();

		async function timePromise<T>(
			promise: Promise<T>
		): Promise<{ time: number; result: T }> {
			const start = performance.now();
			const result = await promise;
			const end = performance.now();

			return { time: end - start, result };
		}

		async function fetchData() {
			const tasks = [
				{ name: "fetchOldData", task: timePromise(fetchOldData()) },
				{ name: "fetchNewData", task: timePromise(fetchNewData()) },
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
		async function fetchOldData() {
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

		async function fetchNewData() {
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
				const timeDifference =
					new Date().getTime() - new Date(timestamp).getTime();

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
				const timeDifference =
					new Date().getTime() - new Date(timestamp).getTime();

				if (timeDifference < allowedWatchdogTime) {
					parsedData[line][machinetype].connected = true;
				}
			}

			return parsedData;
		}

		fetchData();

		const intervalId = setInterval(fetchData, 10000);

		return () => clearInterval(intervalId);
	}, [totalTime, onlyShowBoxes]);

	if (loading) {
		return <Loading />;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<>
			<div
				style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}
			>
				{[1, 2, 3, 4, 5, 6].map((lineNumber) => (
					<CartonClosingComponent
						key={lineNumber}
						data={data}
						dataold={dataold}
						hasLidder={lineNumber <= 4}
						hasiPack={true}
						haslabeler={true}
						lineNumber={lineNumber.toString()}
						onlyBoxes={onlyShowBoxes}
						timeRange={totalTime.toString()}
					/>
				))}
			</div>

			{totalTimeSelector(
				totalTime,
				searchParams,
				router,
				setTotalTime,
				setLoading
			)}

			<AdminBox
				checkBoxes={[
					{
						label: "Show Only Boxes",
						callback: setOnlyShowBoxes,
					},
				]}
			/>
		</>
	);
};

export default CartonClosingPage;
