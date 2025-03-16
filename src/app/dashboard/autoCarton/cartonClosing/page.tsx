"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";

import CartonClosingComponent from "./_components/cartonClosing";
import { getCartonClosingAllTimed } from "./_actions/getAutoCarton";

import Loading from "@/components/visual/loading";
import { updateUrlParams } from "@/utils/url/params";

const CartonClosingPage: React.FC = () => {
	const params = useParams<{ machine: string }>();
	const router = useRouter();

	//get returnURL form the url
	const searchParams = useSearchParams();

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [data, setData] = useState<any | null>(null);
	const [dataold, setDataold] = useState<any | null>(null);

	const allowedWatchdogTime = 2 * 60 * 1000; //2 minutes

	const [totalTime, setTotalTime] = useState(60);

	useEffect(() => {
		const url =
			"http://10.4.5.227:8080/json/mysqlGrouped?totalTime=" +
			totalTime.toString();

		console.log(url);

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

			const results = await Promise.all(
				tasks.map(({ name, task }) =>
					task.catch((error) => {
						console.error(`Error in function ${name}:`, error);
						setError(error);
					})
				)
			);

			console.log("Tasks done");
			console.log(results);

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

			console.log(data.rows);

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
	}, [totalTime]);

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
						timeRange={totalTime.toString()}
					/>
				))}
			</div>
			<div style={{ marginTop: "20px", textAlign: "center" }}>
				<label htmlFor="totalTime">Select Total Search Time: </label>
				<select
					id="totalTime"
					value={totalTime}
					onChange={async (e) => {
						await updateUrlParams(
							searchParams,
							router,
							"timeRange",
							e.target.value
						);
						setTotalTime(Number(e.target.value));
						setLoading(true);
					}}
				>
					<option value={5}>5 minutes</option>
					<option value={10}>10 minutes</option>
					<option value={15}>15 minutes</option>
					<option value={30}>30 minutes</option>
					<option value={60}>1 hour</option>
					<option value={120}>2 hours</option>
					<option value={180}>3 hours</option>
					<option value={360}>6 hours</option>
					<option value={720}>12 hours</option>
					<option value={1440}>1 day</option>
					<option value={2880}>2 days</option>
					<option value={4320}>3 days</option>
					<option value={5760}>4 days</option>
					<option value={7200}>5 days</option>
					<option value={8640}>6 days</option>
					<option value={10080}>1 week</option>
					<option value={20160}>2 weeks</option>
					<option value={43200}>1 month</option>
					<option value={86400}>2 months</option>
					<option value={129600}>3 months</option>
					<option value={172800}>4 months</option>
					<option value={216000}>5 months</option>
					<option value={259200}>6 months</option>
				</select>
			</div>
		</>
	);
};

export default CartonClosingPage;
