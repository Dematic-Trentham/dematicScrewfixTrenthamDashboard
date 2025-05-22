"use client";
import React from "react";
import Image from "next/image";

import { getNextFinishDay } from "./_components/nextFriday";
import gif from "./astra-departure.gif";
import jpy from "./2.jpg";

const Page = () => {
	const [nextFridayDay, setNextFridayDay] = React.useState<{
		date: Date;
		time: string;
	} | null>(null);

	const [timeToNextFinish, setTimeToNextFinish] = React.useState<number>(0);

	React.useEffect(() => {
		const interval = setInterval(() => {
			const nextFinish = getNextFinishDay();

			setNextFridayDay(nextFinish);
			const now = new Date();

			const nextFinishDay = new Date(
				`${nextFinish.date.toISOString().split("T")[0]}T${nextFinish.time}`
			);

			//console.log("Next finish day:", nextFinishDay);

			const timeDifference = nextFinishDay.getTime() - now.getTime();

			//console.log("Time to next finish:", timeDifference);

			setTimeToNextFinish(timeDifference);
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	return (
		<div>
			<h1 className="text-center text-3xl font-bold">Next Finish</h1>
			{nextFridayDay && (
				<div className="mt-4 text-center">
					<p className="text-xl">
						Next finish day: {nextFridayDay.date.toDateString()} at{" "}
						{nextFridayDay.time}
						{}
					</p>
					<p className="text-lg">
						Time to next finish:{" "}
						{Math.floor(timeToNextFinish / (1000 * 60 * 60 * 24))}d{" "}
						{Math.floor(
							(timeToNextFinish % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
						)}
						h {Math.floor((timeToNextFinish % (1000 * 60 * 60)) / (1000 * 60))}m{" "}
						{Math.floor((timeToNextFinish % (1000 * 60)) / 1000)}s
					</p>
					{timeToNextFinish > 0 && timeToNextFinish < 30 * 60 * 1000 && (
						<div className="mt-2 flex flex-col items-center text-center text-red-500">
							<p>Less than 30 minutes remaining!</p>

							<Image
								alt="Astra GIF"
								className="rounded-lg"
								height={200}
								src={jpy}
								width={800}
							/>

							{new Date().getDay() === 5 && (
								<div
									className="mt-4 flex animate-bounce items-center justify-center bg-black text-center text-6xl font-extrabold text-blue-600"
									style={{
										height: "100px",
										width: "100%",
										animation: "bounce 2s infinite",
									}}
								>
									SUPER FRIDAY
								</div>
							)}
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default Page;
