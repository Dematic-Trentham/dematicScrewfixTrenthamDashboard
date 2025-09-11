"use client";
import { useEffect, useState } from "react";

import { getAllLiftMissionsLast24Hours } from "../_actions";

const Overview = () => {
	const [missions, setMissions] = useState<Record<
		string,
		Record<string, number>
	> | null>(null);

	useEffect(() => {
		const fetchMissions = async () => {
			const data = await getAllLiftMissionsLast24Hours();

			//split into aisle and lift number
			const splitData = Object.entries(data).reduce(
				(acc, [key, value]) => {
					const [aisle, liftNumber] = key.split("-");

					if (!acc[aisle]) {
						acc[aisle] = {};
					}
					acc[aisle][liftNumber] = value;

					return acc;
				},
				{} as Record<string, Record<string, number>>
			);

			setMissions(splitData);
		};

		fetchMissions();
	}, []);

	return (
		<div>
			<h2>Lift Missions Overview Last 24 Hours</h2>
			{/* Render your missions here */}
			{missions && (
				<table className="dematicTable ce dematicTableHoverable">
					<thead>
						<tr>
							<th>Aisle</th>
							{Array.from(
								new Set(
									Object.values(missions).flatMap((lifts) => Object.keys(lifts))
								)
							)
								.sort()
								.map((liftNumber) => (
									<th key={liftNumber}>Lift - {liftNumber}</th>
								))}
							<th>Total</th>
						</tr>
					</thead>
					<tbody>
						{Object.keys(missions).map((aisle) => (
							<tr key={aisle}>
								<td>{aisle}</td>
								{Array.from(
									new Set(
										Object.values(missions).flatMap((lifts) =>
											Object.keys(lifts)
										)
									)
								)
									.sort()
									.map((liftNumber) => (
										<td key={liftNumber}>{missions[aisle][liftNumber] ?? 0}</td>
									))}
								<td>
									{Object.values(missions[aisle]).reduce((a, b) => a + b, 0)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
};

export default Overview;
