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

		setInterval(() => {
			fetchULData();
		}
		, 5000);
	}, []);

	if (isLoading) {
		return (
			<div>
				<PanelTop
					className="w-full"
					title={"UL Details"}
					topRight={<button onClick={() => router.back()}>Back</button>}
				>
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
					title={"UL Details"}
					topRight={<button onClick={() => router.back()}>Back</button>}
				>
					<div>{error}</div>
				</PanelTop>
			</div>
		);
	}
	if (!ULData) {
		return (
			<div>
				<PanelTop
					className="w-full"
					title={"UL Details"}
					topRight={<button onClick={() => router.back()}>Back</button>}
				>
					<div>No UL data found</div>
				</PanelTop>
			</div>
		);
	}

	if (ULData?.status !== "COMPLETED") {
		return (
			<div>
				<PanelTop
					className="w-full"
					title={"UL Details"}
					topRight={<button onClick={() => router.back()}>Back</button>}
				>
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

	if (ULData.journey === "") {
		return (
			<div>
				<PanelTop
					className="w-full"
					title={"UL Details"}
					topRight={<button onClick={() => router.back()}>Back</button>}
				>
					{" "}
					<div>No journey data found</div>
				</PanelTop>
			</div>
		);
	}

	return (
		<div>
			<PanelTop
				className="w-full"
				title={"UL Details"}
				topRight={<button onClick={() => router.back()}>Back</button>}
			>
				<div>
					<div>Requested UL: {ULData.requestedUL}</div>
					<div>Last updated: {changeDateToReadable(ULData.updatedDate)}</div>
					<br />
					<Tabs>
						<TabList>
							{JSON.parse(ULData.journey).map(
								(journeyObject: any, index: number) => (
									<Tab key={index}>
										{journeyObject.offloadTime}
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
