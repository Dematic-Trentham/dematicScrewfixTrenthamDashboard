import { machine } from "os";

import React from "react";
import { FaArrowsDownToLine } from "react-icons/fa6";
import Link from "next/link";

import HorizontalBar from "@/components/visual/horizontalBar";
import PanelSmall from "@/components/panels/panelSmall";

interface CCPanelProps {
	accentColor: string;
	name: string;
	faults: any[];
	onClickLink?: string;
}

const CCPanel: React.FC<CCPanelProps> = ({
	accentColor,
	name,
	faults,
	onClickLink,
}) => {
	//connection status "any faults in last 5 minutes"
	let connectionStatusConnected = false;

	for (let i = 0; i < faults.length; i++) {
		if (faults[i].timestamp > Date.now() - 5 * 60 * 1000) {
			connectionStatusConnected = true;
			break;
		}
	}

	//total boxes fautlString = "box"
	const TotalBoxes = faults.reduce((count: number, fault: any) => {
		return fault.faultString === "box" ? count + 1 : count;
	}, 0);

	//total faults fautlString != "box" or "Watchdog timer expired"
	const TotalFaults = faults.reduce((count: number, fault: any) => {
		return fault.faultString !== "box" &&
			fault.faultString !== "Watchdog timer expired"
			? count + 1
			: count;
	}, 0);

	let faultsHigher = false;

	//which is greater, total faults or total boxes
	if (TotalFaults > TotalBoxes) {
		faultsHigher = true;
	}

	let boxTextNumber = 0;
	let boxText = "";

	//do we have no boxes but we have faults
	if (TotalBoxes === 0 && TotalFaults > 0) {
		boxText = "Faults";
		boxTextNumber = TotalFaults;
	} else if (TotalBoxes > 0 && TotalFaults === 0) {
		boxText = "Boxes";
		boxTextNumber = TotalBoxes;
	} else if (faultsHigher) {
		boxText = "Faults per box";
		boxTextNumber = parseFloat((TotalFaults / TotalBoxes).toFixed(2));
	} else {
		boxText = "Boxes per fault";
		boxTextNumber = parseFloat((TotalBoxes / TotalFaults).toFixed(2));
	}

	return (
		<PanelSmall accentColor={accentColor}>
			<Link href={onClickLink || ""}>
				<div className="flex gap-x-5">
					<div>
						<div
							className={`flex h-32 w-32 items-center justify-center rounded-full bg-gray-500 text-white`}
						>
							<div
								className={`flex h-28 w-28 items-center justify-center rounded-full text-white`}
								style={{ backgroundColor: accentColor }}
							>
								<FaArrowsDownToLine className={`size-14 text-white`} />
							</div>
						</div>
					</div>
					<div className="flex flex-col">
						<p className="text-2xl">{name}</p>
						<p className="text-3xl">{boxTextNumber}</p>
						<p>{boxText}</p>
						<HorizontalBar styles={""} />
						<div className="flex">
							<p>Connection</p>
							<div className="ml-4 mt-0.5 h-5 w-5 rounded-full bg-gray-500">
								<div
									className={`ml-0.5 mt-0.5 h-4 w-4 rounded-full ${connectionStatusConnected ? "bg-green-500" : "bg-red-500"}`}
								/>
							</div>
						</div>
					</div>
				</div>
			</Link>
		</PanelSmall>
	);
};

export default CCPanel;
