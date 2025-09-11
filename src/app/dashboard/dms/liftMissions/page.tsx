"use client";
import React, { useState } from "react";

import "react-tabs/style/react-tabs.css";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { useRouter, useSearchParams } from "next/navigation";

import Overview from "./_components/overview";
import Details from "./_components/Details";
import DetailsGraph from "./_components/DetailGraph";

import PanelTop from "@/components/panels/panelTop";
import { updateUrlParams } from "@/utils/url/params";

const LiftMissions: React.FC = () => {
	const searchParams = useSearchParams();

	const initialTimeToSearch = searchParams.get("currentSearchTime")
		? Number(searchParams.get("currentSearchTime"))
		: 7;

	const router = useRouter();
	const [timeToSearch, setTimeToSearch] = useState<number>(initialTimeToSearch);

	return (
		<PanelTop
			className="w-full"
			title="Lift Missions"
			topRight={
				<div className="space-x-2">
					<select
						className="ml-2 rounded border p-1 text-white"
						defaultValue={timeToSearch}
						onChange={(e) => {
							setTimeToSearch(Number(e.target.value));
							//console.log(Number(e.target.value));

							//update the search time in the url
							updateUrlParams(
								searchParams,
								router,
								"currentSearchTime",
								e.target.value
							);
						}}
					>
						<option value={0.25}>6 hours</option>
						<option value={0.5}>12 hours</option>
						<option value={1}>1 day</option>
						<option value={2}>2 days</option>
						<option value={4}>4 days</option>
						<option value={7}>1 week</option>
						<option value={10}>10 days</option>
						<option value={14}>2 weeks</option>
						<option value={30}>1 month</option>
						<option value={60}>2 months</option>
						<option value={90}>3 months</option>
						<option value={120}>4 months</option>
						<option value={150}>5 months</option>
						<option value={180}>6 months</option>
					</select>
				</div>
			}
		>
			<Tabs>
				<TabList>
					<Tab>Overview</Tab>
					<Tab>Details Table</Tab>
					<Tab>Details Graph</Tab>
				</TabList>
				<TabPanel>
					<Overview />
				</TabPanel>
				<TabPanel>
					<Details hours={timeToSearch * 24} />
				</TabPanel>
				<TabPanel>
					<DetailsGraph hours={timeToSearch * 24} />
				</TabPanel>
			</Tabs>
		</PanelTop>
	);
};

export default LiftMissions;
