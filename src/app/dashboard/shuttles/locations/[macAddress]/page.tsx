"use client";

import "react-tabs/style/react-tabs.css";
import { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useRouter, useSearchParams } from "next/navigation";

import { getShuttleFromMac } from "./parts/_actions";
import ShuttlePageSettings from "./parts/shuttlePageSettings";
import ShuttlePageFaultsFromThisShuttle from "./parts/shuttlePageFaultsFromThisShuttle";
import ShuttlePageFaultsFromThisLocation from "./parts/shuttlePageFaultsFromThisLocation";
import ShuttlePageFaultsFromThisLocationGrouped from "./parts/shuttlePageFaultsFromThisLocationGroup";
import ShuttlePageFaultsFromThisShuttleGrouped from "./parts/shuttlePageFaultsFromThisShuttleGrouped";

import PanelTop from "@/components/panels/panelTop";

export default function ShuttlePage({
	params,
}: {
	params: { macAddress: string };
}) {
	const router = useRouter();
	const searchParams = useSearchParams();

	//add space between the mac address ever 2 characters
	const macAddress = addSpace(params.macAddress);

	const [shuttleID, setShuttleID] = useState<string | null>(null);
	const [currentLocation, setCurrentLocation] =
		useState<string>("Maintenance Bay");
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const initialTimeToSearch = searchParams.get("currentSearchTime")
		? Number(searchParams.get("currentSearchTime"))
		: 7;

	const initialTab = searchParams.get("currentTab")
		? Number(searchParams.get("currentTab"))
		: 0;

	const [timeToSearch, setTimeToSearch] = useState<number>(initialTimeToSearch);
	const [currentTab, setCurrentTab] = useState<number>(initialTab);

	useEffect(() => {
		const params = new URLSearchParams(searchParams.toString());

		params.set("currentSearchTime", timeToSearch.toString());
		params.set("currentTab", currentTab.toString());
		window.history.pushState(null, "", `?${params.toString()}`);
	}, [timeToSearch, currentTab]);

	useEffect(() => {
		const fetchShuttle = async () => {
			const shuttle = await getShuttleFromMac(macAddress);

			if (!shuttle) {
				setIsLoading(false);
				setError("Failed to fetch shuttle details");

				return;
			}

			setCurrentLocation(shuttle.currentLocation || "Maintenance Bay");
			setShuttleID(shuttle.shuttleID || "Unknown");
			setIsLoading(false);
			setError(null);
		};

		fetchShuttle();
	}, []);

	if (isLoading) {
		return (
			<div>
				<PanelTop
					className="w-full"
					title={"Shuttle Details "}
					topRight={<button onClick={() => router.back()}>Back</button>}
				>
					<div className="justify-left flex flex-col">
						<div className="text-xl">Mac Address: {macAddress}</div>
					</div>
					<div>is loading....</div>
				</PanelTop>
			</div>
		);
	}

	if (error) {
		return (
			<div>
				<PanelTop
					className="w-full"
					title={"Shuttle Details "}
					topRight={<button onClick={() => router.back()}>Back</button>}
				>
					<div className="justify-left flex flex-col">
						<div className="text-xl">Mac Address: {macAddress}</div>
					</div>
					<div>{error}</div>
				</PanelTop>
			</div>
		);
	}

	return (
		<div>
			<PanelTop
				className="w-full"
				title={"Shuttle Details - " + shuttleID}
				topRight={
					<div className="space-x-2">
						<select
							className="ml-2 rounded border p-1 text-white"
							defaultValue={timeToSearch}
							onChange={(e) => {
								setTimeToSearch(Number(e.target.value));
								//console.log(Number(e.target.value));

								//update the search time in the url
							}}
						>
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
						<button onClick={() => router.back()}>Back</button>
					</div>
				}
			>
				<div className="justify-left flex flex-col">
					<div className="text-xl">Mac Address: {macAddress}</div>
					<div className="text-xl">Shuttle ID: {shuttleID}</div>
					<div className="text-xl">Current Location: {currentLocation}</div>
				</div>
				<div className="h-2" />
				<Tabs
					selectedIndex={currentTab}
					onSelect={(index) => {
						console.log(`Selected tab: ${index}`);

						//update the current tab in the url
						setCurrentTab(index);
					}}
				>
					<TabList>
						<Tab>Faults Grouped From This Shuttle</Tab>
						{currentLocation !== "Maintenance Bay" && (
							<Tab>Faults Grouped From This Location</Tab>
						)}
						<Tab>Faults From This Shuttle</Tab>
						{currentLocation !== "Maintenance Bay" && (
							<Tab>Faults From This Location</Tab>
						)}

						<Tab>Settings</Tab>
					</TabList>

					<TabPanel>
						<ShuttlePageFaultsFromThisShuttleGrouped
							daysToSearch={timeToSearch}
							macAddress={macAddress}
						/>
					</TabPanel>

					{currentLocation !== "Maintenance Bay" && (
						<TabPanel>
							<ShuttlePageFaultsFromThisLocationGrouped
								daysToSearch={timeToSearch}
								location={currentLocation}
							/>
						</TabPanel>
					)}

					<TabPanel>
						<ShuttlePageFaultsFromThisShuttle
							daysToSearch={timeToSearch}
							macAddress={macAddress}
						/>
					</TabPanel>
					{currentLocation !== "Maintenance Bay" && (
						<TabPanel>
							<ShuttlePageFaultsFromThisLocation
								daysToSearch={timeToSearch}
								location={currentLocation}
							/>
						</TabPanel>
					)}

					<TabPanel>
						<ShuttlePageSettings macAddress={macAddress} />
					</TabPanel>
				</Tabs>
			</PanelTop>
		</div>
	);
}

//function to add space between mac address
function addSpace(macAddress: string) {
	//@ts-ignore
	return macAddress.match(/.{1,2}/g).join(" ");
}
