"use client";
import "react-tabs/style/react-tabs.css";
import { useEffect, useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { record } from "zod";

import {
	getAllLiftMissionsLastXGroupedDays,
	getAllLiftMissionsLastXGroupedHourly,
} from "../_actions";
type DetailsProps = {
	hours: number;
};

const Details = ({ hours }: DetailsProps) => {
	const [missions, setMissions] = useState<Record<
		string,
		{
			ID: number;
			timestamp: Date;
			aisle: number;
			liftNumber: number;
			totalAtTime: number;
			difference?: number;
		}[]
	> | null>(null);

	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const [breakdownByHour, setBreakdownByHour] = useState<boolean>(false);

	useEffect(() => {
		const fetchMissions = async () => {
			console.log("Fetching lift missions for the last 24 hours...");

			if (breakdownByHour) {
				const resultDataHour =
					await getAllLiftMissionsLastXGroupedHourly(hours);

				setMissions(resultDataHour);
			} else {
				const resultData = await getAllLiftMissionsLastXGroupedDays(hours);

				setMissions(resultData);
			}

			setLoading(false);

			//console.log(resultData);
		};

		fetchMissions();
	}, [breakdownByHour || hours]);

	if (loading) {
		return <div>Loading lift missions...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div>
			<div className="mb-2 flex justify-end">
				<label className="flex items-center gap-2">
					<input
						checked={breakdownByHour}
						type="checkbox"
						onChange={() => {
							setBreakdownByHour(!breakdownByHour);
						}}
					/>
					<span>Break down by hour</span>
				</label>
			</div>
			<Tabs>
				<TabList>
					{missions &&
						Object.keys(missions).map((aisle) => (
							<Tab key={aisle + "tab"}>
								<button key={aisle}>{`Aisle ${aisle}`}</button>
							</Tab>
						))}
				</TabList>
				{missions &&
					Object.entries(missions).map(([aisle, records]) => (
						<TabPanel key={aisle + "panel"}>
							<div key={aisle} className="p-4">
								{records.reduce<{ [liftNumber: number]: typeof records }>(
									(acc, record) => {
										if (!acc[record.liftNumber]) acc[record.liftNumber] = [];
										acc[record.liftNumber].push(record);

										return acc;
									},
									{}
								) &&
									Object.entries(
										records.reduce<{ [liftNumber: number]: typeof records }>(
											(acc, record) => {
												if (!acc[record.liftNumber])
													acc[record.liftNumber] = [];
												acc[record.liftNumber].push(record);

												return acc;
											},
											{}
										)
									).map(([liftNumber, liftRecords]) => (
										<div key={liftNumber} className="mb-6">
											<table className="dematicTable dematicTableHoverable border-1 border-black">
												<thead>
													<tr className="bg-gray-100">
														<th className="px-2 py-1">Timestamp</th>

														<th className="px-2 py-1">Total At Time</th>
														<th className="px-2 py-1">Difference</th>
													</tr>
												</thead>
												<tbody>
													{liftRecords.map((record) => (
														<tr key={record.ID}>
															<td className="px-2 py-1">
																{breakdownByHour
																	? new Date(record.timestamp).toLocaleString()
																	: new Date(
																			record.timestamp
																		).toLocaleDateString()}
															</td>

															<td className="px-2 py-1">
																{record.totalAtTime}
															</td>
															<td className="px-2 py-1">{record.difference}</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>
									))}
							</div>
						</TabPanel>
					))}
			</Tabs>
		</div>
	);
};

export default Details;
