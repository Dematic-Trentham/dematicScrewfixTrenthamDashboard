import { useEffect, useState } from "react";

import {
	getFaultCodeLookup,
	getLocationFaults,
	getShuttleCountsByLocation,
} from "./_actions";
import { getShuttleMovementLogsByLocation } from "./_actions/index";

import {
	shuttleFault,
	shuttleFaultCodeLookup,
} from "@/app/dashboard/shuttles/_types/shuttle";
import HoverPopup from "@/components/visual/hoverPopupFloat";

interface shuttlePageCountsProps {
	location: string;
	daysToSearch: number;
}

const ShuttlePageCounts: React.FC<
	shuttlePageCountsProps
> = (props) => {
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [counts, setCounts] = useState<
		{
			ID: string;
			timeStamp: Date;
			timeRange: string;
			aisle: number;
			level: number;
			shuttleID: string;
			totalPicks: number;
			totalDrops: number;
			totalIATs: number;
		}[]
	>([]);
	const [faultCodeLookup, setFaultCodeLookup] = useState<
		shuttleFaultCodeLookup[]
	>([]);

	useEffect(() => {
		const fetchShuttle = async () => {
			//split location string into aisle(char 5 and 6) and level(char 7 and 8)
			const aisle = parseInt(props.location.slice(5, 7));
			const level = parseInt(props.location.slice(8, 10));

			const shuttle = await getShuttleCountsByLocation(
				aisle,
				level,
				props.daysToSearch
			);

			if (!shuttle) {
				setIsLoading(false);
				setError("Failed to fetch shuttle details");
				setCounts([]);

				return;
			}

			if (!faultCodeLookup) {
				setIsLoading(false);
				setError("Failed to fetch fault code lookup");
				setFaultCodeLookup([]);

				return;
			}

			setIsLoading(false);
			setCounts(shuttle);
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
					// const csvContent = [
					// 	[
					// 		"Timestamp Date",
					// 		"Timestamp Time",
					// 		"Resolve Time Date",
					// 		"Resolve Time Time",
					// 		"Time in Fault",
					// 		"Fault Description",
					// 		"W Location",
					// 		"Z Location",
					// 		"Aisle",
					// 		"Level",
					// 		"Shuttle ID",
					// 		"X Location",
					// 		"X Coordinate",
					// 	],
					// const blob = new Blob([csvContent], {
					// 	type: "text/csv;charset=utf-8;",
					// });
					// const link = document.createElement("a");
					// const url = URL.createObjectURL(blob);
					// link.setAttribute("href", url);
					// link.setAttribute("download", "shuttle_faults.csv");
					// link.style.visibility = "hidden";
					// document.body.appendChild(link);
					// link.click();
					// document.body.removeChild(link);
				}}
			/>
		</div>
	);

	return (
		<div>
			{exportButton}
			<table className="w-full">
				<thead className="border border-black bg-orange-400">
					<tr>
						<th style={{ width: "150px" }}>Timestamp</th>
						<th style={{ width: "150px" }}>Total Picks</th>
						<th style={{ width: "100px" }}>Total Drops</th>
						<th style={{ width: "100px" }}>Total IATs</th>
	
					</tr>
				</thead>

				<tbody>

					{counts.map((count) => (
						<tr
							key={count.ID}
							className="border border-black text-center hover:bg-yellow-200"
						>
							<td>{count.timeStamp.toLocaleString() + " - " + new Date(count.timeStamp.getTime() + 60 * 60 * 1000).toLocaleString()}</td>
							<td>{count.totalPicks}</td>
							<td>{count.totalDrops}</td>
							<td>{count.totalIATs}</td>
						</tr>
					))}

				</tbody>
			</table>
		</div>
	);
};

export default ShuttlePageCounts;

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
						? Math.round(
								(fault.resolvedTimestamp.getTime() -
									fault.timestamp.getTime()) /
									1000
							)
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
