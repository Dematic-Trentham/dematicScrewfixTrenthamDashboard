"use client";

import { useEffect, useState } from "react";

import { getOrderStartStats } from "./_actions";

import PanelTop from "@/components/panels/panelTop";

const boarderStyle = "border border-gray-400 p-2";

export default function OrderStartStats() {
	const [isLoading, setIsLoading] = useState(true);
	const [results, setResults] = useState<{
		[key: string]: {
			id: string;
			lastUpdated: Date;
			name: string;
			location: string;
			description: string;
			value: string;
		};
	}>({});

	useEffect(() => {
		const fetchOrderStartStats = async () => {
			const results = await getOrderStartStats();

			if (results) {
				setResults(results);
				setIsLoading(false);
			}
		};

		fetchOrderStartStats();

		setInterval(() => fetchOrderStartStats(), 5000);
	}, []);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<PanelTop className="w-full" title="Order Start Stats">
			<table className="w-full border-collapse border border-gray-400 bg-slate-100">
				<thead className="bg-orange-400">
					<tr>
						<th className={boarderStyle}>Machine</th>
						<th className={boarderStyle}>PLC Pot</th>
						<th className={boarderStyle}>WMS Requirement</th>
						<th className={boarderStyle}>Mismatch</th>
					</tr>
				</thead>

				<tbody>
					{makeARow("Carton 1", "carton_erector_1", results)}
					{makeARow("Carton 2", "carton_erector_2", results)}
					{makeARow("Carton 3", "carton_erector_3", results)}
					{makeARow("Carton 4", "carton_erector_4", results)}
					{makeARow("Carton 5", "carton_erector_5", results)}
					{separator()}
					{totesRow(results)}
					{separator()}
					{lastUpdatedRow(results)}
				</tbody>
			</table>

			<div className="border border-gray-400 p-2 mt-4 bg-white w-40 rounded-md">
				<p>Key:</p>
				<p className="bg-yellow-200">0-24 mismatch</p>
				<p className="bg-red-200">25+ mismatch</p>
			</div>
		</PanelTop>
	);
}
function makeARow(
	name: string,
	key: string,
	results: {
		[key: string]: {
			id: string;
			lastUpdated: Date;
			name: string;
			location: string;
			description: string;
			value: string;
		};
	}
) {
	const PLC = results["dematic_dashboard_PLC31_" + key]?.value;
	const WMS = results["dematic_dashboard_WMS_" + key]?.value;

	const mismatch = Number(WMS) - Number(PLC);

	let mismatchColor = "";

	if (mismatch > 0 && mismatch < 25) {
		mismatchColor = "bg-yellow-200";
	} else if (mismatch >= 25) {
		mismatchColor = "bg-red-200";
	}

	return (
		<tr className={`text-2xl font-bold ${mismatchColor}`}>
			<td className={boarderStyle}>{name}</td>
			<td className={boarderStyle}>{PLC}</td>
			<td className={boarderStyle}>{WMS}</td>
			<td className={boarderStyle}>{mismatch}</td>
		</tr>
	);
}

function separator() {
	return (
		<tr>
			<td className={`h-1 bg-black ${boarderStyle}`} colSpan={4} />
		</tr>
	);
}

function totesRow(results: {
	[key: string]: {
		id: string;
		lastUpdated: Date;
		name: string;
		location: string;
		description: string;
		value: string;
	};
}) {
	const PLC = results["dematic_dashboard_PLC31_OrderTotes"]?.value;
	const WMSLegacy = results["dematic_dashboard_WMS_OrderTotes"]?.value;
	const WMSDMS = results["dematic_dashboard_WMS_OrderTotes_DMS"]?.value;

	const mismatch = Number(WMSLegacy) + Number(WMSDMS) - Number(PLC);

	let mismatchColor = "";

	if (mismatch > 0 && mismatch < 25) {
		mismatchColor = "bg-yellow-200";
	} else if (mismatch >= 25) {
		mismatchColor = "bg-red-200";
	}

	return (
		<>
			<tr className={`text-2xl font-bold ${mismatchColor} `}>
				<td className={boarderStyle}>Totes To Legacy</td>
				<td className={boarderStyle} rowSpan={2}>
					{PLC}
				</td>
				<td className={boarderStyle} rowSpan={1}>
					{WMSLegacy}
				</td>
				<td className={boarderStyle} rowSpan={2}>
					{mismatch}
				</td>
			</tr>
			<tr className={`text-2xl font-bold ${mismatchColor} `}>
				<td className={boarderStyle}>Totes To DMS</td>
				<td className={boarderStyle}>{WMSDMS}</td>
			</tr>
		</>
	);
}

function lastUpdatedRow(results: {
	[key: string]: {
		id: string;
		lastUpdated: Date;
		name: string;
		location: string;
		description: string;
		value: string;
	};
}) {
	let plcBackgroundColor = "";
	let wmsBackgroundColor = "";

	if (results["dematic_dashboard_PLC31_carton_erector_1"].lastUpdated) {
		const lastUpdated = new Date(
			results["dematic_dashboard_PLC31_carton_erector_1"].lastUpdated
		);
		const now = new Date();
		const diffMinutes = Math.floor(
			(now.getTime() - lastUpdated.getTime()) / 60000
		);

		if (diffMinutes > 1) {
			plcBackgroundColor = "bg-red-200";
		}
	}

	if (results["dematic_dashboard_WMS_carton_erector_1"].lastUpdated) {
		const lastUpdated = new Date(
			results["dematic_dashboard_WMS_carton_erector_1"].lastUpdated
		);
		const now = new Date();
		const diffMinutes = Math.floor(
			(now.getTime() - lastUpdated.getTime()) / 60000
		);

		if (diffMinutes > 1) {
			wmsBackgroundColor = "bg-red-200";
		}
	}

	return (
		<tr>
			<td className={boarderStyle}>Last Updated</td>
			<td className={`${boarderStyle} ${plcBackgroundColor} `}>
				{results[
					"dematic_dashboard_PLC31_carton_erector_1"
				].lastUpdated.toLocaleString()}
			</td>
			<td className={`${boarderStyle} ${wmsBackgroundColor} `}>
				{results[
					"dematic_dashboard_WMS_carton_erector_1"
				].lastUpdated.toLocaleString()}
			</td>
		</tr>
	);
}
