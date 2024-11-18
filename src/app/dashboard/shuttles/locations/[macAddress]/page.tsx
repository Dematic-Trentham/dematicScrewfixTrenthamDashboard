"use client";

import "react-tabs/style/react-tabs.css";
import { useEffect, useState, use } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useRouter, useSearchParams } from "next/navigation";

import { getShuttleFromMac } from "./parts/_actions";
import ShuttlePageSettings from "./parts/shuttlePageSettings";
import ShuttlePageFaultsFromThisShuttle from "./parts/shuttlePageFaultsFromThisShuttle";
import ShuttlePageFaultsFromThisLocation from "./parts/shuttlePageFaultsFromThisLocation";
import ShuttlePageFaultsFromThisLocationGrouped from "./parts/shuttlePageFaultsFromThisLocationGroup";
import ShuttlePageFaultsFromThisShuttleGrouped from "./parts/shuttlePageFaultsFromThisShuttleGrouped";
import ShuttlePageCounts from "./parts/shuttlePageCounts";

import PanelTop from "@/components/panels/panelTop";
import { updateUrlParams } from "@/utils/url/params";

export default function ShuttlePage(props: {
	params: Promise<{ macAddress: string }>;
}) {
	const params = use(props.params);
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

	const [humanReadableLoaction, setHumanReadableLocation] =
		useState<string>("");

	// const [allCounts, setAllCounts] = useState<
	// 	{
	// 		ID: string;
	// 		timeStamp: Date;
	// 		timeRange: string;
	// 		aisle: number;
	// 		level: number;
	// 		shuttleID: string;
	// 		totalPicks: number;
	// 		totalDrops: number;
	// 		totalIATs: number;
	// 	}[]
	//>([]);

	useEffect(() => {
		const fetchShuttle = async () => {
			const shuttle = await getShuttleFromMac(macAddress);

			if (!shuttle) {
				setIsLoading(false);
				setError("Failed to fetch shuttle details");

				return;
			}

			setCurrentLocation(shuttle.currentLocation || "Maintenance Bay");

			//set the human readable location
			if (shuttle.currentLocation === "Maintenance Bay") {
				setHumanReadableLocation("Maintenance Bay");
			} else {
				const aisle = shuttle.currentLocation.substring(4, 6); //get the aisle number
				const level = shuttle.currentLocation.substring(8, 10); //get the level number

				setHumanReadableLocation(`Aisle ${aisle}, Level ${level}`);
			}

			setShuttleID(shuttle.shuttleID || "Unknown");
			setIsLoading(false);
			setError(null);
		};

		fetchShuttle();
	}, []);

	function returnToPreviousPage() {
		//go back to the previous page if the back button is clicked - add the search params

		// /dashboard/shuttles/locations?currentSearchTime=7&currentTab=0
		router.replace(
			"/dashboard/shuttles/locations?currentSearchTime=" + timeToSearch
		);
	}

	if (isLoading) {
		return (
			<div>
				<PanelTop
					className="w-full"
					title={"Shuttle Details "}
					topRight={
						<button onClick={() => returnToPreviousPage()}>Back</button>
					}
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
					topRight={
						<button onClick={() => returnToPreviousPage()}>Back</button>
					}
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
								updateUrlParams(
									searchParams,
									router,
									"currentSearchTime",
									e.target.value
								);
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
						<button onClick={() => returnToPreviousPage()}>Back</button>
					</div>
				}
			>
				<div className="justify-left flex flex-col">
					<div className="text-xl">Mac Address: {macAddress}</div>
					<div className="text-xl">Shuttle ID: {shuttleID}</div>
					<div className="text-xl">
						Current Location: {humanReadableLoaction}{" "}
					</div>
				</div>
				<div className="h-2" />
				<Tabs
					selectedIndex={currentTab}
					onSelect={(index) => {
						//update the current tab in the url
						setCurrentTab(index);
						updateUrlParams(
							searchParams,
							router,
							"currentTab",
							index.toString()
						);
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
						<Tab>Counts</Tab>
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
						<ShuttlePageCounts
							daysToSearch={timeToSearch}
							location={currentLocation}
						/>
					</TabPanel>

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
