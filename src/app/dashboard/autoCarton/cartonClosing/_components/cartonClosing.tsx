import React from "react";

import CCPanel from "./ccPanel";

interface CartonClosingComponentProps {
	lineNumber: string;
	hasLidder: boolean;
	hasiPack: boolean;
	haslabeler: boolean;
	dataold: any;
	data: any;
	timeRange: string;
	onlyBoxes?: boolean;
}

const CartonClosingComponent: React.FC<CartonClosingComponentProps> = ({
	lineNumber: lineNumber,
	hasLidder,
	hasiPack,
	haslabeler,
	dataold,
	data,
	timeRange,
	onlyBoxes,
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
						faults={data[lineNumber]["iPack"] || []}
						name="iPack"
						onlyBoxes={onlyBoxes}
						onClickLink={`/dashboard/autoCarton/details/iPack${lineNumber}?returnURL=cartonClosing&timeRange=${timeRange}`}
					/>
				)}
				{hasLidder && (
					<CCPanel
						faults={data[lineNumber]["Lidder"] || []}
						name="Lidder"
						onlyBoxes={onlyBoxes}
						onClickLink={`/dashboard/autoCarton/details/lidder${lineNumber}?returnURL=cartonClosing&timeRange=${timeRange}`}
					/>
				)}
				{haslabeler && (
					<CCPanel
						faults={dataold[lineNumber]["Labeler"] || []}
						name="Labeler"
						onlyBoxes={onlyBoxes}
						onClickLink={`/dashboard/autoCarton/details/labeler${lineNumber}?returnURL=cartonClosing&timeRange=${timeRange}`}
					/>
				)}
			</div>
		</div>
	);
};

export default CartonClosingComponent;
