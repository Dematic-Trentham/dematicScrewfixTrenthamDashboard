"use client";

import React from "react";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	TimeScale,
	TimeSeriesScale,
} from "chart.js";
import { Line } from "react-chartjs-2";

import "chartjs-adapter-date-fns";
import { m } from "framer-motion";

import {
	changeDateToReadable,
	changeDateToReadableChart,
} from "@/utils/changeDateToReadable";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	TimeScale,
	TimeSeriesScale
);

export const options = {
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		legend: {
			position: "top" as const,
		},
		title: {
			display: false,
			text: "Chart.js Line Chart",
		},
	},
	animation: {
		duration: 0,
	},

	scales: {
		y: {
			beginAtZero: true,
			min: 0,
			max: 25,
			title: {
				display: true,
				text: "Time (ms)",
			},
		},
		x: {
			time: {
				unit: "minute",
				stepSize: 30,
				displayFormats: {
					minute: "HH:mm", // Shows as 08:00, 08:30, etc.
				},
			},
			ticks: {
				source: "auto",
				autoSkip: false, // Optional: show all ticks even if close
			},
			title: {
				display: true,
				text: "Time",
			},
		},
	},
};

interface historyChartProps {
	history: {
		pingStatus: boolean;
		pingTimeMS: number;
		plcStatus: boolean;
		createdAt: Date;
	}[];
	plc: boolean;
}

export const HistoryChart: React.FC<historyChartProps> = (props) => {
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState<string | null>(null);

	const [statusHistory, setStatusHistory] = React.useState<
		{
			pingStatus: boolean;
			pingTimeMS: number;
			plcStatus: boolean;
			createdAt: Date;
		}[]
	>([]);

	const [startDate, setStartDate] = React.useState<string | null>(null);
	const [endDate, setEndDate] = React.useState<string | null>(null);

	//calculate the start and end date based on the history data
	React.useEffect(() => {
		if (props.history.length > 0) {
			const start = new Date(props.history[props.history.length - 1].createdAt);

			const end = new Date(props.history[0].createdAt);

			//round the start and end date to the floor of the nearest 30 minutes
			const startRoundedDown = new Date(
				start.getTime() - (start.getMinutes() % 30) * 60 * 1000
			);

			//round the end date to the ceiling of the nearest 30 minutes
			const endRoundedUp = new Date(
				end.getTime() + (30 - (end.getMinutes() % 30)) * 60 * 1000
			);

			//26/04/2025 00:00:00
			const startRoundedDownString =
				changeDateToReadableChart(startRoundedDown);

			const endRoundedUpString = changeDateToReadableChart(endRoundedUp);

			setStartDate("25/04/2025 00:00:00");
			setEndDate(endRoundedUpString);
		}
	}, [props.history]);

	return (
		<div>
			<div style={{ height: "600px" }}>
				<Line
					data={{
						labels: props.history
							.map(
								(item) =>
									`${new Date(item.createdAt).toLocaleDateString()} ${new Date(
										item.createdAt
									).toLocaleTimeString()}`
							)
							.reverse(),
						datasets: [
							{
								label: "Ping Status",
								data: props.history.map((item) => item.pingTimeMS).reverse(),
								borderColor: "rgb(53, 162, 235)",
								backgroundColor: "rgba(53, 162, 235, 0.5)",
							},
							...(props.plc
								? [
										{
											label: "PLC Status",
											data: props.history
												.map((item) => (item.plcStatus ? 1 : 0))
												.reverse(),
											borderColor: "rgb(255, 99, 132)",
											backgroundColor: "rgba(255, 99, 132, 0.5)",
										},
									]
								: []),
							{
								label: "Ping Status",
								data: props.history
									.map((item) => (item.pingStatus ? 1 : 0))
									.reverse(),
								borderColor: "rgb(75, 192, 192)",
								backgroundColor: "rgba(75, 192, 192, 0.5)",
							},
						],
					}}
					options={{
						...options,
						plugins: {
							...options.plugins,
							tooltip: {
								callbacks: {
									label: function (context) {
										const label = context.dataset.label || "";
										const value = context.raw;
										const time =
											props.history[
												props.history.length - 1 - context.dataIndex
											].createdAt;

										if (label === "PLC Status" || label === "Ping Status") {
											const status = value === 1 ? "Online" : "Offline";

											return `${label}: ${status} at ${new Date(
												time
											).toLocaleDateString()} ${new Date(
												time
											).toLocaleTimeString()}`;
										}

										return `${label}: ${value} at ${new Date(
											time
										).toLocaleDateString()} ${new Date(
											time
										).toLocaleTimeString()}`;
									},
								},
							},
						},
						scales: {
							...options.scales,
							x: {
								...options.scales.x,

								max: endDate ?? undefined,
							},
						},
					}}
				/>
			</div>
			<table className="border-collapse border border-gray-300 text-sm text-gray-500">
				<thead>
					<tr>
						<th className="border border-gray-300 px-2 py-1">Line Color</th>
						<th className="border border-gray-300 px-2 py-1">Metric</th>
						<th className="border border-gray-300 px-2 py-1">Description</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td className="border border-gray-300 px-2 py-1">Red</td>
						<td className="border border-gray-300 px-2 py-1">PLC Status</td>
						<td className="border border-gray-300 px-2 py-1">
							Indicates whether the PLC is online or offline (if available).
						</td>
					</tr>
					<tr>
						<td className="border border-gray-300 px-2 py-1">Blue</td>
						<td className="border border-gray-300 px-2 py-1">Ping Status</td>
						<td className="border border-gray-300 px-2 py-1">
							Indicates whether the ping is successful or failed.
						</td>
					</tr>
					<tr>
						<td className="border border-gray-300 px-2 py-1">Green</td>
						<td className="border border-gray-300 px-2 py-1">Ping Time (ms)</td>
						<td className="border border-gray-300 px-2 py-1">
							Shows the time taken for the ping in milliseconds.
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};
