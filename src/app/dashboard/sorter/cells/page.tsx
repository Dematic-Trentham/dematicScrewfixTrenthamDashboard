"use client";
import { useEffect, useState } from "react";

import { getAllCells } from "./_actions/actions";

import PanelTop from "@/components/panels/panelTop";

export default function CellsPage() {
	const [cells, setCells] = useState<
		{ id: string; cellNumber: number; disabled: boolean; dateChanged: Date }[]
	>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [showOnlyDisabled, setShowOnlyDisabled] = useState(false);
	const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

	useEffect(() => {
		async function fetchCells() {
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
				setError("An error occurred while fetching cells data.");
			} finally {
				setLoading(false);
			}
		}
		fetchCells();
	}, []);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	const filteredCells = showOnlyDisabled
		? cells.filter((cell) => cell.disabled)
		: cells;

	return (
		<PanelTop
			title="Cells"
			topRight={
				<div>
					<label>
						<input
							checked={showOnlyDisabled}
							type="checkbox"
							onChange={() => setShowOnlyDisabled(!showOnlyDisabled)}
						/>
						Show only disabled cells
					</label>
				</div>
			}
		>
			<table
				style={{
					width: "100%",
					marginBottom: "10px",
					borderCollapse: "collapse",
				}}
			>
				<thead>
					<tr style={{ backgroundColor: "#fb923c" }}>
						<th style={{ border: "1px solid black" }}>Total Cells</th>
						<th style={{ border: "1px solid black" }}>Total Disabled</th>
						<th style={{ border: "1px solid black" }}>Total Enabled</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td style={{ border: "1px solid black" }}>{cells.length}</td>
						<td style={{ border: "1px solid black" }}>
							{cells.filter((cell) => cell.disabled).length}
						</td>
						<td style={{ border: "1px solid black" }}>
							{cells.filter((cell) => !cell.disabled).length}
						</td>
					</tr>
				</tbody>
			</table>
			<table style={{ width: "100%", borderCollapse: "collapse" }}>
				<thead>
					<tr style={{ backgroundColor: "#fb923c" }}>
						<th style={{ border: "1px solid black" }}>Cell Number</th>
						<th style={{ border: "1px solid black" }}>Status</th>
						<th style={{ border: "1px solid black" }}>Date Changed</th>
					</tr>
				</thead>
				<tbody>
					{filteredCells.map((cell, index) => {
						return (
							<tr
								key={cell.id}
								style={{
									backgroundColor: cell.disabled
										? "red"
										: index % 2 === 0
											? "#f9f9f9"
											: "white",
								}}
							>
								<td style={{ border: "1px solid black" }}>{cell.cellNumber}</td>
								<td style={{ border: "1px solid black" }}>
									{cell.disabled ? "Disabled" : "Enabled"}
								</td>
								<td style={{ border: "1px solid black" }}>
									{new Date(cell.dateChanged).toLocaleString("en-GB", {
										hour: "2-digit",
										minute: "2-digit",
										day: "2-digit",
										month: "2-digit",
										year: "numeric",
									})}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
			{lastUpdated && (
				<div style={{ fontSize: "0.8em" }}>
					Last updated: {lastUpdated.toLocaleString("en-GB")} - Please remember
					that this data is not real-time and will update as the sorter trace
					files are collected.
				</div>
			)}
		</PanelTop>
	);
}
