"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

import { shuttleLocation } from "../../_types/shuttle";

import HoverPopup from "@/components/visual/hoverPopupFloat";

export enum colorByTypeType {
	aisle,
	shuttle,
}

interface ShuttlePanelProps {
	locations: shuttleLocation;
	passedFaults: {
		sortedResultsAisle: any;
		sortedResultsShuttleID: any;
		worstShuttleByAisle: number;
		worstShuttleByShuttle: number;
	} | null;

	colorByType: colorByTypeType;
}

const ShuttlePanel: React.FC<ShuttlePanelProps> = (props) => {
	const [shuttleFaults, setShuttleFaults] = useState<any>(null);

	const shuttleFaultsByShuttle =
		props.passedFaults?.sortedResultsShuttleID?.[props.locations?.shuttleID];

	console.log("shuttleFaultsByShuttle: ", shuttleFaultsByShuttle);

	useEffect(() => {
		const fetchShuttleFaults = async () => {
			console.log(
				"fetchShuttleFaults for shuttleID: ",
				props.locations.shuttleID
			);
			console.log("props.passedFaults: ", props.passedFaults);

			const localShuttleFaults =
				props.passedFaults?.sortedResultsShuttleID?.[
					props.locations?.shuttleID
				];

			if (localShuttleFaults == null) {
				//console.log("localShuttleFaults is null");

				return;
			}
			console.log("localShuttleFaults: ", localShuttleFaults);
		};

		//fetchShuttleFaults();
	}, []);

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
