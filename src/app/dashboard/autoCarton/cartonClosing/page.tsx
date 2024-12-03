"use client";
import React, { useEffect, useState } from "react";
import CartonClosingComponent from "./_components/cartonClosing";
import { getAutoCartonFaults } from "./_actions/getAutoCarton";

const timeOptions = [
	{ label: "5 minutes", value: 5 },
	{ label: "15 minutes", value: 15 },
	{ label: "30 minutes", value: 30 },
	{ label: "45 minutes", value: 45 },
	{ label: "1 hour", value: 60 },
	{ label: "2 hours", value: 120 },
	{ label: "4 hours", value: 240 },
	{ label: "6 hours", value: 360 },
	{ label: "12 hours", value: 720 },
	{ label: "1 day", value: 1440 },
	{ label: "2 days", value: 2880 },
	{ label: "4 days", value: 5760 },
	{ label: "1 week", value: 10080 },
	{ label: "2 weeks", value: 20160 },
	{ label: "1 month", value: 43200 },
	{ label: "2 months", value: 86400 },
];

const AutoCartonCartonClosingPage: React.FC = () => {

	const [selectedTime, setSelectedTime] = useState(60);

	const [resultdata, setResultData] = useState({});

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchData = async () => {

			const response = await getAutoCartonFaults(selectedTime, [
				"Lidder",
				"iPack",
				"labeler",
			]);

			if ("error" in response) {
				console.error(response.error);
				setError(response.error);
			} else {
				
				//add item to each array where the fault code is changed into a string from the response
				const data = response.faults.map((fault) => {

					//console.log(fault);

					const faultCode = fault.faultCode;

					//console.log(faultCode);
					//console.log(response.faultCodes);

					//console.log(response.faultCodes.find((code) => code.ID === faultCode)?.faultMessage);

				
					const faultString = response.faultCodes.find((code) => code.ID === faultCode)?.faultMessage || "Unknown fault";

					//console.log({...fault, faultString });
					return { ...fault, faultString };
				}
				
				);

				console.log(data);

				//lets make a new object and make into each line and machine
				const newData: {	[key: string]: { [key: string]: any[] } } = {};

			
				data.forEach((fault) => {
					const line = fault.line;
					const machine = fault.machineType;

					//console.log(line, machine);

					if (!(line in newData)) {
						newData[line] = {};
					}
					if (!(machine in newData[line])) {
						newData[line][machine] = [];
					}
					newData[line][machine].push(fault);
				});

				setResultData(newData);
				console.log(newData);

			}

			setLoading(false);
		};

		fetchData();

		const interval = setInterval(() => {
			fetchData();
		}, 30000);

		return () => {clearInterval(interval)}

	}, [selectedTime]);



	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div>
			<div className="grid grid-cols-center-1 md:grid-cols-center-2 xl:grid-cols-center-4">
				<CartonClosingComponent
					lineNumber={1}
					hasLidder={true}
					hasiPack={true}
					haslabeler={true}
					data={resultdata}
				/>
				<CartonClosingComponent
					lineNumber={2}
					hasLidder={true}
					hasiPack={true}
					haslabeler={true}
					data={resultdata}
				/>
				<CartonClosingComponent
					lineNumber={3}
					hasLidder={true}
					hasiPack={true}
					haslabeler={true}
					data={resultdata}
				/>
				<CartonClosingComponent
					lineNumber={4}
					hasLidder={true}
					hasiPack={true}
					haslabeler={true}
					data={resultdata}
				/>
				<CartonClosingComponent
					lineNumber={5}
					hasLidder={false}
					hasiPack={true}
					haslabeler={true}
					data={resultdata}
				/>
				<CartonClosingComponent
					lineNumber={6}
					hasLidder={false}
					hasiPack={true}
					haslabeler={true}
					data={resultdata}
				/>
			</div>
			<div className="mt-4 flex w-96">
				<label
					htmlFor="timeSelector"
					className="block text-sm font-medium text-gray-700"
				>
					Select Time Interval
				</label>
				<select
					id="timeSelector"
					className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
					value={selectedTime}
					onChange={(e) => setSelectedTime(Number(e.target.value))}
				>
					{timeOptions.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
			</div>
		</div>
	);
};

export default AutoCartonCartonClosingPage;
