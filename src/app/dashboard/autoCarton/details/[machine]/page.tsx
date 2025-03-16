"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import { getAutoCartonFaults } from "./_actions/actions";

import Loading from "@/components/visual/loading";
import PanelTop from "@/components/panels/panelTop";
import "react-tabs/style/react-tabs.css";
import { changeDateToReadable } from "@/utils/changeDateToReadable";

const MachineDetailsPage = () => {
	const params = useParams<{ machine: string }>();

	const [title, setTitle] = useState<string>(params.machine);

	const [data, setData] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		//set title will come in as "erector5" and we want to display "Erector 5
		setTitle(
			params.machine.charAt(0).toUpperCase() +
				params.machine.slice(1).replace(/([0-9]+)/g, " $1")
		);

		//get data from server
		async function fetchData() {
			const data = await getAutoCartonFaults(60, "erector", 1);

			if ("error" in data) {
				setError(data.error);
			} else {
				setData(data);

				console.log(data);
			}

			setLoading(false);
		}

		fetchData();
	}, []);

	if (loading) {
		return <Loading />;
	}

	if (error) {
		return <PanelTop title={title}>{error}</PanelTop>;
	}

	return (
		<PanelTop className="h-fit w-full" title={title}>
			{tabFormattedData(data)}
		</PanelTop>
	);

	function tabFormattedData(data: any) {
		return (
			<table className="dematicTable ce">
				<thead>
					<tr>
						<th>Time</th>

						<th>Fault Code</th>
					</tr>
				</thead>

				<tbody>
					{data.map((item: any, index: number) => (
						<tr key={index}>
							<td>{changeDateToReadable(item.timestamp)}</td>

							<td>{item.faultCode}</td>
						</tr>
					))}
				</tbody>
			</table>
		);
	}
};

export default MachineDetailsPage;
