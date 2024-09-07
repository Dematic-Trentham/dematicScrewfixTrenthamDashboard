"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import PanelTop from "@/components/panels/panelTop";

import "react-tabs/style/react-tabs.css";
import { getJourney } from "./_actions/getJourney";

import { changeDateToReadable } from "@/utils/changeDateToReadable";

import Journey from "./_components/journey";

import { Tab, TabList, TabPanel, Tabs } from "react-tabs";

export default function SorterUL({ params }: { params: { uuid: string } }) {
	const router = useRouter();

	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [ULData, setULData] = useState<{
		id: string;
		requestedUL: string;
		createdDate: Date;
		updatedDate: Date;
		processingStartedDate: Date | null;
		processingCompletedDate: Date | null;
		status: string;
		error: string | null;
		journey: string;
		currentStatusStep: string | null;
	} | null>(null);

	useEffect(() => {
		const fetchULData = async () => {
			const result = await getJourney(params.uuid);

			if (!result) {
				setIsLoading(false);
				setError("Failed to fetch UL details");

				return;
			}

			setULData(result);
			setIsLoading(false);
		};

		fetchULData();
	}, []);

	if (isLoading) {
		return (
			<div>
				<button onClick={() => router.back()}>Back</button>
				<PanelTop className="w-full" title={"UL Details"}>
					<div>is loading....</div>
				</PanelTop>
			</div>
		);
	}

	if (error) {
		return (
			<div>
				<button onClick={() => router.back()}>Back</button>
				<PanelTop className="w-full" title={"UL Details"}>
					<div>{error}</div>
				</PanelTop>
			</div>
		);
	}
	if (!ULData) {
		return (
			<div>
				<button onClick={() => router.back()}>Back</button>
				<PanelTop className="w-full" title={"UL Details"}>
					<div>No UL data found</div>
				</PanelTop>
			</div>
		);
	}

	if (ULData?.status !== "COMPLETED") {
		return (
			<div>
				<button onClick={() => router.back()}>Back</button>
				<PanelTop className="w-full" title={"UL Details"}>
					<div>
						<div>Requested UL: {ULData.requestedUL}</div>
						<div>
							Current Status: {ULData.status} - {ULData.currentStatusStep}
						</div>
						<div>Created Date: {changeDateToReadable(ULData.createdDate)}</div>
						<div>Updated Date: {changeDateToReadable(ULData.updatedDate)}</div>
					</div>
				</PanelTop>
			</div>
		);
	}

	return (
		<div>
			<button onClick={() => router.back()}>Back</button>
			<PanelTop className="w-full" title={"UL Details"}>
				<div>
					<div>Requested UL: {ULData.requestedUL}</div>
					<div>Last updated: {changeDateToReadable(ULData.updatedDate)}</div>
					<br />
					<Tabs>
						<TabList>
							{JSON.parse(ULData.journey).map(
								(journeyObject: any, index: number) => (
									<Tab key={index}>
										{ULData.createdDate.getDay() +
											"/" +
											ULData.createdDate.getMonth() +
											"/" +
											ULData.createdDate.getFullYear() +
											" " +
											journeyObject.offloadTime}
									</Tab>
								)
							)}
						</TabList>

						{JSON.parse(ULData.journey).map(
							(journeyObject: any, index: number) => (
								<TabPanel key={index}>
									<Journey key={index} journeyObject={journeyObject} />
								</TabPanel>
							)
						)}
					</Tabs>
				</div>
			</PanelTop>
		</div>
	);

	// const macAddress = addSpace(params.macAddress);
}
