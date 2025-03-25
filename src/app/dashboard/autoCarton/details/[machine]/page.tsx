"use client";

import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import { getAutoCartonFaults } from "./_actions/actions";
import { excludedFaults2 } from "./../../excludedFaults";

import Loading from "@/components/visual/loading";
import PanelTop from "@/components/panels/panelTop";
import "react-tabs/style/react-tabs.css";
import { changeDateToReadable } from "@/utils/changeDateToReadable";
import { makeReadableFaultCode } from "@/utils/faultCodemaker";
import { updateUrlParams } from "@/utils/url/params";

const MachineDetailsPage = () => {
	const params = useParams<{ machine: string }>();
	const router = useRouter();

	//get returnURL form the url
	const searchParams = useSearchParams();

	const [title, setTitle] = useState<string>(params.machine);
	const [returnURL, setReturnURL] = useState<any>(null);
	const [data, setData] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	type autoCartonMachineType = "erector" | "Lidder" | "iPack";

	const [totalTime, setTotalTime] = useState(60);

	useEffect(() => {
		console.log("MachineDetailsPage useEffect");

		//set title will come in as "erector5" and we want to display "Erector 5
		setTitle(
			params.machine.charAt(0).toUpperCase() +
				params.machine.slice(1).replace(/([0-9]+)/g, " $1")
		);
		//do we have timeRange in the url
		const timeRange = searchParams.get("timeRange");

		//if we have a timeRange, we need to set the timeToSearch to the timeRange
		if (timeRange && !isNaN(Number(timeRange))) {
			setTotalTime(Number(timeRange) || 60);
		}

		const totalTimeSelect = searchParams.get("totalTimeSelect");

		//get data from server
		async function fetchData() {
			//get returnURL from the url
			setReturnURL(searchParams.get("returnURL"));

			const machineTypeString = params.machine.replace(/[0-9]/g, "");
			const machineNumberString = params.machine.replace(/\D/g, "");

			//convert machineType to type of machine
			let machineType: autoCartonMachineType = "erector";

			if (machineTypeString === "erector") {
				machineType = "erector";
			} else if (machineTypeString === "lidder") {
				machineType = "Lidder";
			} else if (machineTypeString === "iPack") {
				machineType = "iPack";
			} else {
				//if we can't find the machine type, we will return an error
				setError("Machine type not found");
				setLoading(false);

				return;
			}

			//parse the number from the machine
			const machineNumber = Number(machineNumberString);

			const data = await getAutoCartonFaults(
				parseInt(totalTime.toString()),
				machineType,
				machineNumber
			);

			if ("error" in data) {
				setError(data.error);
			} else {
				let array: any[] = [];

				//remove faults that are "watchDog"
				data.forEach((item: any, index: number) => {
					if (item.faultCode != "watchDog") {
						array.push(item);
					}
				});

				setData(array);

				console.log(data);
			}

			setLoading(false);
		}

		fetchData();
	}, [totalTime, searchParams]);

	if (loading) {
		return <Loading />;
	}

	if (error) {
		return (
			<PanelTop
				title={title}
				topRight={
					<button
						className="rounded-lg bg-blue-400 p-2 text-white"
						onClick={() => {
							window.location.href =
								"/dashboard/autoCarton/" +
								returnURL +
								"?timeRange=" +
								totalTime;
						}}
					>
						Back
					</button>
				}
			>
				{error}
			</PanelTop>
		);
	}

	return (
		<PanelTop
			className="h-fit w-full"
			title={title}
			topRight={
				<button
					className="rounded-lg bg-blue-400 p-2 text-white"
					onClick={() => {
						window.location.href =
							"/dashboard/autoCarton/" + returnURL + "?timeRange=" + totalTime;
					}}
				>
					Back
				</button>
			}
		>
			<Tabs>
				<TabList>
					{" "}
					<Tab>Chart</Tab>
					<Tab>Grouped</Tab>
					<Tab>Faults</Tab>
				</TabList>
				<TabPanel>{pieChart(data)}</TabPanel>
				<TabPanel>{tabGrouped(data)}</TabPanel>
				<TabPanel>{tabFormattedData(data)}</TabPanel>
			</Tabs>
			<div
				className={"bg-white text-black"}
				style={{ marginTop: "20px", textAlign: "center" }}
			>
				<label htmlFor="totalTime">Select Total Search Time: </label>
				<select
					className={"border bg-white text-black"}
					id="totalTime"
					value={totalTime}
					onChange={async (e) => {
						await updateUrlParams(
							searchParams,
							router,
							"timeRange",
							e.target.value
						);
						setLoading(true);
						setTotalTime(parseInt(e.target.value));
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
		</PanelTop>
	);

	function tabFormattedData(data: any) {
		return (
			<table className="dematicTable dematicTableStriped dematicTableHoverable">
				<thead>
					<tr>
						<th>Time</th>

						<th>Fault Code</th>
					</tr>
				</thead>

				<tbody>
					{data
						.filter((item: any) => !excludedFaults2.includes(item.faultCode))
						.map((item: any, index: number) => (
							<tr key={index}>
								<td>{changeDateToReadable(item.timestamp)}</td>
								<td>{makeReadableFaultCode(item.faultCode)}</td>
							</tr>
						))}
				</tbody>
			</table>
		);
	}

	function tabGrouped(data: any) {
		let chartData = groupBy(data);

		//remove faults that are "box"
		chartData;

		return (
			<div>
				<table className="dematicTable dematicTableStriped dematicTableHoverable">
					<thead>
						<tr>
							<th>Fault Code</th>
							<th>Count</th>
						</tr>
					</thead>
					<tbody>
						{chartData.map((item, index) => (
							<tr key={index}>
								<td>{item.faultCode}</td>
								<td>{item.count}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	}

	//function to group the data by fault code
	function groupBy(data: any) {
		const data2 = data.filter(
			(item: any) => !excludedFaults2.includes(item.faultCode)
		);

		const groupedData = data2.reduce((acc: any, item: any) => {
			const faultCode = makeReadableFaultCode(item.faultCode);
			//const faultCode = item.faultCode;

			if (!acc[faultCode]) {
				acc[faultCode] = 0;
			}
			acc[faultCode]++;

			return acc;
		}, {});

		const chartData = Object.keys(groupedData).map((key) => ({
			faultCode: key,
			count: groupedData[key],
		}));

		chartData.sort((a, b) => b.count - a.count);

		return chartData;
	}

	//pie chart
	function pieChart(data: any) {
		ChartJS.register(ArcElement, Tooltip, Legend);

		let pieChartData = groupBy(data);

		//get total number of boxes   item.faultCode = "Box"
		const totalBoxes = pieChartData.reduce((acc: any, item: any) => {
			if (item.faultCode === "box") {
				acc += item.count;
			}

			return acc;
		}, 0);

		//remove faults that are "Box"
		pieChartData = pieChartData.filter((item: any) => item.faultCode != "Box");

		//total number of faults
		const totalFaults = pieChartData.reduce((acc: any, item: any) => {
			acc += item.count;

			return acc;
		}, 0);

		const chartData = {
			labels: pieChartData.map((item: any) => item.faultCode),
			datasets: [
				{
					label: "# of Faults",
					data: pieChartData.map((item: any) => item.count),
					backgroundColor: [
						"rgba(255, 99, 132, 0.2)",
						"rgba(54, 162, 235, 0.2)",
						"rgba(255, 206, 86, 0.2)",
						"rgba(75, 192, 192, 0.2)",
						"rgba(153, 102, 255, 0.2)",
						"rgba(255, 159, 64, 0.2)",
					],
					borderColor: [
						"rgba(255, 99, 132, 1)",
						"rgba(54, 162, 235, 1)",
						"rgba(255, 206, 86, 1)",
						"rgba(75, 192, 192, 1)",
						"rgba(153, 102, 255, 1)",
						"rgba(255, 159, 64, 1)",
					],
					borderWidth: 1,
				},
			],
		};

		if (pieChartData.length === 0) {
			return (
				<div>
					<p>No faults found</p>
					<p>Total Boxes: {totalBoxes}</p>
					<p>Total Faults: {totalFaults}</p>
				</div>
			);
		}

		return (
			<div style={{ width: "500px", margin: "0 auto" }}>
				<div className="flex flex-col items-center">
					<div>Total Boxes: {totalBoxes}</div>
					<div>Total Faults: {totalFaults}</div>
				</div>
				<Pie data={chartData} />
			</div>
		);
	}
};

export default MachineDetailsPage;
