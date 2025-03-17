import { LineType } from "./lineTypes";
import { cableTypes } from "./cableTypes";
import { Node } from "./nodes";

export type Connection = {
	from: string;
	to: string;
	label?: string;
	fromDirection: "left" | "right" | "top" | "bottom";
	toDirection: "left" | "right" | "top" | "bottom";
	status1?: "okay" | "tripped" | "unknown" | "unused";
	status2?: "okay" | "tripped" | "unknown" | "unused";
	bendVia?: { x: number; y: number }[];
	middleLineType: LineType; //if undefined, then cableType is used
	fromOffset?: { x: number; y: number };
	toOffset?: { x: number; y: number };
	verticalFrom?: boolean;
	horizontalFrom?: boolean;
	verticalTo?: boolean;
	horizontalTo?: boolean;
	rightAngle?: boolean;
	toAngle?: number;
	fromAngle?: number;
};

export const connections: Connection[] = [
	{
		from: "HBC 1",
		to: "EMS 1 - Zone 1",
		fromDirection: "bottom",
		toDirection: "left",
		status1: "okay",
		status2: "tripped",
		middleLineType: cableTypes.cableType,
		toOffset: { x: 0, y: -160 },
		rightAngle: true,
	},
	{
		from: "HBC 2",
		to: "EMS 1 - Zone 1",
		fromDirection: "bottom",
		toDirection: "left",
		status1: "okay",
		status2: "tripped",
		middleLineType: cableTypes.cableType,
		toOffset: { x: 0, y: -120 },
		rightAngle: true,
	},
	{
		from: "HBC 3",
		to: "EMS 1 - Zone 1",
		fromDirection: "bottom",
		toDirection: "left",
		status1: "okay",
		status2: "tripped",
		middleLineType: cableTypes.cableType,
		toOffset: { x: 0, y: -80 },
		rightAngle: true,
	},
	{
		from: "HBC 4",
		to: "EMS 1 - Zone 1",
		fromDirection: "bottom",
		toDirection: "left",
		status1: "okay",
		status2: "tripped",
		middleLineType: cableTypes.cableType,
		toOffset: { x: 0, y: -40 },
		rightAngle: true,
	},
	{
		from: "HBC 5",
		to: "EMS 1 - Zone 1",
		fromDirection: "bottom",
		toDirection: "left",
		status1: "okay",
		status2: "tripped",
		middleLineType: cableTypes.cableType,
		toOffset: { x: 0, y: 0 },
		rightAngle: true,
	},
	{
		from: "HBC 6",
		to: "EMS 1 - Zone 1",
		fromDirection: "bottom",
		toDirection: "left",
		status1: "okay",
		status2: "tripped",
		middleLineType: cableTypes.cableType,
		toOffset: { x: 0, y: 40 },
		rightAngle: true,
	},
	{
		from: "HBC 7",
		to: "EMS 1 - Zone 1",
		fromDirection: "bottom",
		toDirection: "left",
		status1: "okay",
		status2: "tripped",
		middleLineType: cableTypes.cableType,
		toOffset: { x: 0, y: 80 },
		rightAngle: true,
	},
	{
		from: "HBC 8",
		to: "EMS 1 - Zone 1",
		fromDirection: "bottom",
		toDirection: "left",
		status1: "okay",
		status2: "tripped",
		middleLineType: cableTypes.cableType,
		toOffset: { x: 0, y: 120 },
		rightAngle: true,
	},
	{
		from: "PLC 2",
		to: "EMS 1 - Zone 1",
		fromDirection: "top",
		toDirection: "left",
		status1: "okay",
		status2: "tripped",
		middleLineType: cableTypes.cableType,
		toOffset: { x: 0, y: 160 },
		rightAngle: true,
	},
	{
		from: "PLC 1",
		to: "EMS 1 - Zone 1",
		fromDirection: "top",
		toDirection: "left",
		status1: "okay",
		status2: "tripped",
		middleLineType: cableTypes.cableType,
		rightAngle: true,
		toOffset: { x: 0, y: 200 },
	},
	{
		from: "Wrapper",
		to: "EMS 1 - Zone 2",
		fromDirection: "right",
		toDirection: "top",
		status1: "okay",
		status2: "okay",
		middleLineType: cableTypes.cableType,
		rightAngle: true,
		toOffset: { x: -20, y: 0 },
	},

	{
		from: "PLC 11",
		to: "EMS 3 - Zone 4",
		fromDirection: "bottom",
		toDirection: "top",
		status1: "okay",
		status2: "okay",
		middleLineType: cableTypes.cableType,
		verticalFrom: true,
		verticalTo: true,
	},

	{
		from: "PLC 21",
		to: "EMS 3 - Zone 4",
		fromDirection: "bottom",
		toDirection: "top",
		status1: "okay",
		status2: "tripped",
		middleLineType: cableTypes.cableType,
		verticalFrom: true,
		verticalTo: true,
	},

	{
		from: "PLC 22",
		to: "EMS 3 - Zone 4",
		fromDirection: "bottom",
		toDirection: "top",
		status1: "okay",
		status2: "tripped",
		middleLineType: cableTypes.cableType,
		verticalFrom: true,
		verticalTo: true,
	},
	{
		from: "PLC 23",
		to: "EMS 3 - Zone 4",
		fromDirection: "bottom",
		toDirection: "top",
		status1: "okay",
		status2: "tripped",
		middleLineType: cableTypes.cableType,
		verticalFrom: true,
		verticalTo: true,
	},
	{
		from: "PLC 24",
		to: "EMS 3 - Zone 4",
		fromDirection: "bottom",
		toDirection: "top",
		status1: "okay",
		status2: "tripped",
		middleLineType: cableTypes.cableType,
		verticalFrom: true,
		verticalTo: true,
	},
	{
		from: "AKL 1",
		to: "EMS 3 - Zone 4",
		fromDirection: "bottom",
		toDirection: "top",
		status1: "okay",
		status2: "tripped",
		middleLineType: cableTypes.cableType,
		verticalFrom: true,
		verticalTo: true,
	},
	{
		from: "AKL 2",
		to: "EMS 3 - Zone 4",
		fromDirection: "bottom",
		toDirection: "top",
		status1: "okay",
		status2: "tripped",
		middleLineType: cableTypes.cableType,
		verticalFrom: true,
		verticalTo: true,
	},
	{
		from: "AKL 3",
		to: "EMS 3 - Zone 4",
		fromDirection: "bottom",
		toDirection: "top",
		status1: "okay",
		status2: "tripped",
		middleLineType: cableTypes.cableType,
		verticalFrom: true,
		verticalTo: true,
	},
	{
		from: "AKL 4",
		to: "EMS 3 - Zone 4",
		fromDirection: "bottom",
		toDirection: "top",
		status1: "okay",
		status2: "tripped",
		middleLineType: cableTypes.cableType,
		verticalFrom: true,
		verticalTo: true,
	},
	{
		from: "AKL 5",
		to: "EMS 3 - Zone 4",
		fromDirection: "bottom",
		toDirection: "top",
		status1: "okay",
		status2: "tripped",
		middleLineType: cableTypes.cableType,
		verticalFrom: true,
		verticalTo: true,
	},
	{
		from: "AKL 6",
		to: "EMS 3 - Zone 4",
		fromDirection: "bottom",
		toDirection: "top",
		status1: "okay",
		status2: "tripped",
		middleLineType: cableTypes.cableType,
		verticalFrom: true,
		verticalTo: true,
	},
	{
		from: "AKL 7",
		to: "EMS 3 - Zone 4",
		fromDirection: "bottom",
		toDirection: "top",
		status1: "okay",
		status2: "tripped",
		middleLineType: cableTypes.cableType,
		verticalFrom: true,
		verticalTo: true,
	},
	{
		from: "AKL 8",
		to: "EMS 3 - Zone 4",
		fromDirection: "bottom",
		toDirection: "top",
		status1: "okay",
		status2: "tripped",
		middleLineType: cableTypes.cableType,
		verticalFrom: true,
		verticalTo: true,
	},
	{
		from: "PLC 12",
		to: "EMS 3 - Zone 4",
		fromDirection: "bottom",
		toDirection: "top",
		status1: "okay",
		status2: "tripped",
		middleLineType: cableTypes.cableType,
		verticalFrom: true,
		verticalTo: true,
	},
	{
		from: "PLC 13",
		to: "EMS 3 - Zone 4",
		fromDirection: "left",
		toDirection: "right",
		status1: "okay",
		status2: "tripped",
		middleLineType: cableTypes.cableType,
		horizontalFrom: true,
		horizontalTo: true,
		fromOffset: { x: 0, y: +310 },
	},

	{
		from: "EMS 1 - Zone 2",
		to: "PLC 31",
		fromDirection: "bottom",
		toDirection: "left",
		status1: "okay",
		status2: "tripped",
		middleLineType: cableTypes.cableType,
		rightAngle: true,
		fromOffset: { x: -20, y: 0 },
		toOffset: { x: 0, y: -20 },
	},
	{
		from: "EMS 1 - Zone 1",
		to: "PLC 31",
		fromDirection: "bottom",
		toDirection: "left",
		status1: "okay",
		status2: "tripped",
		middleLineType: cableTypes.cableType,
		rightAngle: true,
		fromOffset: { x: -20, y: 0 },
		toOffset: { x: 0, y: +20 },
	},
	{
		from: "EMS 1 - Zone 2",
		to: "PLC 32",
		fromDirection: "bottom",
		toDirection: "left",
		status1: "okay",
		status2: "tripped",
		middleLineType: cableTypes.cableType,
		rightAngle: true,
		fromOffset: { x: +20, y: 0 },
		toOffset: { x: 0, y: -20 },
	},
	{
		from: "EMS 1 - Zone 1",
		to: "PLC 32",
		fromDirection: "bottom",
		toDirection: "left",
		status1: "okay",
		status2: "tripped",
		middleLineType: cableTypes.cableType,
		rightAngle: true,
		fromOffset: { x: +20, y: 0 },
		toOffset: { x: 0, y: +20 },
	},
	{
		from: "EMS 3 - Zone 4",
		to: "PLC 31",
		fromDirection: "bottom",
		toDirection: "top",
		status1: "okay",
		status2: "tripped",
		middleLineType: cableTypes.cableType,
		fromOffset: { x: -500, y: 0 },
		verticalTo: true,
		verticalFrom: true,
	},
	{
		from: "EMS 3 - Zone 4",
		to: "PLC 32",
		fromDirection: "bottom",
		toDirection: "top",
		status1: "okay",
		status2: "tripped",
		middleLineType: cableTypes.cableType,
		fromOffset: { x: -150, y: 0 },
		verticalTo: true,
		verticalFrom: true,
	},
	{
		from: "EMS 3 - Zone 4",
		to: "Sorter",
		fromDirection: "bottom",
		toDirection: "top",
		status1: "okay",
		status2: "tripped",
		middleLineType: cableTypes.cableType,
		fromOffset: { x: -330, y: 0 },
		verticalTo: true,
		verticalFrom: true,
	},
	{
		from: "EMS 1 - Zone 2",
		to: "EMS 3 - Zone 2",
		fromDirection: "top",
		toDirection: "left",
		status1: "okay",
		bendVia: [{ x: 780, y: 800 }],
		middleLineType: cableTypes.cableType,
		fromOffset: { x: +40, y: 0 },
	},
	{
		from: "EMS 3 - Zone 4",
		to: "EMS 1 - Zone 4",
		fromDirection: "left",
		toDirection: "top",
		status1: "okay",
		bendVia: [{ x: 895, y: 720 }],
		middleLineType: cableTypes.cableType,
	},
];
export function makeConnections(connections: Connection[], nodes: Node[]) {
	//check each connection if it is valid
	connections.forEach((conn) => {
		const fromNode = nodes.find((n) => n.label === conn.from);
		const toNode = nodes.find((n) => n.label === conn.to);

		if (!fromNode || !toNode) {
			console.error("Connection is invalid", conn);
			alert("Connection is invalid");
		}
	});

	return (
		<svg style={{ position: "absolute", width: "2420px", height: "1800px" }}>
			{connections.map((conn, index) => {
				const fromNode = nodes.find((n) => n.label === conn.from);
				const toNode = nodes.find((n) => n.label === conn.to);

				if (!fromNode || !toNode) return null;
				const isDouble = conn.status1 && conn.status2;

				if (!isDouble) {
					let Ax1 = fromNode.x;
					let Ay1 = fromNode.y;
					let Ax2 = toNode.x;
					let Ay2 = toNode.y;

					if (conn.fromDirection === "top") {
						Ax1 = fromNode.x;
						Ay1 = fromNode.y - fromNode.height / 2 + 5;
					}

					if (conn.fromDirection === "bottom") {
						Ax1 = fromNode.x;
						Ay1 = fromNode.y + fromNode.height / 2 - 5;
					}

					if (conn.fromDirection === "right") {
						Ax1 = fromNode.x + fromNode.width / 2 - 5;
						Ay1 = fromNode.y;
					}

					if (conn.fromDirection === "left") {
						Ax1 = fromNode.x - fromNode.width / 2 + 5;
						Ay1 = fromNode.y;
					}

					if (conn.toDirection === "top") {
						Ax2 = toNode.x;
						Ay2 = toNode.y - toNode.height / 2 + 5;
					}

					if (conn.toDirection === "bottom") {
						Ax2 = toNode.x;
						Ay2 = toNode.y + toNode.height / 2 - 5;
					}

					if (conn.toDirection === "left") {
						Ax2 = toNode.x - toNode.width / 2 + 5;
						Ay2 = toNode.y;
					}

					if (conn.toDirection === "right") {
						Ax2 = toNode.x + toNode.width / 2 - 5;
						Ay2 = toNode.y;
					}

					if (conn.fromOffset) {
						Ax1 += conn.fromOffset.x;
						Ay1 += conn.fromOffset.y;
					}

					if (conn.toOffset) {
						Ax2 += conn.toOffset.x;
						Ay2 += conn.toOffset.y;
					}

					if (conn.verticalFrom) {
						Ax2 = Ax1;
					}
					if (conn.horizontalFrom) {
						Ay2 = Ay1;
					}
					if (conn.verticalTo) {
						Ax1 = Ax2;
					}
					if (conn.horizontalTo) {
						Ay1 = Ay2;
					}

					let points = [
						{ x: Ax1, y: Ay1 },
						...(conn.bendVia || []),
						{ x: Ax2, y: Ay2 },
					];

					if (conn.rightAngle) {
						points = [
							{ x: Ax1, y: Ay1 },
							{ x: Ax1, y: Ay2 - 10 },

							{ x: Ax1, y: Ay2 },
							{ x: Ax1 + 10, y: Ay2 },

							{ x: Ax2, y: Ay2 },
						];
					}

					let angleA = 0;
					let angleB = 0;

					if (conn.fromDirection === "top") {
						angleA = 270;
					}
					if (conn.fromDirection === "bottom") {
						angleA = 270;
					}
					if (conn.fromDirection === "right") {
						angleA = 0;
					}
					if (conn.fromDirection === "left") {
						angleA = 180;
					}

					if (conn.toDirection === "top") {
						angleB = 90;
					}
					if (conn.toDirection === "bottom") {
						angleB = 270;
					}

					if (conn.toDirection === "right") {
						angleB = 180;
					}
					if (conn.toDirection === "left") {
						angleB = 0;
					}

					return [
						makeLineSegment(
							points,
							conn,
							conn.status1 === "okay" ? "#00ff00" : "#ff0000"
						),

						// eslint-disable-next-line react/jsx-key
						<polygon
							fill={conn.status1 === "okay" ? "#00ff00" : "#ff0000"}
							points={`${Ax1 - 10},${Ay1 - 10} ${Ax1 + 10},${Ay1} ${Ax1 - 10},${Ay1 + 10}`}
							transform={`rotate(${angleA}, ${Ax1}, ${Ay1})`}
						/>,
						// eslint-disable-next-line react/jsx-key
						<polygon
							fill={conn.status1 === "okay" ? "#00ff00" : "#ff0000"}
							points={`${Ax2 - 10},${Ay2 - 10} ${Ax2 + 10},${Ay2} ${Ax2 - 10},${Ay2 + 10}`}
							transform={`rotate(${angleB}, ${Ax2}, ${Ay2})`}
						/>,
					];
				} else {
					let Ax1 = fromNode.x;
					let Ay1 = fromNode.y;
					let Ax2 = toNode.x;
					let Ay2 = toNode.y;
					let Bx1 = fromNode.x;
					let By1 = fromNode.y;
					let Bx2 = toNode.x;
					let By2 = toNode.y;

					if (conn.fromDirection === "top") {
						Ax1 = fromNode.x - 10;
						Ay1 = fromNode.y - fromNode.height / 2 + 5;
						Bx1 = fromNode.x + 10;
						By1 = fromNode.y - fromNode.height / 2 + 5;
					}

					if (conn.fromDirection === "bottom") {
						Ax1 = fromNode.x - 10;
						Ay1 = fromNode.y + fromNode.height / 2 - 5;
						Bx1 = fromNode.x + 10;
						By1 = fromNode.y + fromNode.height / 2 - 5;
					}

					if (conn.fromDirection === "right") {
						Ax1 = fromNode.x + fromNode.width / 2 - 5;
						Ay1 = fromNode.y - 10;
						Bx1 = fromNode.x + fromNode.width / 2 - 5;
						By1 = fromNode.y + 10;
					}

					if (conn.fromDirection === "left") {
						Ax1 = fromNode.x - fromNode.width / 2 + 5;
						Ay1 = fromNode.y - 10;
						Bx1 = fromNode.x - fromNode.width / 2 + 5;
						By1 = fromNode.y + 10;
					}

					if (conn.toDirection === "top") {
						Ax2 = toNode.x - 10;
						Ay2 = toNode.y - toNode.height / 2 + 5;
						Bx2 = toNode.x + 10;
						By2 = toNode.y - toNode.height / 2 + 5;
					}

					if (conn.toDirection === "bottom") {
						Ax2 = toNode.x - 10;
						Ay2 = toNode.y + toNode.height / 2 - 5;
						Bx2 = toNode.x + 10;
						By2 = toNode.y + toNode.height / 2 - 5;
					}

					if (conn.toDirection === "left") {
						Ax2 = toNode.x - toNode.width / 2 + 5;
						Ay2 = toNode.y - 10;
						Bx2 = toNode.x - toNode.width / 2 + 5;
						By2 = toNode.y + 10;
					}

					if (conn.toDirection === "right") {
						Ax2 = toNode.x + toNode.width / 2 - 5;
						Ay2 = toNode.y - 10;
						Bx2 = toNode.x + toNode.width / 2 - 5;
						By2 = toNode.y + 10;
					}

					if (conn.fromOffset) {
						Ax1 += conn.fromOffset.x;
						Ay1 += conn.fromOffset.y;
						Bx1 += conn.fromOffset.x;
						By1 += conn.fromOffset.y;
					}

					if (conn.toOffset) {
						Ax2 += conn.toOffset.x;
						Ay2 += conn.toOffset.y;
						Bx2 += conn.toOffset.x;
						By2 += conn.toOffset.y;
					}

					if (conn.verticalFrom) {
						Ax2 = Ax1;
						Bx2 = Bx1;
					}
					if (conn.horizontalFrom) {
						Ay2 = Ay1;
						By2 = By1;
					}
					if (conn.verticalTo) {
						Ax1 = Ax2;
						Bx1 = Bx2;
					}
					if (conn.horizontalTo) {
						Ay1 = Ay2;
						By1 = By2;
					}

					let pointsA = [
						{ x: Ax1, y: Ay1 },
						...(conn.bendVia || []),
						{ x: Ax2, y: Ay2 },
					];

					let pointsB = [
						{ x: Bx1, y: By1 },
						...(conn.bendVia || []),
						{ x: Bx2, y: By2 },
					];

					let angleA = 0;
					let angleB = 0;

					if (conn.rightAngle && conn.fromDirection === "bottom") {
						const middleX = (Ax1 + Bx1) / 2;
						const middleY = (Ay2 + By2) / 2;

						angleA = 270;

						pointsA = [
							{ x: Ax1, y: Ay1 },
							{ x: Ax1, y: Ay1 + 20 },
							{ x: middleX, y: Ay1 + 40 },
							{ x: middleX, y: middleY },
							{ x: Ax2 - 40, y: middleY },
							{ x: Ax2 - 20, y: Ay2 },
							{ x: Ax2, y: Ay2 },
						];

						pointsB = [
							{ x: Bx1, y: By1 },
							{ x: Bx1, y: By1 + 20 },
							{ x: middleX, y: By1 + 40 },
							{ x: middleX, y: middleY },
							{ x: Bx2 - 40, y: middleY },
							{ x: Bx2 - 20, y: By2 },
							{ x: Bx2, y: By2 },
						];
					} else if (conn.rightAngle && conn.fromDirection === "top") {
						const middleX = (Ax1 + Bx1) / 2;
						const middleY = (Ay2 + By2) / 2;

						angleA = 90;

						pointsA = [
							{ x: Ax1, y: Ay1 },
							{ x: Ax1, y: Ay1 - 20 },
							{ x: middleX, y: Ay1 - 40 },
							{ x: middleX, y: middleY },
							{ x: Ax2 - 40, y: middleY },
							{ x: Ax2 - 20, y: Ay2 },
							{ x: Ax2, y: Ay2 },
						];

						pointsB = [
							{ x: Bx1, y: By1 },
							{ x: Bx1, y: By1 - 20 },
							{ x: middleX, y: By1 - 40 },
							{ x: middleX, y: middleY },
							{ x: Bx2 - 40, y: middleY },
							{ x: Bx2 - 20, y: By2 },
							{ x: Bx2, y: By2 },
						];
					} else if (
						conn.rightAngle &&
						conn.fromDirection === "right" &&
						conn.toDirection === "top"
					) {
						const middleX = (Ax2 + Bx2) / 2;
						const middleY = (Ay1 + By1) / 2;

						angleA = 0;
						angleB = 90;

						pointsA = [
							{ x: Ax1, y: Ay1 },
							{ x: Ax1 + 20, y: Ay1 },
							{ x: Ax1 + 40, y: middleY },
							{ x: middleX, y: middleY },
							{ x: middleX, y: Ay2 - 40 },
							{ x: Ax2, y: Ay2 - 20 },
							{ x: Ax2, y: Ay2 },
						];

						pointsB = [
							{ x: Bx1, y: By1 },
							{ x: Bx1 + 20, y: By1 },
							{ x: Ax1 + 40, y: middleY },
							{ x: middleX, y: middleY },
							{ x: middleX, y: Ay2 - 40 },
							{ x: Bx2, y: By2 - 20 },
							{ x: Bx2, y: By2 },
						];
					} else if (!conn.rightAngle && conn.fromDirection === "bottom") {
						const middleX = (Ax1 + Bx1) / 2;
						const middleY = (Ay2 + By2) / 2;

						pointsA = [
							{ x: Ax1, y: Ay1 },
							{ x: Ax1, y: Ay1 + 20 },
							{ x: middleX, y: Ay1 + 25 },
							{ x: middleX, y: Ay2 - 25 },
							{ x: Ax2, y: Ay2 - 20 },
							{ x: Ax2, y: Ay2 },
						];

						pointsB = [
							{ x: Bx1, y: By1 },
							{ x: Bx1, y: By1 + 20 },
							{ x: middleX, y: By1 + 25 },
							{ x: middleX, y: By2 - 25 },
							{ x: Bx2, y: By2 - 20 },
							{ x: Bx2, y: By2 },
						];
					} else if (!conn.rightAngle && conn.fromDirection === "top") {
						const middleX = (Ax1 + Bx1) / 2;
						const middleY = (Ay2 + By2) / 2;

						pointsA = [
							{ x: Ax1, y: Ay1 },
							{ x: Ax1, y: Ay1 - 20 },
							{ x: middleX, y: Ay1 - 25 },
							{ x: middleX, y: Ay2 + 25 },
							{ x: Ax2, y: Ay2 + 20 },
							{ x: Ax2, y: Ay2 },
						];

						pointsB = [
							{ x: Bx1, y: By1 },
							{ x: Bx1, y: By1 - 20 },
							{ x: middleX, y: By1 - 25 },
							{ x: middleX, y: By2 + 25 },
							{ x: Bx2, y: By2 + 20 },
							{ x: Bx2, y: By2 },
						];
					} else if (!conn.rightAngle && conn.fromDirection === "right") {
						const middleX = (Ax1 + Bx1) / 2;
						const middleY = (Ay2 + By2) / 2;

						pointsA = [
							{ x: Ax1, y: Ay1 },
							{ x: Ax1 + 20, y: Ay1 },
							{ x: middleX + 25, y: Ay1 },
							{ x: middleX + 25, y: middleY },
							{ x: Ax2 - 25, y: middleY },
							{ x: Ax2 - 20, y: Ay2 },
							{ x: Ax2, y: Ay2 },
						];

						pointsB = [
							{ x: Bx1, y: By1 },
							{ x: Bx1 + 20, y: By1 },
							{ x: middleX + 25, y: By1 },
							{ x: middleX + 25, y: middleY },
							{ x: Bx2 - 25, y: middleY },
							{ x: Bx2 - 20, y: By2 },
							{ x: Bx2, y: By2 },
						];
					} else if (!conn.rightAngle && conn.fromDirection === "left") {
						const middleX = (Ax1 + Bx1) / 2;
						const middleY = (Ay2 + By2) / 2;

						pointsA = [
							{ x: Ax1, y: Ay1 },
							{ x: Ax1 - 20, y: Ay1 },
							{ x: middleX - 25, y: Ay1 },
							{ x: middleX - 25, y: middleY },
							{ x: Ax2 + 25, y: middleY },
							{ x: Ax2 + 20, y: Ay2 },
							{ x: Ax2, y: Ay2 },
						];

						pointsB = [
							{ x: Bx1, y: By1 },
							{ x: Bx1 - 20, y: By1 },
							{ x: middleX - 25, y: By1 },
							{ x: middleX - 25, y: middleY },
							{ x: Bx2 + 25, y: middleY },
							{ x: Bx2 + 20, y: By2 },
							{ x: Bx2, y: By2 },
						];
					}

					if (conn.verticalFrom && conn.toDirection === "bottom") {
						angleA = 90;
					}
					if (conn.verticalFrom && conn.toDirection === "top") {
						angleA = 270;
					}

					if (conn.verticalTo && conn.fromDirection == "bottom") {
						angleB = 90;
					}
					if (conn.verticalTo && conn.fromDirection == "top") {
						angleB = 270;
					}

					if (conn.horizontalFrom && conn.toDirection === "right") {
						angleA = 0;
					}
					if (conn.horizontalFrom && conn.toDirection === "left") {
						angleA = 180;
					}

					if (conn.horizontalTo && conn.fromDirection === "right") {
						angleB = 0;
					}
					if (conn.horizontalTo && conn.fromDirection === "left") {
						angleB = 180;
					}

					return [
						makeLineSegment(
							pointsA,
							conn,
							conn.status1 === "okay" ? "#00ff00" : "red"
						),
						makeLineSegment(
							pointsB,
							conn,
							conn.status2 === "okay" ? "#00ff00" : "red"
						),
						addLabel(
							(conn.fromDirection === "top" ||
								conn.fromDirection === "bottom") &&
								(conn.toDirection === "top" || conn.toDirection === "bottom"),
							{ x: (Ax1 + Ax2) / 2, y: (Ay1 + Ay2) / 2 },
							conn.label
						),

						// eslint-disable-next-line react/jsx-key
						<polygon
							fill={conn.status1 === "okay" ? "#00ff00" : "red"}
							points={`${Ax1 - 10},${Ay1 - 10} ${Ax1 + 10},${Ay1} ${Ax1 - 10},${Ay1 + 10}`}
							transform={`rotate(${angleA}, ${Ax1}, ${Ay1})`}
						/>,

						// eslint-disable-next-line react/jsx-key
						<polygon
							fill={conn.status2 === "okay" ? "#00ff00" : "red"}
							points={`${Bx2 - 10},${By2 - 10} ${Bx2 + 10},${By2} ${Bx2 - 10},${By2 + 10}`}
							transform={`rotate(${angleB}, ${Bx2}, ${By2})`}
						/>,
						// eslint-disable-next-line react/jsx-key
						<polygon
							fill={conn.status2 === "okay" ? "#00ff00" : "red"}
							points={`${Bx1 - 10},${By1 - 10} ${Bx1 + 10},${By1} ${Bx1 - 10},${By1 + 10}`}
							transform={`rotate(${angleA - 180}, ${Bx1}, ${By1})`}
						/>,
						// eslint-disable-next-line react/jsx-key
						<polygon
							fill={conn.status1 === "okay" ? "#00ff00" : "red"}
							points={`${Ax2 - 10},${Ay2 - 10} ${Ax2 + 10},${Ay2} ${Ax2 - 10},${Ay2 + 10}`}
							transform={`rotate(${angleB - 180}, ${Ax2}, ${Ay2})`}
						/>,
					];
				}
			})}
		</svg>
	);
}
function makeLineSegment(
	points: { x: number; y: number }[],
	conn: Connection,
	Colour: string
): React.JSX.Element | (React.JSX.Element | null)[] | null {
	return points.map((point, i) => {
		if (i === points.length - 1) return null;
		const nextPoint = points[i + 1];

		if (
			i === 0 ||
			i === points.length - 2 ||
			conn.middleLineType === undefined
		) {
			return (
				<line
					key={`${conn.from + conn.to}-${i}`}
					stroke={Colour}
					strokeWidth="5"
					x1={point.x}
					x2={nextPoint.x}
					y1={point.y}
					y2={nextPoint.y}
				/>
			);
		}

		console.log(conn.middleLineType);

		return (
			<line
				key={`${conn.from + conn.to}-${i}`}
				stroke={conn.middleLineType.Colour}
				strokeDasharray={conn.middleLineType.type}
				strokeWidth={conn.middleLineType.Width}
				x1={point.x}
				x2={nextPoint.x}
				y1={point.y}
				y2={nextPoint.y}
			/>
		);
	});
}

function addLabel(
	vertical: boolean,
	position: { x: number; y: number },
	label?: string
) {
	if (!label) return null;

	return (
		<text
			key="label"
			dy={vertical ? "-1em" : "1em"}
			fontSize="20"
			textAnchor="middle"
			x={position.x}
			y={position.y}
		>
			{label}
		</text>
	);
}
