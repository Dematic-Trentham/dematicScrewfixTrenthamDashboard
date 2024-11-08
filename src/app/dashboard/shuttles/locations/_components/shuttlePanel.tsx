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
}

interface ShuttlePanelProps {
	locations: shuttleLocation;
	passedFaults: {
		sortedResultsAisle: any;
		sortedResultsShuttleID: any;
		worstShuttleByAisle: number;
		worstShuttleByShuttle: number;
	} | null;
	currentLocation: string;
	currentSearchTime: number;
	colorByType: colorByTypeType;
	inMaintenanceBay: boolean;
	mostCount: number;
	worstMissionPerFault: number;
}

const ShuttlePanel: React.FC<ShuttlePanelProps> = (props) => {
	const [shuttleColor, setShuttleColor] = useState<string>("bg-gray-200");

	const [shuttleFaultsCount, setShuttleFaultsCount] = useState<number>(0);
	const [aisleFaultsCount, setAisleFaultsCount] = useState<number>(0);

	//console.log("shuttleFaultsByShuttle: ", shuttleFaultsByShuttle);

	useEffect(() => {
		const fetchShuttleFaults = async () => {
			const localShuttleFaults =
				props.passedFaults?.sortedResultsShuttleID?.[
					props.locations?.shuttleID
				];

			//my faults
			let shuttleFaultsCount = 0;
			let aisleFaultsCount = 0;

			if (localShuttleFaults) {
				shuttleFaultsCount = localShuttleFaults.length;
			}

			//convert currentLocation to aisle	and level
			const aisle = parseInt(props.locations.currentLocation.substring(4, 6));
			const level = parseInt(props.locations.currentLocation.substring(8, 10));

			//if passedFaults by aisle
			let localAisleFaults = null;

			if (props.passedFaults?.sortedResultsAisle) {
				if (props.passedFaults.sortedResultsAisle[aisle]) {
					if (props.passedFaults.sortedResultsAisle[aisle][level]) {
						localAisleFaults =
							props.passedFaults.sortedResultsAisle[aisle][level];
					}
				}
			}

			aisleFaultsCount = localAisleFaults ? localAisleFaults.length : 0;

			if (props.colorByType === colorByTypeType.shuttle) {
				setShuttleColor(
					makeColor(
						shuttleFaultsCount,
						props.passedFaults?.worstShuttleByShuttle
					)
				);
				//setShuttleFaults(localShuttleFaults);
			} else if (props.colorByType === colorByTypeType.aisle) {
				setShuttleColor(
					makeColor(aisleFaultsCount, props.passedFaults?.worstShuttleByAisle)
				);
				//setShuttleFaults(localAisleFaults);
			} else if (props.colorByType === colorByTypeType.counts) {
				//if in maintenance bay, set to green
				if (props.inMaintenanceBay) {
					setShuttleColor("bg-green-500");
				} else {
					const totalCountsResult = await getShuttleCountsByLocation(
						aisle,
						level,
						props.currentSearchTime
					);

					const totalCounts =
						totalCountsResult[0].totalPicks +
						totalCountsResult[0].totalDrops +
						totalCountsResult[0].totalIATs;

					setShuttleColor(makeColor(totalCounts, props.mostCount));
				}
			}

			setShuttleFaultsCount(shuttleFaultsCount);
			setAisleFaultsCount(aisleFaultsCount);
		};

		fetchShuttleFaults();
	}, [props]);

	const makeColor = (myFaults: number, worstFaults: number | undefined) => {
		if (!worstFaults) {
			worstFaults = 1;
		}
		const faultPercentage = myFaults / worstFaults;

		if (faultPercentage < 0.01) {
			return "bg-green-500";
		} else if (faultPercentage < 0.2) {
			return "bg-green-400";
		} else if (faultPercentage < 0.3) {
			return "bg-yellow-300";
		} else if (faultPercentage < 0.4) {
			return "bg-yellow-400";
		} else if (faultPercentage < 0.5) {
			return "bg-yellow-500";
		} else if (faultPercentage < 0.6) {
			return "bg-orange-400";
		} else if (faultPercentage < 0.7) {
			return "bg-orange-500";
		} else if (faultPercentage < 0.8) {
			return "bg-red-400";
		} else if (faultPercentage < 0.9) {
			return "bg-red-500";
		} else {
			return "bg-red-600";
		}
	};

	let displayLabel = <></>;

	if (props.colorByType === colorByTypeType.shuttle || props.inMaintenanceBay) {
		displayLabel = (
			<div className={`rounded-xl ${shuttleColor}`}>
				{props.locations.shuttleID || "Unknown"}
			</div>
		);
	} else {
		displayLabel = (
			<div className={`rounded-xl ${shuttleColor}`}>
				{props.locations.currentLocation || "Unknown"}
			</div>
		);
	}

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

			<div> </div>
			<div>Faults with Shuttle: {shuttleFaultsCount}</div>
			<div>Faults with Aisle: {aisleFaultsCount}</div>
			<div>Total Counts: {</div>
		</div>
	);

	return (
		<Link
			className="min-w-36 text-center"
			href={
				"/dashboard/shuttles/locations/" +
					props.locations.macAddress.replaceAll(" ", "") +
					"?currentSearchTime=" +
					props.currentSearchTime || "1"
			}
		>
			<HoverPopup itemToHover={displayLabel} itemToPopUp={hover} />
		</Link>
	);
};

export default ShuttlePanel;
