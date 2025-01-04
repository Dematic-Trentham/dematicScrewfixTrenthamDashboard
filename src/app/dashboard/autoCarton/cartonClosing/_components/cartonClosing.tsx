import React from "react";
import { FaArrowsDownToLine } from "react-icons/fa6";

import ccPanel from "./ccPanel";
import CCPanel from "./ccPanel";

import HorizontalBar from "@/components/visual/horizontalBar";
import PanelSmall from "@/components/panels/panelSmall";

interface CartonClosingComponentProps {
	lineNumber: number;
	hasLidder: boolean;
	hasiPack: boolean;
	haslabeler: boolean;
	data: any;
}

const CartonClosingComponent: React.FC<CartonClosingComponentProps> = ({
	lineNumber: lineNumber,
	hasLidder,
	hasiPack,
	haslabeler,
	data,
}) => {
	return (
		<div className="flex flex-col">
			<p className="self-center text-4xl">Line {lineNumber}</p>
			<div className="flex flex-col">
				{hasiPack && (
					<CCPanel
						accentColor="green"
						faults={data[lineNumber]["iPack"] || []}
						name="iPack"
						onClickLink={`/dashboard/autoCarton/cartonClosing/iPack${lineNumber}`}
					/>
				)}
				{hasLidder && (
					<CCPanel
						accentColor="red"
						faults={data[lineNumber]["Lidder"] || []}
						name="Lidder"
						onClickLink={`/dashboard/autoCarton/cartonClosing/lidder${lineNumber}`}
					/>
				)}
				{haslabeler && (
					<CCPanel
						accentColor="blue"
						faults={data[lineNumber]["Labeler"] || []}
						name="Labeler"
						onClickLink={`/dashboard/autoCarton/cartonClosing/labeler${lineNumber}`}
					/>
				)}
			</div>
		</div>
	);
};

export default CartonClosingComponent;
