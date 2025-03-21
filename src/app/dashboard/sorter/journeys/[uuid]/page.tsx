"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { useParams } from "next/navigation";

import Journey from "./_components/journey";
import { getJourney } from "./_actions/getJourney";

import PanelTop from "@/components/panels/panelTop";
import "react-tabs/style/react-tabs.css";
import { changeDateToReadable } from "@/utils/changeDateToReadable";

export default function SorterUL(props: {}) {
	const params = useParams<{ uuid: string }>();
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
		tabColor?: string | null;
	} | null>(null);

	useEffect(() => {
		const fetchULData = async () => {
			const result = await getJourney(params.uuid);

			if (!result) {
				setIsLoading(false);
				setError("Failed to fetch UL details");

				return;
			}

			// Check if JSON is valid before parsing
			let newJourney = [];

			try {
				newJourney = JSON.parse(result.journey).map((journeyObject: any) => {
					return {
						...journeyObject,
						tabColor:
							journeyObject.rejectReason === "0x0"
								? "bg-green-400"
								: journeyObject.rejectReason === "0x800"
									? "bg-yellow-400"
									: "bg-red-400",
					};
				});
			} catch (e) {
				setError(`${result.currentStatusStep} for ${result.requestedUL}`);
				setIsLoading(false);

				return;
			}

			result.journey = JSON.stringify(newJourney);

			setULData(result);

			setIsLoading(false);
		};

		fetchULData();

		setInterval(() => {
			fetchULData();
		}, 5000);
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
						<center>
							<TabList>
								{JSON.parse(ULData.journey).map(
									(journeyObject: any, index: number) => (
										<Tab key={index}>
											<div
												className={
													"rounded-full px-2 " + journeyObject.tabColor
												}
											>
												{journeyObject.offloadTime}
											</div>
										</Tab>
									)
								)}
							</TabList>
						</center>
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
