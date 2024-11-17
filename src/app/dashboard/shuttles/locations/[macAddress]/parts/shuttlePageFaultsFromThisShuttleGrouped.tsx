import { useEffect, useState } from "react";

import { getFaultCodeLookup, getShuttleFaults } from "./_actions";

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

	useEffect(() => {
		const fetchShuttle = async () => {
			const shuttle = await getShuttleFaults(
				props.macAddress,
				props.daysToSearch
			);
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
