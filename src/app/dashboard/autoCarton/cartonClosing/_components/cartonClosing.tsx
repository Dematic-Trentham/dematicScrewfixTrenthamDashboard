import React from "react";
import { FaArrowsDownToLine } from "react-icons/fa6";
import { compareSync } from "bcrypt";

import ccPanel from "./ccPanel";
import CCPanel from "./ccPanel";

import HorizontalBar from "@/components/visual/horizontalBar";
import PanelSmall from "@/components/panels/panelSmall";

interface CartonClosingComponentProps {
	lineNumber: string;
	hasLidder: boolean;
	hasiPack: boolean;
	haslabeler: boolean;
	dataold: any;
	data: any;
	timeRange: string;
}

const CartonClosingComponent: React.FC<CartonClosingComponentProps> = ({
	lineNumber: lineNumber,
	hasLidder,
	hasiPack,
	haslabeler,
	dataold,
	data,
	timeRange,
}) => {
	//if we dont have the line number in the data, we need to set it to an empty object
	if (!data[lineNumber]) {
		data[lineNumber] = {};
	}

	//if we dont have any data for the lidder, ipack, or labeler, but we have the haslidder, hasipack, or haslabeler set to true, we need to set the data to an empty array
	if (!data[lineNumber]["iPack"] && hasiPack) {
		data[lineNumber]["iPack"] = { faults: [], timeStamp: new Date() };
	}
	if (!data[lineNumber]["Lidder"] && hasLidder) {
		data[lineNumber]["Lidder"] = { faults: [], timeStamp: new Date() };
	}

	if (!dataold[lineNumber]["Labeler"] && haslabeler) {
		dataold[lineNumber]["Labeler"] = { faults: [], timeStamp: new Date() };
	}

	return (
		<div className="flex w-96 flex-col">
			<p className="self-center text-4xl">Line {lineNumber}</p>
			<div className="flex flex-col">
				{hasiPack && (
					<CCPanel
						accentColor="green"
						faults={data[lineNumber]["iPack"] || []}
						name="iPack"
						onClickLink={`/dashboard/autoCarton/details/iPack${lineNumber}?returnURL=cartonClosing&timeRange=${timeRange}`}
					/>
				)}
				{hasLidder && (
					<CCPanel
						accentColor="red"
						faults={data[lineNumber]["Lidder"] || []}
						name="Lidder"
						onClickLink={`/dashboard/autoCarton/details/lidder${lineNumber}?returnURL=cartonClosing&timeRange=${timeRange}`}
					/>
				)}
				{haslabeler && (
					<CCPanel
						accentColor="blue"
						faults={dataold[lineNumber]["Labeler"] || []}
						name="Labeler"
						onClickLink={`/dashboard/autoCarton/details/labeler${lineNumber}?returnURL=cartonClosing&timeRange=${timeRange}`}
					/>
				)}
			</div>
		</div>
	);
};

export default CartonClosingComponent;
