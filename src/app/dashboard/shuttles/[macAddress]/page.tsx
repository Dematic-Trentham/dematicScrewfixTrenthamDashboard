"use client";
import { useRouter } from "next/navigation";

import PanelTop from "@/components/panels/panelTop";

import "react-tabs/style/react-tabs.css";

import { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import { getShuttleFromMac } from "./parts/_actions";
import ShuttlePageSettings from "./parts/shuttlePageSettings";

export default function ShuttlePage({
	params,
}: {
	params: { macAddress: string };
}) {
	const router = useRouter();

	//add space between the mac address ever 2 characters
	const macAddress = addSpace(params.macAddress);

	const [shuttleID, setShuttleID] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchShuttle = async () => {
			const shuttle = await getShuttleFromMac(macAddress);

			if (!shuttle) {
				setIsLoading(false);
				setError("Failed to fetch shuttle details");

				return;
			}

			setShuttleID(shuttle.shuttleID || "Unknown");
			setIsLoading(false);

			console.log(shuttle);
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
			<button onClick={() => router.back()}>Back</button>
			<PanelTop
				className="w-full"
				title={"Shuttle Details - " + shuttleID}
				topRight={<button onClick={() => router.back()}>Back</button>}
			>
				<div className="justify-left flex flex-col">
					<div className="text-xl">Mac Address: {macAddress}</div>
				</div>

				<Tabs>
					<TabList>
						<Tab>Settings</Tab>
					</TabList>

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
