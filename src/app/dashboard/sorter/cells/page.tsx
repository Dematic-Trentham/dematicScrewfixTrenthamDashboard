"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";

import { getAllCells, getAllCellsHistory } from "./_actions/actions";

import PanelTop from "@/components/panels/panelTop";
import { updateUrlParams } from "@/utils/url/params";
import config from "@/config";
import "react-tabs/style/react-tabs.css";
import Loading from "@/components/visual/loading";

export default function CellsPage() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [cells, setCells] = useState<
		{ id: string; cellNumber: number; disabled: boolean; dateChanged: Date }[]
	>([]);

	const initialTimeToSearch = searchParams.get("currentSearchTime")
		? Number(searchParams.get("currentSearchTime"))
		: 7;

	const [timeToSearch, setTimeToSearch] = useState<number>(initialTimeToSearch);
	const [history, setHistory] = useState<any[]>([]);

	const [stats, setStats] = useState<any[]>([]);

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [showOnlyDisabledValue, setShowOnlyDisabled] = useState(false);
	const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

	const initialTab = searchParams.get("currentTab")
		? Number(searchParams.get("currentTab"))
		: 0;
	const [currentTab, setCurrentTab] = useState<number>(initialTab);

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
			}
		}

		async function fetchHistory() {
			try {
				const historyData = await getAllCellsHistory(timeToSearch);

				if (historyData === null) {
					setError("Failed to fetch cells history data.");

					return;
				}
				setHistory(historyData);

				// Calculate stats from history data
				const statsData = historyData.reduce(
					(
						acc: { [key: number]: { enabled: number; disabled: number } },
						entry
					) => {
						if (!acc[entry.cellNumber]) {
							acc[entry.cellNumber] = { enabled: 0, disabled: 0 };
						}
						if (entry.disabled) {
							acc[entry.cellNumber].disabled += 1;
						} else {
							acc[entry.cellNumber].enabled += 1;
						}

						return acc;
					},
					{}
				);
				// Convert stats object to array for easier rendering
				const statsArray = Object.entries(statsData).map(
					([cellNumber, counts]) => ({
						cellNumber: Number(cellNumber),
						...counts,
					})
				);

				// Sort stats array by total changes (enabled + disabled) in descending order
				statsArray.sort(
					(a, b) => b.disabled + b.enabled - (a.disabled + a.enabled)
				);

				setStats(statsArray);
			} catch (err) {
				setError("An error occurred while fetching cells history data." + err);
			} finally {
				setLoading(false);
			}
		}

		fetchCells(); // Initial fetch
		fetchHistory(); // Initial fetch

		const intervalId = setInterval(() => {
			//	fetchCells();
			//fetchHistory();
		}, config.refreshTime); //refresh interval

		return () => clearInterval(intervalId); // Cleanup on unmount
	}, [timeToSearch, showOnlyDisabledValue]);

	function ShowOnlyDisabled(value: boolean) {
		setShowOnlyDisabled(value);

		updateUrlParams(searchParams, router, "showOnlyDisabled", value.toString());
	}

	if (loading) {
		return <Loading />;
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
				<div className="">
					<label>
						<input
							checked={showOnlyDisabledValue}
							type="checkbox"
							onChange={() => ShowOnlyDisabled(!showOnlyDisabledValue)}
						/>{" "}
						Show only disabled cells
					</label>
					<select
						className="ml-2 rounded border bg-white p-1"
						defaultValue={timeToSearch}
						onChange={(e) => {
							setTimeToSearch(Number(e.target.value));

							setLoading(true);

							//update the search time in the url
							updateUrlParams(
								searchParams,
								router,
								"currentSearchTime",
								e.target.value
							);

							//console.log(Number(e.target.value));
						}}
					>
						<option value={0.25}>6 hours</option>
						<option value={0.5}>12 hours</option>
						<option value={1}>1 day</option>
						<option value={2}>2 days</option>
						<option value={4}>4 days</option>
						<option value={5}>5 days</option>
						<option value={6}>6 days</option>
						<option value={7}>1 week</option>
						<option value={10}>10 days</option>
						<option value={14}>2 weeks</option>
						<option value={30}>1 month</option>
						<option value={60}>2 months</option>
						<option value={90}>3 months</option>
						<option value={120}>4 months</option>
						<option value={150}>5 months</option>
						<option value={180}>6 months</option>
						<option value={270}>9 months</option>
						<option value={365}>12 months</option>
						<option value={540}>18 months</option>
						<option value={730}>24 months</option>
					</select>
				</div>
			}
		>
			<Tabs
				selectedIndex={currentTab}
				onSelect={(index) => {
					//update the current tab in the url
					setCurrentTab(index);
					updateUrlParams(searchParams, router, "currentTab", index.toString());
				}}
			>
				<TabList>
					<Tab>Overview</Tab>
					<Tab>Last Modified</Tab>
					<Tab>Stats</Tab>
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

				<TabPanel>
					<h1>
						History from{" "}
						{new Date(
							Date.now() - timeToSearch * 24 * 60 * 60 * 1000
						).toLocaleString("en-GB")}{" "}
						to {new Date().toLocaleString("en-GB")}
					</h1>
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
							{history.map((entry) => {
								return (
									<tr
										key={entry.id}
										style={{
											backgroundColor: entry.disabled ? "red" : "green",
										}}
									>
										<td>{entry.cellNumber}</td>
										<td>{entry.disabled ? "Disabled" : "Enabled"}</td>
										<td>
											{new Date(entry.dateChanged).toLocaleString("en-GB", {
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
												href={`/dashboard/sorter/cells/${entry.cellNumber}?showOnlyDisabled=${showOnlyDisabledValue}`}
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
				<TabPanel>
					<h1>
						History from{" "}
						{new Date(
							Date.now() - timeToSearch * 24 * 60 * 60 * 1000
						).toLocaleString("en-GB")}{" "}
						to {new Date().toLocaleString("en-GB")}
					</h1>
					<table className="dematicTable dematicTableStriped dematicTableHoverable">
						<thead>
							<tr>
								<th style={{ width: "25%" }}>Cell Number</th>
								<th style={{ width: "25%" }}>Times Disabled</th>
								<th style={{ width: "25%" }}>Times Enabled</th>
								<th style={{ width: "25%" }}>Total Changes</th>
							</tr>
						</thead>
						<tbody>
							{stats.map((stat) => {
								return (
									<tr key={stat.cellNumber}>
										<td>{stat.cellNumber}</td>
										<td>{stat.disabled}</td>
										<td>{stat.enabled}</td>
										<td>{stat.disabled + stat.enabled}</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</TabPanel>
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
