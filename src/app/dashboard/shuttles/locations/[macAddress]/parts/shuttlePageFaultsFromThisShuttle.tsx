import { useEffect, useState } from "react";
import * as React from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

import {
	getFaultCodeLookup,
	getLastMaintenances,
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

	const [lastMaintenanceTime, setLastMaintenanceTime] = useState<Date | null>(
		null
	);

	const [lastMaintenanceText, setLastMaintenanceText] = useState<string>("");

	const [maintenanceLog, setMaintenanceLog] = useState<
		| {
				ID: string;
				macAddress: string;
				shuttleID: string;
				lastMaintenanceDate: Date;
				maintenanceDetails: string;
		  }[]
		| null
	>(null);

	useEffect(() => {
		const fetchShuttle = async () => {
			let localDaysToSearch = props.daysToSearch;
			let lastMaintenanceArr:
				| {
						ID: any;
						lastMaintenanceDate: any;
						maintenanceDetails: any;
				  }[]
				| null = [];

			if (props.daysToSearch === -99) {
				//fetch last maintenance time
				lastMaintenanceArr = await getLastMaintenances(props.macAddress);

				if (lastMaintenanceArr && lastMaintenanceArr.length > 0) {
					const lastMaintenance = lastMaintenanceArr[0];

					setLastMaintenanceText(
						` (Details: ${lastMaintenance.maintenanceDetails})`
					);

					//convert lastMaintenanceDate to date object
					setLastMaintenanceTime(new Date(lastMaintenance.lastMaintenanceDate));
					//setMaintenanceLog(lastMaintenanceArr);

					localDaysToSearch = Math.ceil(
						(Date.now() -
							new Date(lastMaintenance.lastMaintenanceDate).getTime()) /
							(24 * 60 * 60 * 1000)
					);
				} else {
					//no maintenance found, set date to null
					setLastMaintenanceTime(null);
					setMaintenanceLog(null);
					console.log("setting max");
					localDaysToSearch = 9999; //set to a high number to fetch all faults
				}
			} else {
				lastMaintenanceArr = await getLastMaintenances(props.macAddress);
			}

			console.log("Last maintenance array:", lastMaintenanceArr);

			console.log("Fetching shuttle faults for:", localDaysToSearch, "days");

			let shuttle = await getShuttleFaults(props.macAddress, localDaysToSearch);
			const faultCodeLookup = await getFaultCodeLookup();
			const ShuttleMovementLogsByLocation = await getShuttleMovementLogsByMac(
				props.macAddress,
				localDaysToSearch
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

			console.log("Last maintenance logs:", lastMaintenanceArr);

			//for each maintenance log add a shuttle fault entry indicating maintenance
			lastMaintenanceArr?.forEach(
				(log: {
					ID: any;
					lastMaintenanceDate: any;
					maintenanceDetails: any;
				}) => {
					//Make log into a json object
					const logString = JSON.stringify(log);

					shuttle.push({
						ID: log.ID,
						aisle: 0,
						level: 0,
						timestamp: log.lastMaintenanceDate,
						macAddress: "N/A",
						faultCode: "-2",
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

			//if there is a last maintenance time, filter out all faults that happened before the last maintenance time
			if (props.daysToSearch === -99 && lastMaintenanceTime) {
				shuttle = shuttle.filter(
					(fault: { timestamp: { getTime: () => number } }) =>
						fault.timestamp.getTime() >= lastMaintenanceTime.getTime()
				);
			}

			console.log("Shuttle faults fetched:", shuttle);

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
					const sanitize = (val: any) =>
						String(val ?? "")
							.replace(/,/g, "")
							.replace(",", "")
							.replace(/"/g, "")
							.replace(/[\r\n]+/g, " ")
							.trim();

					const csvContent = [
						[
							"Timestamp",
							"Resolve Time",
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
						...faults.map((fault) => {
							const ts = fault.timestamp
								? new Date(fault.timestamp).toLocaleString()
								: "";
							const resolved = fault.resolvedTimestamp
								? new Date(fault.resolvedTimestamp).toLocaleString()
								: "Not Resolved";
							const timeInFault = fault.resolvedTimestamp
								? (
										(fault.resolvedTimestamp.getTime() -
											fault.timestamp.getTime()) /
										1000
									).toString()
								: "Not Resolved";
							const faultMessage =
								fault.faultCode === "-1"
									? "Movement Log"
									: faultCodeLookup.find((fc) => fc.ID === fault.faultCode)
											?.faultMessage || "Unknown";

							return [
								sanitize(ts),
								sanitize(resolved),
								sanitize(timeInFault),
								sanitize(faultMessage),
								sanitize(fault.WLocation),
								sanitize(fault.ZLocation),
								sanitize(fault.aisle),
								sanitize(fault.level),
								sanitize(fault.shuttleID),
								sanitize(fault.xLocation),
								sanitize(fault.xCoordinate),
							].join(",");
						}),
					]
						.map((e) => (Array.isArray(e) ? e.join(",") : e))
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
			{lastMaintenanceTime && (
				<>
					Showing faults since last maintenance on{" "}
					{lastMaintenanceTime.toLocaleString()}
					{lastMaintenanceText}
				</>
			)}
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
	} else if (fault.faultCode === "-2") {
		//This is a shuttle movement log

		const log = JSON.parse(fault.rawInfo);

		//make date object
		log.timestamp = new Date(log.timestamp);

		console.log(fault);

		//return a row with the shuttle movement log details in it make it blue
		return (
			<tr
				key={log.ID}
				className="border border-black bg-yellow-200 text-center hover:bg-yellow-400"
			>
				<td>{fault.timestamp.toLocaleString()}</td>
				<td>Maintenace Performed </td>
				<td colSpan={5}> {`Details: ${log.maintenanceDetails}`}</td>
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
