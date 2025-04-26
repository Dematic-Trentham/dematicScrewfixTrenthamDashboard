"use client";
import React, { useEffect } from "react";
import Link from "next/link";

import { getStatus } from "./_actions/actions";

import Loading from "@/components/visual/loading";
import PanelMiddle from "@/components/panels/panelMiddle";
import PanelTop from "@/components/panels/panelTop";
import { changeDateToReadable } from "@/utils/changeDateToReadable";

const PingPage = () => {
	const [loading, setLoading] = React.useState(true);
	const [status, setStatus] = React.useState<
		{
			id: string;
			ipAddress: string;
			machineName: string;
			plc: boolean;
			plcSlot: number;
			pingStatus: boolean;
			pingTimeMS: number;
			plcStatus: boolean;
			lastUpdated: Date;
		}[]
	>([]);
	const [error, setError] = React.useState<string | null>(null);

	useEffect(() => {
		const interval = setInterval(async () => {
			const status = await getStatus();

			if (status.error) {
				setError(status.error);
				setLoading(false);

				return;
			}
			if (status.data.length === 0) {
				setError("No IPs to check");
				setLoading(false);

				return;
			}

			setStatus(status.data);
			setLoading(false);
		}, 5000);

		return () => clearInterval(interval);
	}, []);

	if (loading) {
		return <Loading />;
	}

	if (error) {
		return (
			<PanelTop
				className="w-full"
				title="Site Pinger"
				topRight={<Link href="/dashboard/ping/add">Add IP</Link>}
			>
				<div>Error: {error}</div>
			</PanelTop>
		);
	}

	return (
		<PanelTop
			className="w-full"
			title="Site Pinger"
			topRight={<Link href="/dashboard/ping/add">Add IP</Link>}
		>
			<table className="dematicTable ce dematicTableHoverable">
				<thead>
					<tr>
						<th>Machine Name</th>
						<th>IP Address</th>
						<th>Ping Status</th>
						<th>PLC Status</th>
						<th>Ping Time (ms)</th>
						<th>Last Updated</th>
						<th>Details</th>
					</tr>
				</thead>
				<tbody>
					{status.map((item, index: number) => (
						<tr key={index}>
							<td>{item.machineName}</td>
							<td>{item.ipAddress}</td>
							<td
								style={{
									background: item.pingStatus ? "lightgreen" : "red",
								}}
							>
								{item.pingStatus ? "Online" : "Offline"}
							</td>
							<td
								style={{
									background: item.plc
										? item.plcStatus
											? "lightgreen"
											: "red"
										: "inherit",
								}}
							>
								{item.plc ? (item.plcStatus ? "Online" : "Offline") : ""}
							</td>
							<td>{item.pingTimeMS} ms</td>
							<td>{changeDateToReadable(item.lastUpdated)}</td>

							<td>
								<Link href={`/dashboard/ping/${item.id}`}>View Details</Link>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</PanelTop>
	);
};

export default PingPage;
