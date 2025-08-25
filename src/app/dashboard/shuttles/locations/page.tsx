"use client";
import { useEffect, useState } from "react";
import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { array, set } from "zod";

import { shuttleLocation, shuttleFault } from "../_types/shuttle";

import {
	aisleAndLevelAmount,
	getLocations,
	getShuttleFaults,
	getShuttleFaultsAndCountsNumbers,
	getShuttleFaultsAndCountsNumbersCache,
	hasShuttleFaultsAndCountsNumbersCache,
} from "./_actions";
import { colorByTypeType } from "./_components/shuttlePanel copy";
import { getAllCounts } from "./[macAddress]/parts/_actions";
import ShuttlePanelNew from "./_components/shuttlePanel copy";

import config from "@/config";
import PanelTop from "@/components/panels/panelTop";
import VerticalBar from "@/components/visual/verticalBar";
import { updateUrlParams } from "@/utils/url/params";
import Loading from "@/components/visual/loading";
import { niceFormatPercentage, niceRound } from "@/utils/niceNumbers";

export default function Home() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [isLoading, setIsLoading] = useState(true);
	const [loadingText, setLoadingText] = useState<string>("");

	const [maintenanceBay, setMaintenanceBay] = useState<shuttleLocation[]>([]);

	const [aisleCount, setAisleCount] = useState<number>(0);
	const [levelCount, setLevelCount] = useState<number>(0);
	const [error, setError] = useState<string | null>(null);

	const [selectedShuttle, setSelectedShuttle] = useState<string>("");

	const initalColorByType = searchParams.get("colorByType")
		? Number(searchParams.get("colorByType"))
		: colorByTypeType.shuttle;

	const [colorByType, setColorByType] =
		useState<colorByTypeType>(initalColorByType);

	const initialTimeToSearch = searchParams.get("currentSearchTime")
		? Number(searchParams.get("currentSearchTime"))
		: 7;

	const [timeToSearch, setTimeToSearch] = useState<number>(initialTimeToSearch);

	const [worstMissionPerFault, setWorstMissionPerFault] = useState<{
		amount: number;
		location: string;
	}>({ amount: 99999999, location: "" });

	useEffect(() => {
		//get the ip address of the client

		if (!isLoading) {
			// Page load completed
			// Scroll to put aisle 1 at the top of the page
			const aisle1 = document.getElementById("shuttle-levels");

			if (aisle1) {
				aisle1.scrollIntoView({
					behavior: "smooth",
					block: "start",
					inline: "nearest",
				});
			}
		}
	}, [isLoading]);

	const [totalFaultsForShuttle, setTotalFaultsForShuttle] = useState<{
		[key: string]: number;
	}>({});
	const [totalMissionsForShuttle, setTotalMissionsForShuttle] = useState<{
		[key: string]: number;
	}>({});
	const [missionsPerFaults, setMissionsPerFaults] = useState<{
		[key: string]: number;
	}>({});
	const [totalMissionsPerFault, setTotalMissionsPerFault] = useState<number>(0);
	const [totalFaults, setTotalFaults] = useState<number>(0);
	const [totalMissions, setTotalMissions] = useState<number>(0);

	const [bestMissions, setBestMissions] = useState<{
		amount: number;
		location: string;
	}>({ amount: 0, location: "" });

	const [mostFaults, setMostFaults] = useState<{
		amount: number;
		location: string;
	}>({ amount: 0, location: "" });

	const [softISLoading, setSoftLoader] = useState<boolean>(false);
	const [locations, setLocations] = useState<shuttleLocation[][]>([]);

	//new mission and fault counts
	useEffect(() => {
		const fetchData = async () => {
			if (softISLoading === true) return;

			setSoftLoader(true);

			//lets grab counts and faults

			const startTime = performance.now();

			const isCached =
				await hasShuttleFaultsAndCountsNumbersCache(timeToSearch);

			if (isCached) {
				setLoadingText("Loading from cache...");
			}
			// Fetch fresh data if not cached
			else {
				setLoadingText(
					"Loading fresh data, from database, this might take a while..."
				);
			}

			const {
				sortedFaultCounts,
				sortedMissionCounts,
				totalFaults,
				totalMissions,
				locations,
			} = await getShuttleFaultsAndCountsNumbersCache(timeToSearch);

			// Transform the flat array into a 2D array grouped by aisle and level
			const locationsByAisleAndLevel: shuttleLocation[][] = [];
			const maintenanceBayLocations: shuttleLocation[] = [];

			for (const loc of locations) {
				if (
					loc.currentLocation == undefined ||
					loc.currentLocation === null ||
					loc.currentLocation === ""
				) {
					maintenanceBayLocations.push(loc);

					continue;
				}
				//"MSAI01LV17SH01"
				const aisle = loc.currentLocation.slice(4, 6); // Extract aisle from "Aisle XX, Level YY"
				const level = loc.currentLocation.slice(8, 10); // Extract level from "Aisle XX, Level YY"

				const aisleIdx = parseInt(aisle, 10) - 1;
				const levelIdx = parseInt(level, 10) - 1;

				if (!locationsByAisleAndLevel[aisleIdx])
					locationsByAisleAndLevel[aisleIdx] = [];
				locationsByAisleAndLevel[aisleIdx][levelIdx] = loc;
			}

			setLocations(locationsByAisleAndLevel);
			setMaintenanceBay(maintenanceBayLocations);

			//calculate missions per fault
			const totalMissionsPerFault = niceRound(totalMissions / totalFaults);

			setTotalMissionsPerFault(totalMissionsPerFault);
			setTotalFaults(totalFaults);
			setTotalMissions(totalMissions);

			setTotalFaultsForShuttle(sortedFaultCounts);

			let missionsForAisle: { [key: string]: number } = {};

			for (const key of Object.entries(sortedMissionCounts)) {
				const key2 = key[0].split(".");

				let location =
					"MSAI" +
					key2[0].padStart(2, "0") +
					"LV" +
					key2[1].padStart(2, "0") +
					"SH01";

				console.log(location + " " + key[1]);

				//"MSAI02LV13SH01"
				locations.forEach((loc) => {
					if (loc.currentLocation === location) {
						missionsForAisle[loc.shuttleID] = key[1];
					}
				});
			}

			setTotalMissionsForShuttle(missionsForAisle);
			console.log(missionsForAisle);

			let worstMissionPerFault = {
				amount: Infinity,
				location: "",
			};

			let missionsPerFaults: { [key: string]: number } = {};

			let mostFaults = {
				amount: 0,
				location: "",
			};
			let mostMissions = {
				amount: 0,
				location: "",
			};

			//work out worst mission per fault
			for (const [shuttleId, faults] of Object.entries(sortedFaultCounts)) {
				const missions = missionsForAisle[shuttleId] || 0;

				if (faults == 0) {
					missionsPerFaults[shuttleId] = missions;
				} else if (missions == 0) {
					missionsPerFaults[shuttleId] = 0;
				} else {
					const missionPerFault = niceRound(missions / faults);

					missionsPerFaults[shuttleId] = missionPerFault;

					if (missionPerFault < worstMissionPerFault.amount) {
						worstMissionPerFault = {
							amount: missionPerFault,
							location: shuttleId,
						};
					}
				}

				if (missions > mostMissions.amount) {
					mostMissions = {
						amount: missions,
						location: shuttleId,
					};
				}

				if (faults > mostFaults.amount) {
					mostFaults = {
						amount: faults,
						location: shuttleId,
					};
				}
			}

			setWorstMissionPerFault(worstMissionPerFault);
			setMostFaults(mostFaults);
			setBestMissions(mostMissions);
			setMissionsPerFaults(missionsPerFaults);

			//Aisle Count and Level
			const { amountOfAisles, amountOfLevels } = await aisleAndLevelAmount();

			setAisleCount(Number(amountOfAisles));
			setLevelCount(Number(amountOfLevels));

			setIsLoading(false);
			setSoftLoader(false);
		};

		fetchData();

		const interval = setInterval(() => {
			fetchData();
		}, 5000);

		return () => {
			clearInterval(interval);
		};
	}, [timeToSearch]);

	if (isLoading) {
		return (
			<PanelTop className="h-fit w-full" title="Shuttle Locations">
				<div className="flex w-full flex-col items-center justify-center">
					<Loading text={loadingText} />
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
					<div className="relative">
						<input
							className="ml-2 rounded border p-1 pr-6"
							placeholder={"Search"}
							type="text"
							value={selectedShuttle}
							onChange={(e) => setSelectedShuttle(e.target.value)}
						/>
						{selectedShuttle && (
							<button
								aria-label="Clear search"
								className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
								tabIndex={-1}
								type="button"
								onClick={() => setSelectedShuttle("")}
							>
								&#10005;
							</button>
						)}
					</div>
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
						<option value={colorByTypeType.faults}>Faults</option>
						<option value={colorByTypeType.counts}>Counts</option>
						<option selected value={colorByTypeType.missionsPerFault}>
							Missions Per Fault
						</option>
					</select>
					<select
						className="ml-2 rounded border p-1"
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
			<div className="flex w-full flex-wrap justify-around">
				<div className="w-full text-center sm:w-1/2 lg:w-1/4">{`Total Faults: ${totalFaults}`}</div>
				<div className="w-full text-center sm:w-1/2 lg:w-1/4">{`Total Missions: ${totalMissions}`}</div>
				<div className="w-full text-center sm:w-1/2 lg:w-1/4">{`Missions Per Fault: ${totalMissionsPerFault}`}</div>
				<div className="w-full text-center sm:w-1/2 lg:w-1/4">{`Worst Mission Per Fault: ${worstMissionPerFault.amount} (Location: ${worstMissionPerFault.location})`}</div>
			</div>
			<div
				className="flex w-full flex-wrap content-center justify-center"
				id="shuttle-levels"
			>
				<div className="hidden min-w-56 flex-col space-x-1 space-y-1 self-center lg:flex">
					<p className="text-end text-xs">Aisle</p>

					{Array.from({ length: levelCount }, (_, index) => (
						<div key={levelCount - index} className="h-8 text-end text-3xl">
							{<p>{levelCount - index}</p>}
						</div>
					))}
				</div>
				<div className="flex items-center p-1 align-middle">
					<VerticalBar styles="align-middle " />
				</div>
				<div className="flex w-full flex-wrap justify-center lg:w-auto">
					{Array.from({ length: aisleCount }, (_, aisleIndex) => (
						<div key={aisleIndex} className="space-x-1 space-y-1">
							<p className="text-center text-xs">{aisleIndex + 1}</p>
							{Array.from({ length: levelCount }, (_, levelIndex) => {
								return (
									<ShuttlePanelNew
										key={aisleIndex + "." + (levelCount - levelIndex)}
										colourType={colorByType}
										currentSearchTime={timeToSearch}
										highlight={selectedShuttle}
										mostFaults={mostFaults.amount}
										mostMissions={bestMissions.amount}
										shuttleFaults={
											totalFaultsForShuttle[
												locations[aisleIndex]?.[levelCount - levelIndex - 1]
													?.shuttleID
											] || 0
										}
										shuttleInfo={
											locations[aisleIndex]?.[levelCount - levelIndex - 1]
										}
										shuttleLocation={
											locations[aisleIndex]?.[levelCount - levelIndex - 1]
												?.currentLocation || ""
										}
										shuttleMissionPerFault={
											missionsPerFaults[
												locations[aisleIndex]?.[levelCount - levelIndex - 1]
													?.shuttleID
											] || 0
										}
										shuttleMissions={
											totalMissionsForShuttle[
												locations[aisleIndex]?.[levelCount - levelIndex - 1]
													?.shuttleID
											] || 0
										}
										worstMissionPerFault={worstMissionPerFault.amount}
									/>
								);
							})}
						</div>
					))}
				</div>
			</div>
			<br />

			<p className="text-medium font-bold">Maintenance Bay</p>
			<div className="flex flex-wrap justify-center gap-2">
				{maintenanceBay.map((shuttle, idx) => (
					<ShuttlePanelNew
						key={shuttle.shuttleID || idx}
						colourType={colorByType}
						currentSearchTime={timeToSearch}
						highlight={selectedShuttle}
						mostFaults={mostFaults.amount}
						mostMissions={bestMissions.amount}
						shuttleFaults={totalFaultsForShuttle[shuttle.shuttleID] || 0}
						shuttleInfo={shuttle}
						shuttleLocation={shuttle.currentLocation || ""}
						shuttleMissionPerFault={missionsPerFaults[shuttle.shuttleID] || 0}
						shuttleMissions={totalMissionsForShuttle[shuttle.shuttleID] || 0}
						worstMissionPerFault={worstMissionPerFault.amount}
					/>
				))}
			</div>
		</PanelTop>
	);
}
