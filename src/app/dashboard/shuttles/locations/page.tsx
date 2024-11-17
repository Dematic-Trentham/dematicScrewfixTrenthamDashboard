"use client";
import { useEffect, useState } from "react";
import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { shuttleLocation, shuttleFault } from "../_types/shuttle";

import { getLocations, getShuttleFaults } from "./_actions";
import ShuttlePanel from "./_components/shuttlePanel";
import { colorByTypeType } from "./_components/shuttlePanel";
import { getAllCounts } from "./[macAddress]/parts/_actions";

import PanelTop from "@/components/panels/panelTop";
import VerticalBar from "@/components/visual/verticalBar";
import { updateUrlParams } from "@/utils/url/params";

export default function Home() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [isLoading, setIsLoading] = useState(true);
	const [locations, setLocations] = useState<shuttleLocation[][]>([]);
	const [maintenanceBay, setMaintenanceBay] = useState<shuttleLocation[]>([]);
	//const [maintenanceBayCount, setMaintenanceBayCount] = useState<number>(0);
	const [aisleCount, setAisleCount] = useState<number>(0);
	const [levelCount, setLevelCount] = useState<number>(0);
	const [error, setError] = useState<string | null>(null);
	const [faults, setFaults] = useState<{
		sortedResultsAisle: any;
		sortedResultsShuttleID: any;
		worstShuttleByAisle: number;
		worstShuttleByShuttle: number;
	} | null>(null);

	const [totalFaults, setTotalFaults] = useState<number>(0);

	const initalColorByType = searchParams.get("colorByType")
		? Number(searchParams.get("colorByType"))
		: colorByTypeType.shuttle;

	const [colorByType, setColorByType] =
		useState<colorByTypeType>(initalColorByType);

	const initialTimeToSearch = searchParams.get("currentSearchTime")
		? Number(searchParams.get("currentSearchTime"))
		: 7;

	const [timeToSearch, setTimeToSearch] = useState<number>(initialTimeToSearch);

	const [mostCount, setMostCount] = useState<number>(0);
	const [worstMissionPerFault, setWorstMissionPerFault] =
		useState<number>(99999999);

	useEffect(() => {
		const fetchLocations = async () => {
			const localLocations = await getLocations();
			const counts = await getAllCounts(timeToSearch);

			if (localLocations) {
				const { aisles, maintenanceBay } = await sortLocations(localLocations);

				//set the aisle count
				setAisleCount(Object.keys(aisles).length);

				let maxLevel = 0;

				for (let aisle in aisles) {
					if (aisles[aisle].length > maxLevel) {
						maxLevel = aisles[aisle].length;
					}
				}

				setLevelCount(maxLevel);

				//	console.log(aisles);
				//	console.log(maintenanceBay);
				//
				setLocations(aisles);
				setMaintenanceBay(maintenanceBay);

				//most count
				let mostCount = 0;

				for (let count of counts) {
					if (
						count.totalPicks + count.totalDrops + count.totalIATs >
						mostCount
					) {
						mostCount = count.totalPicks + count.totalDrops + count.totalIATs;
					}
				}

				setMostCount(mostCount);

				//worst mission per fault ( totalPicks + totalDrops + totalIATs ) / totalFaults for a shuttle
				let worstMissionPerFault = 99999999;

				//each count
				for (let count of counts) {
					if (faults === null) continue;

					//get the faults for the shuttle
					const shuttleFaults = faults.sortedResultsShuttleID[count.shuttleID];

					if (shuttleFaults === null) continue;

					//get the total faults for the shuttle
					const totalFaults = shuttleFaults.length;

					if (totalFaults === 0) continue;

					//get the total missions for the shuttle
					const totalMissions =
						count.totalPicks + count.totalDrops + count.totalIATs;

					//get the missions per fault rounded to 2 decimal places
					const missionsPerFault =
						Math.round((totalMissions / totalFaults) * 100) / 100;

					if (missionsPerFault < worstMissionPerFault) {
						worstMissionPerFault = missionsPerFault;
					}
				}

				setWorstMissionPerFault(worstMissionPerFault);

				//set the maintenance bay count
				//setMaintenanceBayCount(maintenanceBay.length);

				setIsLoading(false);
				setError(null);
			} else {
				setIsLoading(false);
				setError("Failed to fetch locations");
			}
		};

		const sortLocations = async (locations: any[]) => {
			let aisles: any[] = [];

			//loop through locations and put into the aisles array based on the aisle number
			locations.forEach((location) => {
				if (!location.currentLocation) {
					//shuttle is in the maintenance bay

					//if the aisle doesn't exist in the aisles array, create it
					if (!aisles[0]) {
						aisles[0] = [];
					}

					//push the location object into the aisle array
					aisles[0].push(location);

					return;
				}

				//get the aisle number from the location object 5 and 6th characters
				const aisle = parseInt(location.currentLocation.substring(4, 6));

				//if the aisle doesn't exist in the aisles array, create it
				if (!aisles[aisle]) {
					aisles[aisle] = [];
				}

				//push the location object into the aisle array
				aisles[aisle].push(location);
			});

			//sort the aisles array by aisle number
			aisles = aisles.sort((a, b) => b[0].aisle - a[0].aisle);

			//sort the locations in each aisle by location number
			aisles.forEach((aisle) => {
				aisle.sort((a: any, b: any) => {
					let aLevel = parseInt(a.currentLocation.substring(8, 10));
					let bLevel = parseInt(b.currentLocation.substring(8, 10));

					return bLevel - aLevel;
				});
			});

			//the first aisle is the maintenance bay, this should be removed from the aisles array and added to its own array
			const maintenanceBay = aisles.shift();

			//console.log(maintenanceBay);
			//console.log(aisles);

			return { aisles, maintenanceBay };
		};

		const fetchFaults = async () => {
			const result = await getShuttleFaults(timeToSearch);

			//console.log(timeToSearch);

			const sortedResults = await sortShuttleFaults(result);

			setFaults(sortedResults);

			//total faults
			let totalFaults = 0;

			for (let shuttleID in sortedResults.sortedResultsShuttleID) {
				totalFaults += sortedResults.sortedResultsShuttleID[shuttleID].length;
			}

			setTotalFaults(totalFaults);

			//console.log(result);
		};

		const sortShuttleFaults = async (faults: shuttleFault[]) => {
			//group the faults by aisle and level
			let sortedResultsAisle: any = {};

			faults.forEach((fault) => {
				if (!sortedResultsAisle[fault.aisle]) {
					sortedResultsAisle[fault.aisle] = [];
				}

				if (!sortedResultsAisle[fault.aisle][fault.level]) {
					sortedResultsAisle[fault.aisle][fault.level] = [];
				}

				sortedResultsAisle[fault.aisle][fault.level].push(fault);
			});

			//group the faults by shuttleID
			let sortedResultsShuttleID: any = {};

			faults.forEach((fault) => {
				if (!sortedResultsShuttleID[fault.shuttleID]) {
					sortedResultsShuttleID[fault.shuttleID] = [];
				}

				sortedResultsShuttleID[fault.shuttleID].push(fault);
			});

			let worstShuttleByAisle = 0;
			let worstShuttleByShuttle = 0;

			//loop through the sortedResultsShuttleID and find the shuttle with the most faults

			for (let shuttleID in sortedResultsShuttleID) {
				if (sortedResultsShuttleID[shuttleID].length > worstShuttleByShuttle) {
					worstShuttleByShuttle = sortedResultsShuttleID[shuttleID].length;
				}
			}

			//loop through the sortedResultsAisle and find the aisle with the most faults
			for (let aisle in sortedResultsAisle) {
				for (let level in sortedResultsAisle[aisle]) {
					if (sortedResultsAisle[aisle][level].length > worstShuttleByAisle) {
						worstShuttleByAisle = sortedResultsAisle[aisle][level].length;
					}
				}
			}

			return {
				sortedResultsAisle,
				sortedResultsShuttleID,
				worstShuttleByAisle,
				worstShuttleByShuttle,
			};
		};

		const intervalId = setInterval(() => {
			fetchLocations();
			fetchFaults();
		}, 5000);

		fetchFaults();
		fetchLocations();

		return () => clearInterval(intervalId);
	}, [timeToSearch]);

	if (isLoading) {
		return (
			<PanelTop className="h-fit w-full" title="Shuttle Locations">
				<div className="flex w-full flex-col items-center justify-center">
					<p>Loading...</p>
				</div>
			</PanelTop>
		);
	}

	if (error) {
		return (
			<PanelTop className="h-fit w-full" title="Shuttle Locations">
				<div className="flex w-full flex-col items-center justify-center">
					<p>{error}</p>
				</div>
			</PanelTop>
		);
	}

	return (
		<PanelTop
			className="h-fit w-full"
			title="Shuttle Locations"
			topRight={
				<div className="flex text-white">
					<div>Options</div>
					<select
						className="ml-2 rounded border p-1"
						defaultValue={colorByType}
						onChange={(e) => {
							setColorByType(parseInt(e.target.value));

							//update the color by type in the url
							updateUrlParams(
								searchParams,
								router,
								"colorByType",
								e.target.value
							);
						}}
					>
						<option value={colorByTypeType.shuttle}>Shuttle</option>
						<option value={colorByTypeType.aisle}>Aisle</option>
						<option value={colorByTypeType.counts}>Counts</option>
						<option value={colorByTypeType.missionsPerFault}>
							Missions Per Fault
						</option>
					</select>
					<select
						className="ml-2 rounded border p-1"
						defaultValue={timeToSearch}
						onChange={(e) => {
							setTimeToSearch(Number(e.target.value));

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
			<div>
				<p>{`Total Faults ${totalFaults}`}</p>
			</div>
			<p className="text-center text-xl font-bold">In Aisle</p>

			<div className="flex w-full flex-wrap content-center justify-center">
				<div className="hidden min-w-56 flex-col space-x-1 space-y-1 self-center lg:flex">
					<p className="text-center text-xl">Aisle</p>

					{Array.from({ length: levelCount }, (_, index) => (
						<div key={levelCount - index} className="text-center text-3xl">
							{<p>{levelCount - index}</p>}
						</div>
					))}
				</div>
				<div className="hidden items-center align-middle lg:flex">
					<VerticalBar />
				</div>

				{locations.map((aisle, index) => (
					<React.Fragment key={index}>
						<div className="flex min-w-56 flex-col space-x-1 space-y-1 self-center">
							<div className="text-center text-xl">Aisle {index + 1}</div>

							{aisle.map((location, index) => (
								<div key={index}>
									<ShuttlePanel
										colorByType={colorByType}
										currentLocation={location.currentLocation}
										currentSearchTime={timeToSearch}
										inMaintenanceBay={false}
										locations={location}
										mostCount={mostCount}
										passedFaults={faults}
										worstMissionPerFault={worstMissionPerFault}
									/>
								</div>
							))}
						</div>
						{index < aisleCount - 1 && (
							<div className="flex items-center align-middle">
								<VerticalBar styles="align-middle" />
							</div>
						)}
					</React.Fragment>
				))}
			</div>
			<br />
			<p className="text-medium font-bold">Maintenance Bay</p>
			<div className="flex w-full flex-wrap content-center justify-center space-x-1 space-y-1">
				{maintenanceBay.map((location, index) => (
					<div key={index} className="flex flex-row space-x-2 self-center">
						<ShuttlePanel
							colorByType={colorByType}
							currentLocation=""
							currentSearchTime={timeToSearch}
							inMaintenanceBay={true}
							locations={location}
							mostCount={mostCount}
							passedFaults={faults}
							worstMissionPerFault={worstMissionPerFault}
						/>
					</div>
				))}
			</div>
			<div className="p-4" />
		</PanelTop>
	);
}
