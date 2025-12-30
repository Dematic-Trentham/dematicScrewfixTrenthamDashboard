import { useEffect, useState } from "react";

import {
	getFaultCodeLookup,
	getLastMaintenances,
	getShuttleFaults,
} from "./_actions";

import {
	shuttleFaultCodeLookup,
	shuttleFaultGroup,
} from "@/app/dashboard/shuttles/_types/shuttle";

interface ShuttlePageFaultsFromThisShuttleGroupedProps {
	macAddress: string;
	daysToSearch: number;
}

const ShuttlePageFaultsFromThisShuttleGrouped: React.FC<
	ShuttlePageFaultsFromThisShuttleGroupedProps
> = (props) => {
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [faults, setFaults] = useState<shuttleFaultGroup[]>([]);
	const [faultCodeLookup, setFaultCodeLookup] = useState<
		shuttleFaultCodeLookup[]
	>([]);

	const [lastMaintenanceTime, setLastMaintenanceTime] = useState<Date | null>(
		null
	);
	const [lastMaintenanceText, setLastMaintenanceText] = useState<string>("");

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

					console.log("setting max");
					localDaysToSearch = 9999; //set to a high number to fetch all faults
				}
			} else {
				lastMaintenanceArr = await getLastMaintenances(props.macAddress);
			}

			let shuttle = await getShuttleFaults(props.macAddress, localDaysToSearch);
			const faultCodeLookup = await getFaultCodeLookup();

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

			setIsLoading(false);

			let shuttleGroup: shuttleFaultGroup[] = [];

			//if there is a last maintenance time, filter out all faults that happened before the last maintenance time
			if (props.daysToSearch === -99 && lastMaintenanceTime) {
				shuttle = shuttle.filter(
					(fault: { timestamp: { getTime: () => number } }) =>
						fault.timestamp.getTime() >= lastMaintenanceTime.getTime()
				);
			}

			shuttle.forEach((fault: { faultCode: any; count?: number }) => {
				const found = shuttleGroup.find(
					(group) => group.faultCode === fault.faultCode
				);

				if (found) {
					found.count += 1;
				} else {
					shuttleGroup.push({
						...fault,
						count: 1,
					});
				}
			});

			setFaults(shuttleGroup);
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
						["Fault Description", "Count"],
						...faults.map((fault) => [
							faultCodeLookup.find(
								(faultCode) => faultCode.ID === fault.faultCode
							)?.faultMessage || "Unknown",
							fault.count,
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
						<th style={{ width: "200px" }}>Fault Description</th>
						<th style={{ width: "50px" }}>Count</th>
					</tr>
				</thead>

				<tbody>
					{faults.length === 0 ? (
						<tr>
							<td className="text-center" colSpan={2}>
								No faults found for the selected location and date range.
							</td>
						</tr>
					) : (
						faults.map((fault) => {
							return (
								<tr
									key={fault.faultCode}
									className="border border-black text-center hover:bg-yellow-200"
								>
									<td>
										{faultCodeLookup.find(
											(faultCode) => faultCode.ID === fault.faultCode
										)?.faultMessage || "Unknown"}
									</td>
									<td>{fault.count}</td>
								</tr>
							);
						})
					)}
				</tbody>
			</table>
		</div>
	);
};

export default ShuttlePageFaultsFromThisShuttleGrouped;
