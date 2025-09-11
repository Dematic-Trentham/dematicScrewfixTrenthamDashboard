"use client";
import "react-tabs/style/react-tabs.css";
import { useEffect, useState } from "react";

type DetailsProps = {
	hours: number;
};

import { Chart, registerables } from "chart.js";
import { Line } from "react-chartjs-2";
import { select } from "@nextui-org/theme";

import {
	getAllLiftMissionsLastXGroupedDays,
	getAllLiftMissionsLastXGroupedHourly,
} from "../_actions";

Chart.register(...registerables);

const ChartColors = [
	"rgba(255, 99, 132, 1)",
	"rgba(54, 162, 235, 1)",
	"rgba(255, 206, 86, 1)",
	"rgba(75, 192, 192, 1)",
	"rgba(153, 102, 255, 1)",
	"rgba(255, 159, 64, 1)",
	"rgba(199, 199, 199, 1)",
	"rgba(83, 102, 255, 1)",
	"rgba(255, 102, 255, 1)",
	"rgba(102, 255, 204, 1)",
	"rgba(255, 204, 102, 1)",
	"rgba(204, 255, 102, 1)",
	"rgba(102, 204, 255, 1)",
];

const DetailsGraph = ({ hours }: DetailsProps) => {
	const [missions, setMissions] = useState<Record<
		string,
		{
			ID: number;
			timestamp: Date;
			aisle: number;
			liftNumber: number;
			totalAtTime: number;
			difference?: number;
			disabled?: boolean;
		}[]
	> | null>(null);

	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const [disabledAisles, setDisabledAisles] = useState<Set<number>>(new Set());
	const [disabledLifts, setDisabledLifts] = useState<Set<string>>(new Set());

	const [breakdownByHour, setBreakdownByHour] = useState<boolean>(false);

	// Utility to assign consistent color by index
	function getColor(index: number) {
		const borderColor = ChartColors[index % ChartColors.length];
		const backgroundColor = borderColor.replace("1)", "0.2)"); // faded fill

		return { borderColor, backgroundColor };
	}

	function NameLift(liftNumber: number) {
		switch (liftNumber) {
			case 4:
				return `Right Lift 1`;
			default:
				return `Left Lift ${liftNumber}`;
		}
	}

	useEffect(() => {
		const fetchMissions = async () => {
			console.log("Fetching lift missions for the last 24 hours...");

			if (breakdownByHour) {
				const resultDataHour =
					await getAllLiftMissionsLastXGroupedHourly(hours);

				//delete disabled aisles and lifts
				if (disabledAisles.size > 0 || disabledLifts.size > 0) {
					for (const key in resultDataHour) {
						resultDataHour[key] = resultDataHour[key].map((mission) => {
							if (
								disabledAisles.has(mission.aisle) ||
								disabledLifts.has(`${mission.aisle}-${mission.liftNumber}`)
							) {
								return { ...mission, disabled: true };
							}

							return mission;
						});
					}
				}

				setMissions(resultDataHour);
			} else {
				const resultData = await getAllLiftMissionsLastXGroupedDays(hours);

				//delete disabled aisles and lifts
				if (disabledAisles.size > 0 || disabledLifts.size > 0) {
					for (const key in resultData) {
						resultData[key] = resultData[key].map((mission) => {
							if (
								disabledAisles.has(mission.aisle) ||
								disabledLifts.has(`${mission.aisle}-${mission.liftNumber}`)
							) {
								return { ...mission, disabled: true };
							}

							return mission;
						});
					}
				}

				setMissions(resultData);
			}

			setLoading(false);

			//console.log(resultData);
		};

		fetchMissions();
	}, [breakdownByHour, hours, disabledAisles, disabledLifts]);

	if (loading) {
		return <div>Loading lift missions...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div>
			<div className="mb-2 flex justify-end">
				<label className="flex items-center gap-2">
					<input
						checked={breakdownByHour}
						type="checkbox"
						onChange={() => {
							setBreakdownByHour(!breakdownByHour);
						}}
					/>
					<span>Break down by hour</span>
				</label>
			</div>
			<div>
				{/* Graph implementation goes here  , line for each aisle and lift number  y axis is the diffrence feild*/}
				{missions && (
					<Line
						data={{
							labels: Array.from(
								new Set(
									Object.values(missions)
										.flat()
										.filter((m) => !m.disabled)
										.map((m) => new Date(m.timestamp).toISOString())
								)
							).sort(),
							datasets: Array.from(
								new Map(
									Object.values(missions)
										.flat()
										.filter((m) => !m.disabled)
										.map((m) => [
											`${m.aisle}-${m.liftNumber}`,
											{ aisle: m.aisle, liftNumber: m.liftNumber },
										])
								).values()
							).map(({ aisle, liftNumber }, idx) => {
								const dataPoints = Object.values(missions)
									.flat()
									.filter(
										(m) =>
											m.aisle === aisle &&
											m.liftNumber === liftNumber &&
											!m.disabled
									)
									.sort(
										(a, b) =>
											new Date(a.timestamp).getTime() -
											new Date(b.timestamp).getTime()
									)
									.map((m) => m.difference || 0);

								const { borderColor, backgroundColor } = getColor(idx);

								return {
									label: `Aisle ${aisle} - ${NameLift(liftNumber)}`,
									data: dataPoints,
									borderColor,
									backgroundColor,
									fill: false,
									tension: 0.1,
								};
							}),
						}}
						options={{
							animation: {
								duration: 500,
								easing: "easeOutSine",
							},
							plugins: {
								legend: {
									display: true,
									position: "top",
								},
								title: {
									display: false,
								},
							},
							scales: {
								y: {
									beginAtZero: true,
								},
							},
						}}
					/>
				)}
			</div>

			{missions && (
				<div className="mt-4 flex flex-wrap gap-2">
					{Array.from(
						new Set(
							Object.values(missions)
								.flat()
								.map((m) => m.aisle)
						)
					)
						.sort((a, b) => a - b)
						.map((aisle) => (
							<button
								key={aisle}
								className={`rounded px-3 py-1 text-white hover:bg-blue-600 ${
									disabledAisles.has(aisle) ? "bg-gray-400" : "bg-blue-500"
								}`}
								onClick={() => {
									const newDisabledAisles = new Set(disabledAisles);

									if (newDisabledAisles.has(aisle)) {
										newDisabledAisles.delete(aisle);
									} else {
										newDisabledAisles.add(aisle);
									}
									setDisabledAisles(newDisabledAisles);
								}}
							>
								Toggle Aisle {aisle}
							</button>
						))}
				</div>
			)}

			{missions && (
				<div className="mt-4 flex flex-wrap gap-2">
					{Array.from(
						new Set(
							Object.values(missions)
								.flat()
								.map((m) => m.liftNumber)
						)
					)
						.sort((a, b) => Number(a) - Number(b))
						.map((liftNumber) => (
							<button
								key={liftNumber}
								className={`rounded px-3 py-1 text-white hover:bg-green-600 ${
									// If all lifts with this liftNumber are disabled, make button grey
									Object.values(missions)
										.flat()
										.filter((m) => m.liftNumber === liftNumber)
										.every((m) =>
											disabledLifts.has(`${m.aisle}-${m.liftNumber}`)
										)
										? "bg-gray-400"
										: "bg-blue-500"
								}`}
								onClick={() => {
									// Toggle all lifts with this liftNumber across all aisles
									const newDisabledLifts = new Set(disabledLifts);
									const liftsToToggle = Object.values(missions)
										.flat()
										.filter((m) => m.liftNumber === liftNumber)
										.map((m) => `${m.aisle}-${m.liftNumber}`);

									const allDisabled = liftsToToggle.every((lift) =>
										newDisabledLifts.has(lift)
									);

									liftsToToggle.forEach((lift) => {
										if (allDisabled) {
											newDisabledLifts.delete(lift);
										} else {
											newDisabledLifts.add(lift);
										}
									});
									setDisabledLifts(newDisabledLifts);
								}}
							>
								Toggle Lift {NameLift(liftNumber)}
							</button>
						))}
				</div>
			)}
		</div>
	);
};

export default DetailsGraph;
