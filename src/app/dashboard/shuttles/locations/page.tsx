"use client";
import { useEffect, useState } from "react";

import { shuttleLocation } from "../_types/shuttle";

import { getLocations } from "./_actions";
import ShuttlePanel from "./_components/shuttlePanel";

import PanelTop from "@/components/panels/panelTop";
import VerticalBar from "@/components/visual/verticalBar";

export default function Home() {
	const [isLoading, setIsLoading] = useState(true);
	const [locations, setLocations] = useState<shuttleLocation[][]>([]);
	const [maintenanceBay, setMaintenanceBay] = useState<shuttleLocation[]>([]);
	const [maintenanceBayCount, setMaintenanceBayCount] = useState<number>(0);
	const [aisleCount, setAisleCount] = useState<number>(0);
	const [levelCount, setLevelCount] = useState<number>(0);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchLocations = async () => {
			const localLocations = await getLocations();

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

				console.log(aisles);
				console.log(maintenanceBay);

				setLocations(aisles);
				setMaintenanceBay(maintenanceBay);

				//set the maintenance bay count
				setMaintenanceBayCount(maintenanceBay.length);

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

			console.log(maintenanceBay);
			console.log(aisles);

			return { aisles, maintenanceBay };
		};

		setInterval(() => {
			fetchLocations();
		}, 10000);

		fetchLocations();
	}, []);

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
		<PanelTop className="h-fit w-full" title="Shuttle Locations">
			<p className="text-center text-medium font-bold">In Aisle</p>

			<div className="flex w-full flex-wrap content-center justify-center">
				<div className="hidden min-w-56 flex-col self-center lg:flex">
					<p className="text-center text-medium">Aisle</p>

					{Array.from({ length: levelCount }, (_, index) => (
						<div key={levelCount - index} className="text-center text-medium">
							{<p>{levelCount - index}</p>}
						</div>
					))}
				</div>
				<div className="hidden items-center align-middle lg:flex">
					<VerticalBar />
				</div>

				{locations.map((aisle, index) => (
					<>
						<div key={index} className="flex min-w-56 flex-col self-center">
							<div className="text-center text-medium">Aisle {index + 1}</div>

							{aisle.map((location, index) => (
								<div key={index}>
									<ShuttlePanel locations={location} />
								</div>
							))}
						</div>
						{index < aisleCount - 1 && (
							<div className="flex items-center align-middle">
								<VerticalBar styles="align-middle" />
							</div>
						)}
					</>
				))}
			</div>
			<br />
			<p className="text-medium font-bold">Maintenance Bay</p>
			<div className="flex w-full flex-wrap content-center justify-center">
				{maintenanceBay.map((location, index) => (
					<div key={index} className="flex flex-row space-x-2 self-center">
						<ShuttlePanel locations={location} />
					</div>
				))}
			</div>
			<div className="p-4" />
		</PanelTop>
	);
}
