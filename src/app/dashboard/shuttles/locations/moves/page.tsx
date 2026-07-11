"use client";
import { useEffect, useState } from "react";

import { getAllShuttleMoves } from "./_actions";
import { ShuttleMove } from "./_actions";

import PanelTop from "@/components/panels/panelTop";
import { getTeamColourFromDateToTW } from "@/utils/getTeamColour";

export default function MovesPage() {
	const [moves, setMoves] = useState<ShuttleMove[]>([]);

	useEffect(() => {
		async function fetchMoves() {
			const movesData = await getAllShuttleMoves();

			setMoves(movesData);
		}
		fetchMoves();
	}, []);

	return (
		<PanelTop className="w-full" title={"Shuttle Swaps "}>
			<div>
				<table className="w-full">
					<thead className="border border-black bg-orange-400">
						<tr>
							<th style={{ width: "150px" }}>Timestamp</th>
							<th style={{ width: "150px" }}>Aisle</th>
							<th style={{ width: "100px" }}>Level</th>
							<th style={{ width: "100px" }}>Old Shuttle ID</th>
							<th style={{ width: "100px" }}>New Shuttle ID</th>
						</tr>
					</thead>

					<tbody>
						{moves.length === 0 ? (
							<tr>
								<td className="text-center" colSpan={6}>
									No moves found for the selected location and date range.
								</td>
							</tr>
						) : (
							moves.map((move) => {
								return makeMoveRow(move);
							})
						)}
					</tbody>
				</table>
			</div>
		</PanelTop>
	);
}

function makeMoveRow(move: ShuttleMove) {
	return (
		<tr
			key={move.ID}
			className="border border-black text-center hover:bg-yellow-400"
		>
			<td className={getTeamColourFromDateToTW(move.timestamp)}>
				{" "}
				{new Date(move.timestamp).toLocaleString()}
			</td>
			<td>{move.aisle}</td>
			<td>{move.level}</td>
			<td>{move.oldShuttleID}</td>
			<td>{move.newShuttleID}</td>
		</tr>
	);
}
