import React from "react";
import { FaArrowsDownToLine } from "react-icons/fa6";
import Link from "next/link";

import HorizontalBar from "@/components/visual/horizontalBar";
import PanelSmall from "@/components/panels/panelSmall";
import HoverPopup from "@/components/visual/hoverPopupFloat";

interface CCPanelProps {
	accentColor: string;
	name: string;
	faults: { faults: any[]; timeStamp: Date };
	onClickLink?: string;
}

const CCPanel: React.FC<CCPanelProps> = ({
	accentColor,
	name,
	faults,
	onClickLink,
}) => {
	//console.log(name, faults);

	const timeStamp = new Date(faults.timeStamp);

	const aFaults = faults.faults;

	let connectionStatusConnected = false;

	//if the timestamp is within the last 2 minutes, we are connected
	if (timeStamp.getTime() < Date.now() - 2 * 60 * 1000) {
		connectionStatusConnected = true;
	}

	const TotalBoxes = aFaults.reduce((count: number, fault: any) => {
		if (fault.fault === "box") {
			return count + fault.count;
		} else {
			return count;
		}
	}, 0);

	const excludedFaults = [
		"watchDog",
		"EmptyCartonsHelpMark",
		"EmptyCartonsHelpMark",
		"EmptyCartonsCounter",
		"box",
		"Spare6",
	];

	const TotalFaults = aFaults
		.filter((fault) => !excludedFaults.includes(fault.fault))
		.reduce((count: number, fault: any) => {
			return count + fault.count;
		}, 0);

	let faultsHigher = false;

	if (TotalFaults > TotalBoxes) {
		faultsHigher = true;
	}

	let boxTextNumber = 0;
	let boxText = "";

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

	const itemToHover = (
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
						<p className="text-3xl">{boxTextNumber || 0}</p>
						<p>{boxText}</p>
						<HorizontalBar styles={""} />
						<div className="flex">
							<p>Connection</p>
							<div className="ml-4 mt-0.5 h-5 w-5 rounded-full bg-gray-500">
								<div
									className={`ml-0.5 mt-0.5 h-4 w-4 rounded-full ${
										connectionStatusConnected ? "bg-green-500" : "bg-red-500"
									}`}
								/>
							</div>
						</div>
					</div>
				</div>
			</Link>
		</PanelSmall>
	);

	const itemToPopUp = (
		<PanelSmall
			accentColor={"border-gray-500"}
			className="border-2 border-gray-500"
		>
			<div className="flex flex-col gap-y-2 rounded-md bg-gray-100 p-4">
				<div>Total Boxes {TotalBoxes}</div>

				<div>Total Faults {TotalFaults}</div>

				{aFaults
					.filter((fault) => !excludedFaults.includes(fault.fault))
					.map((fault, index) => {
						let string = fault.faultString;

						if (string === "box") string = "Boxes";

						return (
							<div key={index} className="flex justify-between">
								<p>{fault.fault}</p>
								<p> : </p>
								<p>{fault.count}</p>
							</div>
						);
					})}
			</div>
		</PanelSmall>
	);

	return <HoverPopup itemToHover={itemToHover} itemToPopUp={itemToPopUp} />;
};

export default CCPanel;
