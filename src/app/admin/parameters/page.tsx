"use client";
import React from "react";

import {
	getAllParameters,
	typeParameters,
	updateMultipleParameters,
} from "./_actions/index";

import PanelTop from "@/components/panels/panelTop";
import { hasPermission } from "@/utils/getUser";

const UnderConstruction: React.FC = () => {
	const [isAdmin, setIsAdmin] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(true);
	const [error, setError] = React.useState<null | string>(null);
	const [data, setData] = React.useState<typeParameters>({});
	const [isDirty, setIsDirty] = React.useState(false);

	async function handleCancel() {
		try {
			const fetchedData = await getAllParameters();

			if (!fetchedData.error) {
				setData(fetchedData as typeParameters);
			}
		} catch (err: any) {
			setError(err?.message ?? String(err));
		}
		setIsDirty(false);
	}

	function handleSave() {
		const saveData: Record<string, string> = {};

		//loop paramters , which textareas have been changed and add them to saveData
		(async () => {
			try {
				const latest = (await getAllParameters()) as typeParameters;

				for (const [key, value] of Object.entries(data)) {
					const orig = latest?.[key] as [string, string | null] | undefined;
					const origVal = orig ? orig[0] : undefined;
					const newVal = (value as [string, string | null])?.[0];

					if (newVal !== origVal) {
						saveData[key] = String(newVal ?? "");
					}
				}

				if (Object.keys(saveData).length === 0) {
					console.log("No changes to save");

					return;
				}

				console.log("Saving parameters:", saveData);
				await updateMultipleParameters(saveData);

				console.log("Parameters updated successfully");
			} catch (err: any) {
				setError(err?.message ?? String(err));
			}
		})();

		//updateMultipleParameters(saveData);

		setIsDirty(false);
	}

	React.useEffect(() => {
		async function fetchData() {
			const isAdmin = await hasPermission("admin");

			setIsAdmin(isAdmin);

			const fetchedData = await getAllParameters();

			if (fetchedData.error) {
				// fetchedData.error can be a string or a tuple [string, Date | null]
				const err = fetchedData.error;
				const errMsg = Array.isArray(err) ? err[0] : err;

				setError(errMsg);

				return;
			}
			console.log("Fetched parameters data:", fetchedData);
			setData(fetchedData as typeParameters);

			setIsLoading(false);
			setIsDirty(false);
			setError(null);
		}
		fetchData().catch((err) => {
			setError(err.message);
			setIsLoading(false);
		});
	}, []);

	if (isLoading) {
		return (
			<PanelTop title="Parameters">
				<p>Loading...</p>
			</PanelTop>
		);
	}

	if (!isAdmin) {
		//console.log(hasPermission("admin"));

		return <p>You dont have permission</p>;
	}

	if (error) {
		return (
			<PanelTop title="Parameters">
				<p>Error: {error}</p>
			</PanelTop>
		);
	}

	return (
		<PanelTop className="w-full" title="Parameters">
			<div>
				{isDirty && (
					<div className="mb-4 flex gap-2">
						<button
							className="mb-4 rounded bg-green-400 p-2 text-white"
							onClick={handleSave}
						>
							Save
						</button>
						<button
							className="mb-4 rounded bg-red-400 p-2 text-white"
							onClick={handleCancel}
						>
							Discard
						</button>
					</div>
				)}
				{Object.keys(data).length === 0 ? (
					<p>No parameters found.</p>
				) : (
					<div className="overflow-auto">
						<table className="dematicTable ce">
							<thead>
								<tr style={{ borderBottom: "1px solid #e6e6e6" }}>
									<th style={{ padding: 8, textAlign: "center" }}>Parameter</th>
									<th style={{ padding: 8, textAlign: "center" }}>Value</th>
									<th style={{ padding: 8, textAlign: "center" }}>
										Last Modified
									</th>
								</tr>
							</thead>
							<tbody>
								{Object.entries(data).map(([key, value]) => (
									<tr key={key} style={{ borderBottom: "1px solid #eee" }}>
										<td
											style={{
												padding: 8,
												verticalAlign: "top",
												fontWeight: 600,
											}}
										>
											{key}
										</td>
										<td style={{ padding: 8, whiteSpace: "pre-wrap" }}>
											<textarea
												className="w-full border-1 border-black bg-white"
												style={{ resize: "vertical", minHeight: 40 }}
												value={String(value[0] ?? "")}
												onChange={(e) => {
													const newVal = e.target.value;

													setData((prev) => {
														const prevEntry = prev[key] as
															| [string, string | null]
															| undefined;
														const lastMod = prevEntry
															? prevEntry[1]
															: Array.isArray(value)
																? value[1]
																: null;

														return {
															...prev,
															[key]: [newVal, lastMod],
														} as typeParameters;
													});
													setIsDirty(true);
												}}
											/>
										</td>
										<td style={{ padding: 8, textAlign: "center" }}>
											{value[1] ? new Date(value[1]).toLocaleString() : "Never"}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</PanelTop>
	);
};

export default UnderConstruction;
