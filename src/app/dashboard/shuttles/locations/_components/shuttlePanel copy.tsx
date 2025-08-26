"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

import { shuttleLocation } from "../../_types/shuttle";
import { getShuttleCountsByLocation } from "../[macAddress]/parts/_actions";

import HoverPopup from "@/components/visual/hoverPopupFloat";

export enum colorByTypeType {
	aisle,
	shuttle,
	counts,
	missionsPerFault,
	faults,
}

interface ShuttlePanelProps {
	shuttleMissions: number;
	shuttleFaults: number;
	shuttleMissionPerFault: number;
	shuttleLocation: string;
	worstMissionPerFault: number;
	shuttleInfo: shuttleLocation;
	highlight: string;
	currentSearchTime: number;
	mostMissions: number;
	mostFaults: number;
	colourType: colorByTypeType;
}

const ShuttlePanelNew: React.FC<ShuttlePanelProps> = (props) => {
	let faultPercentage = 0;

	if (props.colourType === colorByTypeType.missionsPerFault) {
		faultPercentage = props.worstMissionPerFault / props.shuttleMissionPerFault;
	} else if (props.colourType === colorByTypeType.counts) {
		faultPercentage = 1 - props.shuttleMissions / props.mostMissions;
	} else if (props.colourType === colorByTypeType.faults) {
		faultPercentage = props.shuttleFaults / props.mostFaults;
		if (props.shuttleFaults === 0) {
			faultPercentage = 0;
		}
	}

	faultPercentage = faultPercentage.toFixed(2) as unknown as number;

	let shuttleColor = "";

	if (props.highlight == "") {
		if (faultPercentage < 0.01) {
			shuttleColor = "bg-green-500";
		} else if (faultPercentage < 0.2) {
			shuttleColor = "bg-green-400";
		} else if (faultPercentage < 0.3) {
			shuttleColor = "bg-yellow-300";
		} else if (faultPercentage < 0.4) {
			shuttleColor = "bg-yellow-400";
		} else if (faultPercentage < 0.5) {
			shuttleColor = "bg-yellow-500";
		} else if (faultPercentage < 0.6) {
			shuttleColor = "bg-orange-400";
		} else if (faultPercentage < 0.7) {
			shuttleColor = "bg-orange-500";
		} else if (faultPercentage < 0.8) {
			shuttleColor = "bg-red-400";
		} else if (faultPercentage < 0.9) {
			shuttleColor = "bg-red-500";
		} else {
			shuttleColor = "bg-red-600";
		}
	} else if (
		props.shuttleInfo.shuttleID
			.toLowerCase()
			.includes(props.highlight.toLowerCase())
	) {
		shuttleColor = "bg-lime-500 animate-pulse speed-25 ";
	} else {
		shuttleColor = "bg-violet-500";
	}

	let Display = "";

	if (props.colourType == colorByTypeType.missionsPerFault) {
		Display = props.shuttleMissionPerFault.toFixed(2);
	} else if (props.colourType == colorByTypeType.counts) {
		Display = props.shuttleMissions.toFixed(0);
	} else if (props.colourType == colorByTypeType.faults) {
		Display = props.shuttleFaults.toFixed(0);
	}

	let displayLabel = <></>;

	displayLabel = (
		<div className={`rounded-xl ${shuttleColor} m-0 h-8 p-0 text-3xl`}>
			<div className="flex h-full items-center justify-between px-2 text-black">
				<div>{props.shuttleInfo.shuttleID || "No ID"}</div>
				{Display && <div className="text-lg">{Display}</div>}
			</div>
		</div>
	);

	let hover = (
		<div className="w-96 animate-none rounded-2xl border-4 border-black bg-amber-600 p-2 py-1 text-black">
			<div className="text-Left text-2xl font-bold">
				{props.shuttleInfo.shuttleID.toUpperCase()}
			</div>
			<div className="text-left text-xl font-bold">Shuttle Info</div>
			{Object.entries(props.shuttleInfo).map(([key, value]) => (
				<div key={key + "hover"}>
					<strong>{key}:</strong> {String(value)}
				</div>
			))}
			<br />
			<div className="text-Left text-2xl font-bold">Statistics</div>
			<div>
				<strong>Total Missions:</strong> {props.shuttleMissions}
			</div>
			<div>
				<strong>Total Faults:</strong> {props.shuttleFaults}
			</div>
			<div>
				<strong>Missions per Fault:</strong>{" "}
				{props.shuttleMissionPerFault || props.shuttleMissions}
			</div>
		</div>
	);

	return (
		<div className="h-8 w-60 text-center">
			<Link
				className="h-8 w-60 text-center"
				href={
					"/dashboard/shuttles/locations/" +
						props.shuttleInfo.macAddress.replaceAll(" ", "") +
						"?currentSearchTime=" +
						props.currentSearchTime || "1"
				}
			>
				<HoverPopup
					itemToHover={displayLabel}
					itemToPopUp={hover}
					xOffset={25}
					yOffset={-150}
				/>
			</Link>
		</div>
	);
};

export default ShuttlePanelNew;
