"use client";
import { get } from "http";

import React, { useEffect, useState } from "react";
import { ClassNames } from "@emotion/react";
import { set } from "zod";

import CartonClosingComponent from "./_components/cartonClosing";
import { getCartonClosingAllTimed } from "./_actions/getAutoCarton";

const CartonClosingPage: React.FC = () => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [data, setData] = useState<any | null>(null);
	const [dataold, setDataold] = useState<any | null>(null);

	useEffect(() => {
		async function fetchData() {
			//fetch data http://10.4.5.227:8080/json/mysqlGrouped?totalTime=
			fetch("http://10.4.5.227:8080/json/mysqlGrouped?totalTime=60")
				.then((res) => res.json())
				.then(async (data) => {
					const parsedData = await parseDataOld(data);
					//const machineTotals = await calculateMachineTotals(parsedData);
					//const machineTotals = "";

					setDataold(parsedData);

					//setLoading(false);
				})
				.catch((err) => {
					setError(err);
					//setLoading(false);
				});

			//get data from server
			const newData = await getCartonClosingAllTimed(60);

			//if empty data then return
			if (!newData) {
				setLoading(false);
				setError("No data found");

				return;
			}

			const parsedData2 = await parseData(newData);

			setData(parsedData2);
			setLoading(false);
		}

		//parse data
		function parseDataOld(data: any) {
			const parsedData: {
				[key: string]: { [key: string]: { faults: any[]; timeStamp: Date } };
			} = {};

			for (const item of data.rows) {
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
						timeStamp: new Date(0),
					};
				}

				parsedData[line][machinetype].faults.push({ fault, count });

				if (
					!parsedData[line][machinetype].timeStamp ||
					new Date(timestamp) >
						new Date(parsedData[line][machinetype].timeStamp)
				) {
					parsedData[line][machinetype].timeStamp = timestamp;
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
					[machineType: string]: { faults: any[]; timeStamp: Date };
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
						timeStamp: new Date(0),
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

				//parsedData[line][machinetype].faults.push({ fault, count: 1 });

				// if (
				// 	!parsedData[line][machinetype].timeStamp ||
				// 	new Date(timestamp) >
				// 		new Date(parsedData[line][machinetype].timeStamp)
				// ) {
				// 	parsedData[line][machinetype].timeStamp = timestamp;
				// }
			}

			return parsedData;
		}

		fetchData();

		//every 60 seconds we need to refetch the data
		const interval = setInterval(() => {
			fetchData();
		}, 5000);
	}, []);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<>
			<div
				style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}
			>
				<CartonClosingComponent
					data={data}
					dataold={dataold}
					hasLidder={true}
					hasiPack={true}
					haslabeler={true}
					lineNumber={"1"}
				/>

				<CartonClosingComponent
					data={data}
					dataold={dataold}
					hasLidder={true}
					hasiPack={true}
					haslabeler={true}
					lineNumber={"2"}
				/>

				<CartonClosingComponent
					data={data}
					dataold={dataold}
					hasLidder={true}
					hasiPack={true}
					haslabeler={true}
					lineNumber={"3"}
				/>

				<CartonClosingComponent
					data={data}
					dataold={dataold}
					hasLidder={true}
					hasiPack={true}
					haslabeler={true}
					lineNumber={"4"}
				/>

				<CartonClosingComponent
					data={data}
					dataold={dataold}
					hasLidder={false}
					hasiPack={true}
					haslabeler={true}
					lineNumber={"5"}
				/>

				<CartonClosingComponent
					data={data}
					dataold={dataold}
					hasLidder={false}
					hasiPack={true}
					haslabeler={true}
					lineNumber={"6"}
				/>
			</div>
		</>
	);
};

export default CartonClosingPage;
