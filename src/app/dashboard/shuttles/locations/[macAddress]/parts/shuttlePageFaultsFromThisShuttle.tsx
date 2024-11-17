import { useEffect, useState } from "react";
import * as React from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

import {
	getFaultCodeLookup,
	getShuttleFaults,
	getShuttleMovementLogsByMac,
} from "./_actions";

import {
	shuttleFault,
	shuttleFaultCodeLookup,
} from "@/app/dashboard/shuttles/_types/shuttle";

interface ShuttlePageFaultsFromThisShuttleProps {
	macAddress: string;
	daysToSearch: number;
}

const ShuttlePageFaultsFromThisShuttle: React.FC<
	ShuttlePageFaultsFromThisShuttleProps
> = (props) => {
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [faults, setFaults] = useState<shuttleFault[]>([]);
	const [faultCodeLookup, setFaultCodeLookup] = useState<
		shuttleFaultCodeLookup[]
	>([]);

	useEffect(() => {
		const fetchShuttle = async () => {
			const shuttle = await getShuttleFaults(
				props.macAddress,
				props.daysToSearch
			);
			const faultCodeLookup = await getFaultCodeLookup();
			const ShuttleMovementLogsByLocation = await getShuttleMovementLogsByMac(
				props.macAddress,
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
			ShuttleMovementLogsByLocation.forEach(
				(log: { ID: any; aisle: any; level: any; timestamp: any }) => {
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
				}
			);

			//sort the shuttle faults by timestamp
			shuttle.sort(
				(
					a: { timestamp: { getTime: () => number } },
					b: { timestamp: { getTime: () => number } }
				) => {
					return b.timestamp.getTime() - a.timestamp.getTime();
				}
			);

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
		<>
			{exportButton}
			<table className="w-full">
				<thead className="border border-black bg-orange-400">
					<tr>
						<th style={{ width: "150px" }}>Timestamp</th>
						<th style={{ width: "150px" }}>Resolve Time</th>
						<th style={{ width: "100px" }}>Time in Fault</th>
						<th style={{ width: "100px" }}>Location</th>
						<th style={{ width: "200px" }}>Fault Description</th>
						<th style={{ width: "50px" }}>Details</th>
						<th style={{ width: "50px" }}>Extra</th>
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
							return makeFaultRow(fault, faultCodeLookup || []);
						})
					)}
				</tbody>
			</table>
		</>
	);
};

function makeFaultRow(
	fault: shuttleFault,
	faultCodeLookup: shuttleFaultCodeLookup[]
) {
	if (fault.faultCode === "-1") {
		//This is a shuttle movement log

		const log = JSON.parse(fault.rawInfo);

		//make date object
		log.timestamp = new Date(log.timestamp);

		//return a row with the shuttle movement log details in it make it blue
		return (
			<tr
				key={log.ID}
				className="border border-black bg-blue-200 text-center hover:bg-blue-400"
			>
				<td>{log.timestamp.toLocaleString()}</td>
				<td>Shuttle Swapped </td>
				<td>{`At aisle  ${log.aisle}`}</td>
				<td>{`At level  ${log.level}`}</td>
				<td colSpan={3} />
			</tr>
		);
	} else {
		const rawInfo = JSON.parse(fault.rawInfo);

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
				<td>
					{fault.aisle}, {fault.level}
				</td>
				<td>
					{faultCodeLookup.find((faultCode) => faultCode.ID === fault.faultCode)
						?.faultMessage || "Unknown"}
				</td>

				<td>
					<Tippy
						content={
							<>
								<div>W Location: {fault.WLocation}</div>
								<div>Z Location: {fault.ZLocation}</div>
								<div>Aisle: {fault.aisle}</div>
								<div>Level: {fault.level}</div>
								<div>Shuttle ID: {fault.shuttleID}</div>
								<div>X Location: {fault.xLocation}</div>
								<div>X Coordinate: {fault.xCoordinate}</div>
							</>
						}
					>
						<button>Details</button>
					</Tippy>
				</td>
				<td>
					<Tippy
						content={
							<>
								<table className="border-separate border-spacing-y-0">
									<tbody>
										<tr>
											<td>Shuttle Status:</td>
										</tr>
										<tr>
											<td>&emsp;&emsp;Configured:</td>
											<td>{rawInfo.shuttleStatus.configured}</td>
										</tr>
										<tr>
											<td>&emsp;&emsp;Homed:</td>
											<td>{rawInfo.shuttleStatus.homed}</td>
										</tr>
										<tr>
											<td>&emsp;&emsp;Taught:</td>
											<td>{rawInfo.shuttleStatus.taught}</td>
										</tr>
										<tr>
											<td>&emsp;&emsp;Maintenance Mode:</td>
											<td>{rawInfo.shuttleStatus.maintMode}</td>
										</tr>
										<tr>
											<td>&emsp;&emsp;Mode</td>
											<td>{rawInfo.mode}</td>
										</tr>
										<tr>
											<td>&emsp;&emsp;Order Step:</td>
											<td>{rawInfo.orderStep}</td>
										</tr>
										<tr>
											<td>Load Status</td>
										</tr>
										<tr>
											<td>&emsp;&emsp;Loaded:</td>
											<td>{rawInfo.loadStatus.loaded}</td>
										</tr>
										<tr>
											<td>&emsp;&emsp;Sensor 1 Blocked:</td>
											<td>{rawInfo.loadStatus.sensor1Blocked}</td>
										</tr>
										<tr>
											<td>&emsp;&emsp;Sensor 2 Blocked:</td>
											<td>{rawInfo.loadStatus.sensor2Blocked}</td>
										</tr>

										<tr>
											<td>Finger Status:</td>
										</tr>
										<tr>
											<td>&emsp;&emsp;Finger Pair 1:</td>
											<td>
												Up:&nbsp;{rawInfo.fingerStatus.fingerUpStatus.pair1},
												Down:&nbsp;
												{rawInfo.fingerStatus.fingerDownStatus.pair1}
											</td>
										</tr>
										<tr>
											<td>&emsp;&emsp;Finger Pair 2:</td>
											<td>
												Up:&nbsp;{rawInfo.fingerStatus.fingerUpStatus.pair2},
												Down:&nbsp;
												{rawInfo.fingerStatus.fingerDownStatus.pair2}
											</td>
										</tr>
										<tr>
											<td>&emsp;&emsp;Finger Pair 3:</td>
											<td>
												Up:&nbsp;{rawInfo.fingerStatus.fingerUpStatus.pair3},
												Down:&nbsp;
												{rawInfo.fingerStatus.fingerDownStatus.pair3}
											</td>
										</tr>
										<tr>
											<td>&emsp;&emsp;Finger Pair 4:</td>
											<td>
												Up:&nbsp;{rawInfo.fingerStatus.fingerUpStatus.pair4},
												Down:&nbsp;
												{rawInfo.fingerStatus.fingerDownStatus.pair4}
											</td>
										</tr>
									</tbody>
								</table>
							</>
						}
					>
						<button>Extras</button>
					</Tippy>
				</td>
			</tr>
		);
	}
}

export default ShuttlePageFaultsFromThisShuttle;
