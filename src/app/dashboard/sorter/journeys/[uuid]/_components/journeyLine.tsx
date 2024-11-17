"use client";
import React from "react";

interface JourneyLineProps {
	line: string;
	raw: boolean;
}

const JourneyLine: React.FC<JourneyLineProps> = (props) => {
	// Implement your component logic here
	const hover = (
		<div className="rounded-md bg-slate-500 p-2 text-white">
			<div>Time: {decodeTraceLine(props.line).time}</div>
			<div>Message Number: {decodeTraceLine(props.line).messageNumber}</div>
			<div>Message Type: {decodeTraceLine(props.line).messageType}</div>
			<div>
				Message Type Station: {decodeTraceLine(props.line).messageTypeStation}
			</div>
		</div>
	);

	if (props.raw) {
		return <div className="hover:bg-yellow-300">{props.line}</div>;
	}

	let bg = "";

	if (decodeTraceLine(props.line).explained) {
		bg = "bg-green-200";
	}

	return (
		<div className={`hover:bg-yellow-300 ${bg}`}>
			{decodeTraceLine(props.line).decodedLine}
		</div>
	);
};

export default JourneyLine;

const decodeTraceLine = (traceLine: string) => {
	let decodedLine = "";

	//(hh:mm:ss:ms)xxxxx
	const time = traceLine.slice(1, 13);

	decodedLine += time + " : ";

	const messageNumber = traceLine.slice(15, 20);

	const messageType = traceLine.split(")")[2].split(" ")[0];

	const messageTypeStation = traceLine
		.split(")")[2]
		.split(" ")[1]
		.split(":")[0];

	let explain = "";

	explain += checkLoadMGN(messageType, traceLine, messageTypeStation);
	explain += checkRouting(messageType, traceLine, messageTypeStation);
	explain += checkPH1(messageType, traceLine, messageTypeStation);
	explain += checkOFFMGN(messageType, traceLine, messageTypeStation);

	decodedLine += explain;

	let explained = true;

	if (explain === "") {
		explained = false;
		decodedLine = traceLine;
	}

	return {
		decodedLine,
		time,
		messageNumber,
		messageType,
		messageTypeStation,
		explained,
	};
};

function checkLoadMGN(
	messageType: string,
	traceLine: string,
	messageTypeStation: string
) {
	let explain = "";

	if (messageType === "LOADMGM") {
		const cell = traceLine.split("cell=")[1].split(" ")[0];

		explain = `Induct ${messageTypeStation} has loaded the parcel on to cell ${cell}`;
	}

	return explain;
}

function checkRouting(
	messageType: string,
	traceLine: string,

	messageTypeStation: string
) {
	let explain = "";

	if (messageType === "ROUTING") {
		const cell = traceLine.includes("Cell=")
			? traceLine.split("Cell=")[1].split(" ")[0]
			: "0";

		if (traceLine.includes("DSCHUTEREQ")) {
			explain = `The sorter has requested a chute for the parcel on cell ${cell}`;
		}

		if (traceLine.includes("M_DSCHUTEANSW")) {
			const chute = traceLine.split("ch=")[1].split(" ")[0];
			const weight = traceLine.split("wg=")[1].split(" ")[0];

			explain = `The warehouse control system has assigned a chute for the parcel on cell ${cell}. The chute is ${chute} and the weight is ${weight}`;
		}

		if (traceLine.includes("TXED M_DSPARCRES")) {
			const ul = traceLine.split("code=<")[1].split(">")[0];
			const chute = traceLine.split("ch=")[1].split(" ")[0];

			explain = `The sorter has sent a message to the warehouse control system to update it that ${ul} has been delivered to ${chute}.`;
		}
	}

	return explain;
}

function checkPH1(
	messageType: string,
	traceLine: string,

	messageTypeStation: string
) {
	let explain = "";

	if (messageType === "PH1MGM") {
	}

	return explain;
}

function checkOFFMGN(
	messageType: string,
	traceLine: string,
	messageTypeStation: string
) {
	let explain = "";

	if (messageType === "OFFLVER") {
		if (traceLine.includes("<cellver_parcel_not_on_cell>")) {
			const cell = traceLine.split("cell=")[1].split(" ")[0];

			explain = `The offload verification station ${messageTypeStation} has detected that the parcel on cell ${cell} is not on the cell as expected`;
		}
	}

	//console.log(messageType);

	if (messageType === "OFFLMGM:<check_cons_cells>") {
		//console.log(traceLine);
		if (
			traceLine.includes("<check_cons_cells>") &&
			traceLine.includes("blocked by")
		) {
			const previousCell = traceLine.split("Cell=")[1].split(" ")[0];
			const chute = traceLine.split("Chute=")[1].split(" ")[0];

			explain = `The offloading has been canceled for this lap as the previous cell ${previousCell} has just offloaded to chute ${chute}`;
		}

		if (
			traceLine.includes("<check_cons_cells>") &&
			traceLine.includes("last_off=")
		) {
			const chute = traceLine.split("last_off=")[1].split(" ")[0];

			explain = `The offloading has been canceled for this lap as the previous cell has just offloaded to chute ${chute}`;
		}
	}

	return explain;
}
