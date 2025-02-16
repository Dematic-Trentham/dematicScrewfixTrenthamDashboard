"use client";

import "react-tabs/style/react-tabs.css";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useParams } from "next/navigation";

import { getAllCells } from "../_actions/actions";

import { getCellHistory } from "./_actions/actions";

import PanelTop from "@/components/panels/panelTop";
import { changeDateToReadable } from "@/utils/changeDateToReadable";

export default function ShuttlePage() {
	const params = useParams<{ cell: string }>();
	const router = useRouter();
	const searchParams = useSearchParams();

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [cellHistory, setCellHistory] = useState<any[]>([]);
	const [showOnlyDisabled, setShowOnlyDisabled] = useState(false);
	const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

	useEffect(() => {
		async function runHistory() {
			//get show only disabled from the url
			const showOnlyDisabled = searchParams.get("showOnlyDisabled");

			if (showOnlyDisabled) {
				setShowOnlyDisabled(true);
			}

			//get the cell history
			const cellHistory = await getCellHistory(params.cell);
			const cellsData = await getAllCells();
			//date changed on cell 0
			const dateChanged = new Date(cellsData[0].dateChanged);

			setLastUpdated(dateChanged);

			if (cellHistory.errorString) {
				setError(cellHistory.errorString);
				setLoading(false);

				return;
			}

			setCellHistory(cellHistory.data);
			setLoading(false);
		}

		runHistory();
	}, []);

	//add space between the mac address ever 2 characters
	const cell = params.cell;

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return (
			<PanelTop
				className="h-fit w-full"
				title="Cell History"
				topRight={
					<div>
						<button
							className="btn btn-primary"
							onClick={() => {
								router.push(
									"/dashboard/sorter/cells?showOnlyDisabled=" + showOnlyDisabled
								);
							}}
						>
							Back
						</button>
					</div>
				}
			>
				{error}
			</PanelTop>
		);
	}

	return (
		<PanelTop
			className="h-fit w-full"
			title={`Cell ${cell} History`}
			topRight={
				<div>
					<button
						className="btn btn-primary"
						onClick={() => {
							router.push(
								"/dashboard/sorter/cells?showOnlyDisabled=" + showOnlyDisabled
							);
						}}
					>
						Back
					</button>
				</div>
			}
		>
			<div className="pt-4 text-xl">
				Cell is currently {cellHistory[0].disabled ? "disabled" : "enabled"}
			</div>
			<br />

			<table className="table-striped dematicTable dematicTableHoverable table">
				<thead>
					<tr>
						<th>Date</th>
						<th>Status</th>
					</tr>
				</thead>
				<tbody>
					{cellHistory.map((history) => (
						<tr key={history.id}>
							<td>{changeDateToReadable(history.date)}</td>
							<td>
								<div className="inline-flex">
									{history.disabled ? `Disabled` : "Re-Enabled"}
									<pre>{history.disabled ? `   🔴` : " 🟢"}</pre>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
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
