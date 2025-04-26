"use client";

import React from "react";
import Link from "next/link";

import {
	deleteIp,
	getHistoryByIP,
	getStatusById,
	updateIp,
} from "../_actions/actions";

import { HistoryChart } from "./_components/chart";

import PanelTop from "@/components/panels/panelTop";
import { changeDateToReadable } from "@/utils/changeDateToReadable";
import EditPage from "@/app/faults/edit/page";
interface PingPageProps {
	params: {
		id: string;
	};
}

const PingPage: React.FC<PingPageProps> = ({ params }) => {
	const modeEnum = {
		normal: "normal",
		EditPage: "EditPage",
		deletePage: "deletePage",
	};

	const [mode, setMode] = React.useState(modeEnum.normal);

	const [isPLC, setIsPLC] = React.useState(false);

	const [loading, setLoading] = React.useState(true);
	const [status, setStatus] = React.useState<{
		id: string;
		ipAddress: string;
		machineName: string;
		plc: boolean;
		plcSlot: number;
		pingStatus: boolean;
		pingTimeMS: number;
		plcStatus: boolean;
		lastUpdated: Date | null;
	}>({
		id: "",
		ipAddress: "",
		machineName: "",
		plc: false,
		plcSlot: 0,
		pingStatus: false,
		pingTimeMS: 0,
		plcStatus: false,
		lastUpdated: null,
	});
	const [error, setError] = React.useState<string | null>(null);
	const [statusHistory, setStatusHistory] = React.useState<
		{
			pingStatus: boolean;
			pingTimeMS: number;
			plcStatus: boolean;
			createdAt: Date;
		}[]
	>([]);

	React.useEffect(() => {
		const fetchData = async () => {
			const { id } = await Promise.resolve(params);
			const mainStatus = await getStatusById(id);

			if (mainStatus.error) {
				setError(mainStatus.error);
				setLoading(false);

				return;
			}
			if (mainStatus.data === null) {
				setError("No IPs to check");
				setLoading(false);

				return;
			}

			setStatus({
				id: mainStatus.data.id,
				ipAddress: mainStatus.data.ipAddress,
				machineName: mainStatus.data.machineName ?? "Unknown",
				plc: mainStatus.data.plc ?? false,
				plcSlot: mainStatus.data.plcSlot ?? 0,
				pingStatus: mainStatus.data.pingStatus ?? false,
				pingTimeMS: mainStatus.data.pingTimeMS ?? 0,
				plcStatus: mainStatus.data.plcStatus ?? false,
				lastUpdated: mainStatus.data.lastUpdated ?? null,
			});

			setIsPLC(status.plc);

			const historyData = await getHistoryByIP(mainStatus.data.ipAddress, 1000);

			if (historyData.error) {
				setError(historyData.error);
				setLoading(false);

				return;
			}

			if (historyData.data === null) {
				setError("No history data available");
				setLoading(false);

				return;
			}

			setStatusHistory(
				historyData.data.map((item) => ({
					pingStatus: item.pingStatus ?? false,
					pingTimeMS: item.pingTimeMS ?? 0,
					plcStatus: item.plcStatus ?? false,
					createdAt: item.createdAt ?? new Date(),
				}))
			);

			setLoading(false);
		};

		fetchData();

		setInterval(fetchData, 5000);
	}, []);

	const handleEdit = () => {
		setMode(modeEnum.EditPage);

		// Add your edit logic here
	};

	const handleDelete = () => {
		setMode(modeEnum.deletePage);
	};

	if (loading) {
		return <div>Loading...</div>;
	}
	if (error) {
		return <div>Error: {error}</div>;
	}

	//return <EditPage id={status.id} setMode={setMode} />;
	if (mode === modeEnum.EditPage) {
		return (
			<PanelTop
				className="w-full"
				title="Add New IP"
				topRight={<Link href="/dashboard/ping">Back</Link>}
			>
				<h1 className="mb-4 text-2xl font-bold">Add New IP</h1>
				{error && <p className="text-red-500">{error}</p>}

				<form className="flex flex-col" onSubmit={handleSubmit}>
					<input
						className="mb-4 rounded border border-gray-300 bg-gray-800 p-2 text-white"
						defaultValue={status.ipAddress}
						name="ipAddress"
						type="text"
					/>
					<input
						className="mb-4 rounded border border-gray-300 bg-gray-800 p-2 text-white"
						defaultValue={status.machineName}
						name="machineName"
						type="text"
					/>
					<div className="mb-4 flex w-full space-x-4">
						<label className="mb-4 flex items-center">
							<input
								checked={isPLC}
								className="mr-2"
								name="isPLC"
								type="checkbox"
								onChange={(e) => setIsPLC(e.target.checked)}
							/>
							PLC?
						</label>
						<input
							className="mb-4 rounded border border-gray-300 bg-gray-800 p-2 text-white"
							defaultValue={status.plcSlot.toString()}
							disabled={!isPLC}
							name="plcSlot"
							type="number"
						/>
					</div>
					<button
						className="mb-4 rounded bg-blue-500 p-2 text-white"
						type="submit"
					>
						Update
					</button>
				</form>
			</PanelTop>
		);
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const ipAddress = formData.get("ipAddress") as string;
		const machineName = formData.get("machineName") as string;
		const plcSlot = formData.get("plcSlot") as string;

		if (!ipAddress || !machineName) {
			setError("Please fill in all fields");

			return;
		}

		if (isNaN(Number(plcSlot))) {
			setError("PLC Slot must be a number");

			return;
		}

		await updateIp(
			status.id,
			ipAddress,
			machineName,
			isPLC,
			plcSlot ? Number(plcSlot) : 0
		);

		setMode(modeEnum.normal);
	}

	if (mode === modeEnum.deletePage) {
		return (
			<PanelTop
				className="w-full"
				title="Delete IP Address"
				topRight={<Link href="/dashboard/ping">Back</Link>}
			>
				<div className="flex flex-col gap-2">
					<p>Are you sure you want to delete this IP address?</p>
					<p>IP Address: {status.ipAddress}</p>
					<p>Machine Name: {status.machineName}</p>
					<div className="flex gap-2">
						<button
							className="rounded bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
							onClick={() => deleteId(status.id)}
						>
							Delete
						</button>
						<button
							className="rounded bg-gray-300 px-4 py-2 text-black transition hover:bg-gray-400"
							onClick={() => setMode(modeEnum.normal)}
						>
							Cancel
						</button>
					</div>
				</div>
			</PanelTop>
		);
	}

	async function deleteId(id: string) {
		await deleteIp(id);

		setMode(modeEnum.normal);
	}

	if (mode === modeEnum.normal) {
		return (
			<PanelTop
				className="w-full"
				title="Ping History for IP"
				topRight={<Link href="/dashboard/ping">Back</Link>}
			>
				<div className="flex flex-col gap-2">
					<table className="dematicTable ce">
						<thead>
							<tr>
								<th>IP Address</th>
								<th>Machine Name</th>
								<th>PLC</th>
								{status.plc && <th>PLC Slot</th>}
								<th>Ping Status</th>
								<th>Ping Time (ms)</th>
								{status.plc && <th>PLC Status</th>}
								<th>Last Updated</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							<tr key={status.id}>
								<td>{status.ipAddress}</td>
								<td>{status.machineName}</td>
								<td>{status.plc ? "Yes" : "No"}</td>
								{status.plc && <td>{status.plcSlot}</td>}
								<td
									style={{
										background: status.pingStatus ? "lightgreen" : "red",
									}}
								>
									{status.pingStatus ? "Online" : "Offline"}
								</td>
								<td>{status.pingTimeMS} ms</td>
								{status.plc && (
									<td
										style={{
											background: status.plcStatus ? "lightgreen" : "red",
										}}
									>
										{status.plcStatus ? "Online" : "Offline"}
									</td>
								)}
								<td>
									{status.lastUpdated
										? changeDateToReadable(status.lastUpdated)
										: "N/A"}
								</td>
								<td>
									<button className="mr-2" onClick={handleEdit}>
										Edit
									</button>
									<button className="text-red-500" onClick={handleDelete}>
										Delete
									</button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<div className="mt-4">
					<h2 className="text-lg font-bold">Ping Time History</h2>
					<div className="w-full">
						{statusHistory.length > 0 ? (
							<HistoryChart history={statusHistory} plc={status.plc} />
						) : (
							<p>No history data available.</p>
						)}
					</div>
				</div>
			</PanelTop>
		);
	}
};

export default PingPage;
