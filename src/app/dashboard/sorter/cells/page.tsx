"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { set } from "zod";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";

import { getAllCells } from "./_actions/actions";

import PanelTop from "@/components/panels/panelTop";
import { updateUrlParams } from "@/utils/url/params";
import config from "@/config";

export default function CellsPage() {
	const [cells, setCells] = useState<
		{ id: string; cellNumber: number; disabled: boolean; dateChanged: Date }[]
	>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [showOnlyDisabledValue, setShowOnlyDisabled] = useState(false);
	const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

	const router = useRouter();
	const searchParams = useSearchParams();

	useEffect(() => {
		async function fetchCells() {
			//get show only disabled from the url
			const showOnlyDisabled = searchParams.get("showOnlyDisabled");

			if (showOnlyDisabled === "true") {
				setShowOnlyDisabled(true);
			}

			try {
				const cellsData = await getAllCells();

				if (cellsData === null) {
					setError("Failed to fetch cells data.");

					return;
				}

				//date changed on cell 0
				const dateChanged = new Date(cellsData[0].dateChanged);

				setLastUpdated(dateChanged);

				//remove cell number 0
				cellsData.splice(0, 1);

				setCells(cellsData);
			} catch (err) {
				setError("An error occurred while fetching cells data." + err);
			} finally {
				setLoading(false);
			}
		}
		fetchCells(); // Initial fetch

		const intervalId = setInterval(() => {
			fetchCells();
		}, config.refreshTime); //refresh interval

		return () => clearInterval(intervalId); // Cleanup on unmount
	}, []);

	function ShowOnlyDisabled(value: boolean) {
		setShowOnlyDisabled(value);

		updateUrlParams(searchParams, router, "showOnlyDisabled", value.toString());
	}

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	const filteredCells = showOnlyDisabledValue
		? cells.filter((cell) => cell.disabled)
		: cells;

	return (
		<PanelTop
			className="h-fit w-full"
			title="Sorter Cells - Status"
			topRight={
				<div>
					<label>
						<input
							checked={showOnlyDisabledValue}
							type="checkbox"
							onChange={() => ShowOnlyDisabled(!showOnlyDisabledValue)}
						/>{" "}
						Show only disabled cells
					</label>
				</div>
			}
		>
			<Tabs>
				<TabList>
					<Tab>Overview</Tab>
					<Tab>Last Modified</Tab>
				</TabList>
				<TabPanel>
					<table className="dematicTable ce">
						<thead>
							<tr>
								<th style={{ width: "30%" }}>Total Cells</th>
								<th style={{ width: "30%" }}>Total Disabled</th>
								<th style={{ width: "40%" }}>Total Enabled</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>{cells.length}</td>
								<td>{cells.filter((cell) => cell.disabled).length}</td>
								<td>{cells.filter((cell) => !cell.disabled).length}</td>
							</tr>
						</tbody>
					</table>
					<br />
					<table className="dematicTable dematicTableStriped dematicTableHoverable">
						<thead>
							<tr>
								<th style={{ width: "25%" }}>Cell Number</th>
								<th style={{ width: "25%" }}>Status</th>
								<th style={{ width: "25%" }}>Date Changed</th>
								<th style={{ width: "25%" }}>Actions</th>
							</tr>
						</thead>
						<tbody>
							{filteredCells.map((cell) => {
								return (
									<tr
										key={cell.id}
										style={{
											backgroundColor: cell.disabled ? "red" : undefined,
										}}
									>
										<td>{cell.cellNumber}</td>
										<td>{cell.disabled ? "Disabled" : "Enabled"}</td>
										<td>
											{new Date(cell.dateChanged).toLocaleString("en-GB", {
												hour: "2-digit",
												minute: "2-digit",
												day: "2-digit",
												month: "2-digit",
												year: "numeric",
												timeZone: "UTC",
											})}
										</td>
										<td>
											<Link
												href={`/dashboard/sorter/cells/${cell.cellNumber}?showOnlyDisabled=${showOnlyDisabledValue}`}
											>
												View History
											</Link>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</TabPanel>
				<TabPanel />
			</Tabs>
			{lastUpdated && (
				<div>
					<div style={{ fontSize: "0.8em" }}>
						Last updated: {lastUpdated.toLocaleString("en-GB")}
					</div>
					<div>
						Please remember that this data is not real-time and will update as
						the sorter trace files are collected. This is roughly 15 minutes, if
						the sorter is busy, during quiet times it will be less frequent.
					</div>
				</div>
			)}
		</PanelTop>
	);
}
