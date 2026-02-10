"use client";
import React from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { useRouter, useSearchParams } from "next/navigation";

import { getLastSorterEncoderFaults } from "./_actions";

import { updateUrlParams } from "@/utils/url/params";
import PanelTop from "@/components/panels/panelTop";
import { changeDateToReadable } from "@/utils/changeDateToReadable";
import "react-tabs/style/react-tabs.css";
import Loading from "@/components/visual/loading";

const EncoderDashboard: React.FC = () => {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [isLoading, setIsLoading] = React.useState(true);
	const [error, setError] = React.useState<null | string>(null);
	const [data, setData] = React.useState<any | null>(null);
	const [cells, setCells] = React.useState<any[]>([]);
	const [photoCells, setPhotoCells] = React.useState<any[]>([]);

	const initialTimeToSearch = searchParams.get("currentSearchTime")
		? Number(searchParams.get("currentSearchTime"))
		: 7;

	const [timeToSearch, setTimeToSearch] =
		React.useState<number>(initialTimeToSearch);

	React.useEffect(() => {
		async function fetchData() {
			const fetchedData = await getLastSorterEncoderFaults(timeToSearch * 24); // Fetch data for the last 14 days

			console.log("Fetched encoder data:", fetchedData);
			setData(fetchedData || null);

			if (fetchedData.encoderHasNotSeenCell) {
				setCells(fetchedData.encoderHasNotSeenCell);
			}
			if (fetchedData.encoderHasNotSeenPhotoCell) {
				setPhotoCells(fetchedData.encoderHasNotSeenPhotoCell);
			}
		}

		fetchData()
			.then(() => setIsLoading(false))
			.catch((err) => {
				setError(err.message);
				setIsLoading(false);
			});

		setInterval(() => {
			fetchData();
		}, 60000); // Refresh data every 60 seconds
	}, [timeToSearch]);

	if (isLoading) {
		return <Loading />;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<PanelTop
			title="Sorter Encoder Dashboard"
			topRight={
				<div className="">
					<select
						className="ml-2 rounded border bg-white p-1"
						defaultValue={timeToSearch}
						onChange={(e) => {
							setTimeToSearch(Number(e.target.value));

							setIsLoading(true);

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
			<Tabs>
				<TabList>
					<Tab>Cells Not Seen</Tab>
					<Tab>Photo Cells Not Seen</Tab>
				</TabList>
				<TabPanel>
					<table className="dematicTable ce">
						<thead>
							<tr>
								<th>Created At</th>
								<th>Cell ID</th>
								<th>Count Per Hour </th>
							</tr>
						</thead>
						<tbody>
							{cells.map((cell) => (
								<tr key={cell.id}>
									<td>{changeDateToReadable(cell.createdAt)}</td>
									<td>{cell.cell}</td>
									<td>{cell.countPerHour}</td>
								</tr>
							))}
						</tbody>
					</table>
				</TabPanel>
				<TabPanel>
					<table className="dematicTable ce">
						<thead>
							<tr>
								<th>Created At</th>
								<th>Photo Cell ID</th>
								<th>Count Per Hour </th>
							</tr>
						</thead>
						<tbody>
							{photoCells.map((cell) => (
								<tr key={cell.id}>
									<td>{changeDateToReadable(cell.createdAt)}</td>
									<td>{cell.photoCell}</td>
									<td>{cell.countPerHour}</td>
								</tr>
							))}
						</tbody>
					</table>
				</TabPanel>
			</Tabs>
		</PanelTop>
	);
};

export default EncoderDashboard;
