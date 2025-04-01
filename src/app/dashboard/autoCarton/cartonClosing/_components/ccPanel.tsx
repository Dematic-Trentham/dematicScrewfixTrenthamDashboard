import React from "react";
import { FaArrowsDownToLine } from "react-icons/fa6";
import Link from "next/link";

import { excludedFaults } from "./../../excludedFaults";

import HorizontalBar from "@/components/visual/horizontalBar";
import PanelSmall from "@/components/panels/panelSmall";
import HoverPopup from "@/components/visual/hoverPopupFloat";

interface CCPanelProps {
	accentColor: string;
	name: string;
	faults: { faults: any[]; connected: boolean };
	onClickLink?: string;
	onlyBoxes?: boolean;
}

const CCPanel: React.FC<CCPanelProps> = ({
	accentColor,
	name,
	faults,
	onClickLink,
	onlyBoxes,
}) => {
	//console.log(name, faults);

	const aFaults = faults.faults;

	const TotalBoxes = aFaults.reduce((count: number, fault: any) => {
		if (fault.fault === "box") {
			return count + fault.count;
		} else {
			return count;
		}
	}, 0);

	let TotalFaults = aFaults
		.filter((fault) => !excludedFaults.includes(fault.fault))
		.reduce((count: number, fault: any) => {
			return count + fault.count;
		}, 0);

	//if we are only showing boxes, then we need to set the faults to 0
	if (onlyBoxes) {
		TotalFaults = 0;
	}

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

	//work out the color of the box
	//if faults are higher than boxes, then the box is red
	//if no faults, then the box is green
	//else make a gradient between green and red though yellow and orange based on the ratio of faults to boxes
	let boxColor = "#000000";

	const green = [0, 240, 30]; // RGB for green
	const red = [240, 33, 30]; // RGB for red

	const redHex = `rgb(${red[0]}, ${red[1]}, ${red[2]})`;
	const greenHex = `rgb(${green[0]}, ${green[1]}, ${green[2]})`;

	if (faultsHigher) {
		boxColor = redHex; // red
	} else if (TotalFaults === 0) {
		boxColor = greenHex; // green
	} else {
		const percent = (TotalFaults / TotalBoxes) * 100;

		const interpolate = (start: number, end: number, factor: number) => {
			return start + (end - start) * factor;
		};

		const factor = Math.min(percent / 5, 1); // Cap the factor at 1 for percent >= 5

		const r = Math.round(interpolate(green[0], red[0], factor));
		const g = Math.round(interpolate(green[1], red[1], factor));
		const b = Math.round(interpolate(green[2], red[2], factor));

		boxColor = `rgb(${r}, ${g}, ${b})`;
	}

	if (!faults.connected) {
		boxColor = "#808080"; // grey
	}

	const itemToHover = (
		<PanelSmall accentColor={boxColor}>
			<Link href={onClickLink || ""}>
				<div className="flex gap-x-5">
					<div>
						<div
							className={`flex h-32 w-32 items-center justify-center rounded-full bg-gray-500 text-white`}
						>
							<div
								className={`flex h-28 w-28 items-center justify-center rounded-full text-white`}
								style={{ backgroundColor: boxColor }}
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
										faults.connected ? "bg-green-500" : "bg-grey-500"
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
				<div>Ratio {(TotalFaults / TotalBoxes) * 100}</div>

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
