import React from "react";

import CCPanel from "./../../cartonClosing/_components/ccPanel";

interface CartonClosingComponentProps {
	lineNumber: string;
	hasErector: boolean;
	hasBarcoder: boolean;
	dataold: any;
	data: any;
	timeRange: string;
}

const CartonClosingComponent: React.FC<CartonClosingComponentProps> = ({
	lineNumber: lineNumber,
	hasErector,
	hasBarcoder,
	dataold,
	data,
	timeRange,
}) => {
	//if we dont have the line number in the data, we need to set it to an empty object
	if (!data[lineNumber]) {
		data[lineNumber] = {};
	}

	//if we dont have any data for the lidder, ipack, or labeler, but we have the haslidder, hasipack, or haslabeler set to true, we need to set the data to an empty array
	if (!data[lineNumber]["erector"] && hasErector) {
		data[lineNumber]["erector"] = { faults: [], timeStamp: new Date() };
	}
	if (!data[lineNumber]["barcoder"] && hasBarcoder) {
		data[lineNumber]["barcoder"] = { faults: [], timeStamp: new Date() };
	}

	return (
		<div className="flex w-96 flex-col">
			<p className="self-center text-4xl">Line {lineNumber}</p>
			<div className="flex flex-col">
				{hasErector && (
					<CCPanel
						accentColor="green"
						faults={data[lineNumber]["erector"] || []}
						name="Erector"
						onClickLink={`/dashboard/autoCarton/details/erector${lineNumber}?returnURL=cartonLaunch&timeRange=${timeRange}`}
					/>
				)}
				{hasBarcoder && (
					<CCPanel
						accentColor="red"
						faults={dataold[lineNumber]["barcoder"] || []}
						name="Barcoder"
						onClickLink={`/dashboard/autoCarton/details/barcoder${lineNumber}?returnURL=cartonLaunch&timeRange=${timeRange}`}
					/>
				)}
			</div>
		</div>
	);
};

export default CartonClosingComponent;
