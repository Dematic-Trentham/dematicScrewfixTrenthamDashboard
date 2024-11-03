import { useEffect, useState } from "react";

import { getFaultCodeLookup, getLocationFaults } from "./_actions";
import { getShuttleMovementLogsByLocation } from "./_actions/index";

import {
	shuttleFault,
	shuttleFaultCodeLookup,
} from "@/app/dashboard/shuttles/_types/shuttle";
import HoverPopup from "@/components/visual/hoverPopupFloat";

interface ShuttlePageFaultsFromThisLocationProps {
	location: string;
	daysToSearch: number;
}

const ShuttlePageFaultsFromThisLocation: React.FC<
	ShuttlePageFaultsFromThisLocationProps
> = (props) => {
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [faults, setFaults] = useState<shuttleFault[]>([]);
	const [faultCodeLookup, setFaultCodeLookup] = useState<
		shuttleFaultCodeLookup[]
	>([]);

	useEffect(() => {
		const fetchShuttle = async () => {
			//split location string into aisle(char 5 and 6) and level(char 7 and 8)
			const aisle = parseInt(props.location.slice(5, 7));
			const level = parseInt(props.location.slice(9, 10));

			const shuttle = await getLocationFaults(aisle, level, props.daysToSearch);
			const faultCodeLookup = await getFaultCodeLookup();
			const ShuttleMovementLogsByLocation =
				await getShuttleMovementLogsByLocation(
					aisle,
					level,
					props.daysToSearch
				);

			if (!shuttle) {
				setIsLoading(false);
				setError("Failed to fetch shuttle details");
				setFaults([]);

				return;
			}

			if (!faultCodeLookup) {
				setIsLoading(false);
				setError("Failed to fetch fault code lookup");
				setFaultCodeLookup([]);

				return;
			}

			//insert the shuttle movement logs into the shuttle faults (As a fault with a fault code of -1)
			ShuttleMovementLogsByLocation.forEach((log) => {
				//Make log into a json object
				const logString = JSON.stringify(log);

				shuttle.push({
					ID: log.ID,
					aisle: log.aisle,
					level: log.level,
					timestamp: log.timestamp,
					macAddress: "N/A",
					faultCode: "-1",
					WLocation: 0,
					ZLocation: 0,
					shuttleID: "N/A",
					xLocation: 0,
					xCoordinate: 0,
					faultMessage: -1,
					resolvedReason: "N/A",
					resolvedTimestamp: null,
					rawInfo: logString,
				});
			});

			//sort the shuttle faults by timestamp
			shuttle.sort((a, b) => {
				return b.timestamp.getTime() - a.timestamp.getTime();
			});

			console.log(shuttle);

			setIsLoading(false);
			setFaults(shuttle);
			setFaultCodeLookup(faultCodeLookup);
			setError(null);
		};

		fetchShuttle();
	}, [props]);

	if (isLoading) {
		return <div>is loading....</div>;
	}

	if (error) {
		return <div className="text-red-600">{error}</div>;
	}

	const exportButton = (
		<div className="float-right">
			<button
				className="mb-4 rounded bg-blue-500 p-2 text-white"
				onClick={() => {
					const csvContent = [
						[
							"Timestamp Date",
							"Timestamp Time",
							"Resolve Time Date",
							"Resolve Time Time",
							"Time in Fault",
							"Fault Description",
							"W Location",
							"Z Location",
							"Aisle",
							"Level",
							"Shuttle ID",
							"X Location",
							"X Coordinate",
						],
						...faults.map((fault) => [
							fault.timestamp.toLocaleString(),
							fault.resolvedTimestamp?.toLocaleString() || "Not Resolved",
							fault.resolvedTimestamp
								? (
										(fault.resolvedTimestamp.getTime() -
											fault.timestamp.getTime()) /
										1000
									).toString()
								: "Not Resolved",
							faultCodeLookup.find(
								(faultCode) => faultCode.ID === fault.faultCode
							)?.faultMessage || "Unknown",
							fault.WLocation,
							fault.ZLocation,
							fault.aisle,
							fault.level,
							fault.shuttleID,
							fault.xLocation,
							fault.xCoordinate,
						]),
					]
						.map((e) => e.join(","))
						.join("\n");

					const blob = new Blob([csvContent], {
						type: "text/csv;charset=utf-8;",
					});
					const link = document.createElement("a");
					const url = URL.createObjectURL(blob);

					link.setAttribute("href", url);
					link.setAttribute("download", "shuttle_faults.csv");
					link.style.visibility = "hidden";
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
				}}
			>
				Export as CSV
			</button>
		</div>
	);

	return (
		<div>
			{exportButton}
			<table className="w-full">
				<thead className="border border-black bg-orange-400">
					<tr>
						<th style={{ width: "150px" }}>Timestamp</th>
						<th style={{ width: "150px" }}>Resolve Time</th>
						<th style={{ width: "100px" }}>Time in Fault</th>
						<th style={{ width: "100px" }}>Shuttle ID</th>
						<th style={{ width: "200px" }}>Fault Description</th>
						<th style={{ width: "50px" }}>Details</th>
					</tr>
				</thead>

				<tbody>
					{faults.length === 0 ? (
						<tr>
							<td className="text-center" colSpan={6}>
								No faults found for the selected location and date range.
							</td>
						</tr>
					) : (
						faults.map((fault) => {
							return makeFaultRow(fault, faultCodeLookup);
						})
					)}
				</tbody>
			</table>
		</div>
	);
};

export default ShuttlePageFaultsFromThisLocation;

function makeFaultRow(
	fault: shuttleFault,
	faultCodeLookup: shuttleFaultCodeLookup[]
) {

	console.log(fault);

	if (fault.faultCode === "-1") {
		//This is a shuttle movement log

		const log = JSON.parse(fault.rawInfo);

		//make date object
		log.timestamp = new Date(log.timestamp);

		//return a row with the shuttle movement log details in it make it blue
		return (
			<tr
				key={log.ID}
				className="border border-black text-center hover:bg-blue-400 bg-blue-200"
			>
				<td>{log.timestamp.toLocaleString()}</td>
				<td>Shuttle Swapped </td>
				<td>{`From ${log.oldShuttleID}`}</td>
				<td>{`To ${log.newShuttleID}`}</td>
				<td colSpan={2} />
			</tr>
		);

	} else {
		return (
			<tr
				key={fault.ID}
				className="border border-black text-center hover:bg-yellow-200"
			>
				<td>{fault.timestamp.toLocaleString()}</td>
				<td>{fault.resolvedTimestamp?.toLocaleString() || "Not Resolved"}</td>
				<td>
					{fault.resolvedTimestamp
						? (fault.resolvedTimestamp.getTime() - fault.timestamp.getTime()) /
							1000
						: "Not Resolved"}
				</td>
				<td>{fault.shuttleID}</td>
				<td>
					{faultCodeLookup.find((faultCode) => faultCode.ID === fault.faultCode)
						?.faultMessage || "Unknown"}
				</td>

				<td>
					<HoverPopup
						itemToHover={<button>Details</button>}
						itemToPopUp={
							<div className="w-52 rounded-lg bg-yellow-400 p-1">
								<div>W Location: {fault.WLocation}</div>
								<div>Z Location: {fault.ZLocation}</div>
								<div>Aisle: {fault.aisle}</div>
								<div>Level: {fault.level}</div>
								<div>Shuttle ID: {fault.shuttleID}</div>
								<div>X Location: {fault.xLocation}</div>
								<div>X Coordinate: {fault.xCoordinate}</div>
							</div>
						}
						xOffset={-208}
					/>
				</td>
			</tr>
		);
	}
}
