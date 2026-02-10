"use client";
import React from "react";
import Link from "next/link";

import { formatDuration } from "@/utils/formatDuration";
import { cn } from "@/utils/cn";
import { cacheGetShouldWeBeAlarmingForSorterEncoder } from "@/app/dashboard/sorter/encoder/_actions";

type Props = {
	className?: string;
};

const SorterEncoder: React.FC<Props> = ({ className }) => {
	const [isVisible, setIsVisible] = React.useState(false);

	const [isMuted, setIsMuted] = React.useState(false);

	const [muteTimeSeconds, setMuteTimeSeconds] = React.useState(1 * 60 * 60); // default to 1 hour
	const [amountOfFaults, setAmountOfFaults] = React.useState(11);
	const [alarmAt, setAlarmAt] = React.useState(Infinity);

	React.useEffect(() => {
		const check = async () => {
			const fetch = await cacheGetShouldWeBeAlarmingForSorterEncoder();

			console.log("fetch", fetch);

			setIsVisible(fetch.shouldAlarm);
			setAmountOfFaults(fetch.faults);
			setAlarmAt(fetch.alarmAtAmountOfFaults);

			const isMutedFromCookie =
				document.cookie
					.split("; ")
					.find((row) => row.startsWith("sorterEncoderAlertMuted="))
					?.split("=")[1] === "true";

			setIsMuted(isMutedFromCookie);
		};

		check();
		const id = window.setInterval(check, 10000); // every 10 seconds

		return () => window.clearInterval(id);
	}, [amountOfFaults, alarmAt]);

	if (!isVisible || isMuted) {
		return null;
	}

	// Blank placeholder component with mute button
	const handleMute = () => {
		// set cookie for x seconds
		document.cookie = `sorterEncoderAlertMuted=true; path=/; max-age=${muteTimeSeconds}`;
		setIsMuted(true);
		setIsVisible(false);
	};

	return (
		<>
			<div className={cn(className || "", "bg-orange-400")}>
				<div className="flex items-start justify-between p-2">
					<div className="text-2xl text-black">
						<div className="text-4xl">Sorter Encoder Alert:</div>
						<div>
							{amountOfFaults} faults detected in last hour, alarm set at{" "}
							{alarmAt}
						</div>
						<Link className="text-blue-600" href="/dashboard/sorter/encoder">
							{" "}
							Goto dashboard to see more details
						</Link>
					</div>
					<div className="fixed right-2 top-2">
						<button
							aria-label="Mute sorter encoder alert"
							className="ml-2 rounded bg-black bg-opacity-20 px-2 py-1 text-sm"
							title={`Mute sorter encoder alert for ${formatDuration(muteTimeSeconds)}`}
							onClick={handleMute}
						>
							Mute
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default SorterEncoder;
