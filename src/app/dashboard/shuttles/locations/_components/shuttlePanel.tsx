"use client";
import React from "react";
import Link from "next/link";

import { shuttleLocation } from "../../_types/shuttle";

import HoverPopup from "@/components/visual/hoverPopupFloat";

interface ShuttlePanelProps {
	locations: shuttleLocation;
}

const ShuttlePanel: React.FC<ShuttlePanelProps> = (props) => {
	// Implement your component logic here]

	const displayLabel = props.locations.shuttleID || "Unknown";

	const hover = (
		<div className="rounded-md bg-slate-500 p-2 text-white">
			<div>Shuttle ID: {props.locations.shuttleID}</div>
			<div>Mac Address: {props.locations.macAddress}</div>
			<div>Current Location: {props.locations.currentLocation}</div>
			<div>Current Firmware: {props.locations.currentFirmwareVersion}</div>
			<div>
				Last Location Update:{" "}
				{props.locations.locationLastUpdated.toLocaleString("en-UK")}
			</div>
			<div>Last firmware check: {props.locations.lastFirmwareUpdate}</div>
		</div>
	);

	return (
		<Link
			className="min-w-36 text-center"
			href={
				"/dashboard/shuttles/" + props.locations.macAddress.replaceAll(" ", "")
			}
		>
			<HoverPopup itemToHover={displayLabel} itemToPopUp={hover} />
		</Link>
	);
};

export default ShuttlePanel;
