"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import CartonLaunchComponent from "./_components/cartonLaunch";
import { fetchData } from "./_actions/clientActions";

import Loading from "@/components/visual/loading";
import { totalTimeSelector } from "@/components/pickers/totalTimeSelector";
import AdminBox from "@/components/adminBox";
import config from "@/config";

const CartonClosingPage: React.FC = () => {
	const router = useRouter();

	//get returnURL form the url
	const searchParams = useSearchParams();

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [data, setData] = useState<any | null>(null);
	const [dataold, setDataold] = useState<any | null>(null);

	const [onlyShowBoxes, setOnlyShowBoxes] = useState(false);

	const [totalTime, setTotalTime] = useState(60);

	//get the timeRange from the url, if not found, set to 60 minutes
	const timeRange = searchParams.get("timeRange");

	useEffect(() => {
		console.log("timeRange", timeRange);
		if (timeRange) {
			setTotalTime(Number(timeRange));
		}
	}, [timeRange]);

	useEffect(() => {
		function lFetchData() {
			fetchData(totalTime, setLoading, setError, setDataold, setData); // Fetch data every 10 seconds
		}

		const intervalId = setInterval(lFetchData, config.refreshTime); // 10 seconds

		lFetchData(); // Initial fetch

		return () => clearInterval(intervalId); // Cleanup on unmount
	}, [totalTime]);

	if (loading) {
		return <Loading />;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<>
			<div
				style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}
			>
				{[1, 2, 3, 4, 5].map((lineNumber) => (
					<CartonLaunchComponent
						key={lineNumber}
						data={data}
						dataold={dataold}
						hasBarcoder={true}
						hasErector={true}
						lineNumber={lineNumber.toString()}
						onlyBoxes={onlyShowBoxes}
						timeRange={totalTime.toString()}
					/>
				))}
			</div>

			{totalTimeSelector(
				totalTime,
				searchParams,
				router,
				setTotalTime,
				setLoading
			)}

			<AdminBox
				checkBoxes={[
					{
						label: "Show Only Boxes",
						callback: setOnlyShowBoxes,
					},
				]}
			/>
		</>
	);
};

export default CartonClosingPage;
