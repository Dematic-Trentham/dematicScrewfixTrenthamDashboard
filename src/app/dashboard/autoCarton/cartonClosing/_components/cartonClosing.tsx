import React from "react";
import PanelSmall from "@/components/panels/panelSmall";
import { FaArrowsDownToLine } from "react-icons/fa6";
import HorizontalBar from "@/components/visual/horizontalBar";
import ccPanel from "./ccPanel";
import CCPanel from "./ccPanel";

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
						name="iPack"
						faults={data[lineNumber]["iPack"] || []}
						onClickLink={`/dashboard/autoCarton/cartonClosing/iPack${lineNumber}`}
					/>
				)}
				{hasLidder && (
					<CCPanel
						accentColor="red"
						name="Lidder"
						faults={data[lineNumber]["Lidder"]|| []}
						onClickLink={`/dashboard/autoCarton/cartonClosing/lidder${lineNumber}`}
					/>
				)}
				{haslabeler && (
					<CCPanel
						accentColor="blue"
						name="Labeler"
						faults={data[lineNumber]["Labeler"] || []}
						onClickLink={`/dashboard/autoCarton/cartonClosing/labeler${lineNumber}`}
					/>
				)}
				
			</div>
		</div>
	);
};

export default CartonClosingComponent;
