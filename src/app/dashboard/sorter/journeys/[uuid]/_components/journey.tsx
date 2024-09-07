"use client";
import React from "react";

import JourneyLine from "./journeyLine";

interface JourneyProps {
	journeyObject: {
		UL: string;
		areaSensorLine: string;
		cellNumber: string;
		chuteNumber: string;
		inductNumber: string;
		journeyLines: string[];
		offloadTime: string;
		rejectReason: string;
		weight: string;
	};
}

const Journey: React.FC<JourneyProps> = (props) => {
	const parcelWidth = props.journeyObject.areaSensorLine
		.split("w=")[1]
		.split(" ")[0];
	const parcelLength = props.journeyObject.areaSensorLine
		.split("l=")[1]
		.split(" ")[0];
	const parcelPos = props.journeyObject.areaSensorLine
		.split("pos=")[1]
		.split(" ")[0];
	const parcelE_disp = props.journeyObject.areaSensorLine
		.split("e_disp=")[1]
		.split(" ")[0];
	const parcelr_disp = props.journeyObject.areaSensorLine
		.split("r_disp=")[1]
		.split(" ")[0];
	const parcelCtype = props.journeyObject.areaSensorLine
		.split("ctype=")[1]
		.split(" ")[0];

	const [useRaw, setUseRaw] = React.useState(false);

	return (
		<div className="rounded-md border-1 border-black p-2">
			<div className="flex flex-row justify-evenly">
				<div className="w-80 rounded-md border-1 border-black p-2">
					<div>Cell Number: {props.journeyObject.cellNumber}</div>
					<div>Chute Number: {props.journeyObject.chuteNumber}</div>
					<div>Induct Number: {props.journeyObject.inductNumber}</div>
					<div>Weight: {props.journeyObject.weight}</div>
					<div>
						Reject Reason:{" "}
						{convertRejectReason(props.journeyObject.rejectReason)}
					</div>
				</div>
				<div className="w-80 rounded-md border-1 border-black p-2">
					<div>Parcel Info</div>
					<div className="grid grid-cols-3 gap-4">
						<div>Width: {parcelWidth}</div>
						<div>Length: {parcelLength}</div>
						<div>Position: {parcelPos}</div>
						<div>E_disp: {parcelE_disp}</div>
						<div>R_disp: {parcelr_disp}</div>
						<div>Ctype: {parcelCtype}</div>
					</div>
				</div>
			</div>
			<br />
			<div className="flex flex-row space-x-2">
				<input
					checked={useRaw}
					id="useRaw"
					type="checkbox"
					onChange={() => setUseRaw(!useRaw)}
				/>
				<label htmlFor="useRaw">Raw Trace File</label>
			</div>

			<table className="w-full rounded-sm border-1 p-2">
				<thead>
					<tr>
						<th>Trace file Lines</th>
					</tr>
				</thead>
				<tbody>
					{props.journeyObject.journeyLines.map((line, index) => (
						<tr
							key={index}
							className={index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"}
						>
							<td>
								<JourneyLine line={line} raw={useRaw} />
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default Journey;

function convertRejectReason(rejectReason: string) {
	switch (rejectReason) {
		case "0x0":
			return "Okay ( 0x0 )";
		case "0x1000":
			return "Bad Position (  0x1000 )";
		case "0x800":
			return "WMS Decision ( 0x800 )";
		default:
			return "Unknown ( " + rejectReason + " )";
	}
}
