export type Node = {
	x: number;
	y: number;
	label: string;
	width: number;
	height: number;
	textRotation?: string;
};

export const nodes = [
	//BK25
	{
		x: 200,
		y: 1500,
		label: "PLC 2",
		width: 150,
		height: 150,
	},

	//High Bay Cranes
	{
		x: 50,
		y: 410,
		label: "HBC 8",
		width: 50,
		height: 800,
	},
	{
		x: 110,
		y: 410,
		label: "HBC 7",
		width: 50,
		height: 800,
	},
	{
		x: 170,
		y: 410,
		label: "HBC 6",
		width: 50,
		height: 800,
	},
	{
		x: 230,
		y: 410,
		label: "HBC 5",
		width: 50,
		height: 800,
	},
	{
		x: 290,
		y: 410,
		label: "HBC 4",
		width: 50,
		height: 800,
	},
	{
		x: 350,
		y: 410,
		label: "HBC 3",
		width: 50,
		height: 800,
	},
	{
		x: 410,
		y: 410,
		label: "HBC 2",
		width: 50,
		height: 800,
	},
	{
		x: 470,
		y: 410,
		label: "HBC 1",
		width: 50,
		height: 800,
	},
	//EMS 1 - Zone 1,2,4
	{
		x: 585,
		y: 1135,
		label: "EMS 1 - Zone 1",
		width: 150,
		height: 450,
		textRotation: "90",
	},
	{
		x: 740,
		y: 1135,
		label: "EMS 1 - Zone 2",
		width: 150,
		height: 450,
		textRotation: "90",
	},
	{
		x: 895,
		y: 1135,
		label: "EMS 1 - Zone 4",
		width: 150,
		height: 450,
		textRotation: "90",
	},
	// {
	// 	x: 1030,
	// 	y: 1110,
	// 	label: "EMS 2 - Zone 3",
	// 	width: 75,
	// 	height: 400,
	// 	textRotation: "90",
	// },
	// {
	// 	x: 1110,
	// 	y: 1110,
	// 	label: "EMS 2 - Zone 5",
	// 	width: 75,
	// 	height: 400,
	// 	textRotation: "90",
	// },
	{
		x: 1950,
		y: 800,
		label: "EMS 3 - Zone 2",
		width: 600,
		height: 75,
		textRotation: "0",
	},
	{
		x: 1650,
		y: 720,
		label: "EMS 3 - Zone 4",
		width: 1200,
		height: 75,
		textRotation: "0",
	},

	//PLC 1
	{ x: 400, y: 1500, label: "PLC 1", width: 150, height: 150 },

	//sorter
	{ x: 1320, y: 1100, label: "Sorter", width: 150, height: 150 },
	//wrapper
	{ x: 585, y: 690, label: "Wrapper", width: 150, height: 150 },

	{ x: 1300, y: 310, label: "AKL 1", width: 50, height: 500 },
	{
		x: 1360,
		y: 310,
		label: "PLC 21",
		width: 50,
		height: 600,
	},
	{
		x: 1420,
		y: 310,
		label: "AKL 2",
		width: 50,
		height: 500,
	},
	{
		x: 1480,
		y: 310,
		label: "AKL 3",
		width: 50,
		height: 500,
	},
	{
		x: 1540,
		y: 310,
		label: "PLC 22",
		width: 50,
		height: 600,
	},
	{
		x: 1600,
		y: 310,
		label: "AKL 4",
		width: 50,
		height: 500,
	},
	{
		x: 1660,
		y: 310,
		label: "AKL 5",
		width: 50,
		height: 500,
	},
	{
		x: 1720,
		y: 310,
		label: "PLC 23",
		width: 50,
		height: 600,
	},
	{
		x: 1780,
		y: 310,
		label: "AKL 6",
		width: 50,
		height: 500,
	},
	{
		x: 1840,
		y: 310,
		label: "AKL 7",
		width: 50,
		height: 500,
	},
	{ x: 1900, y: 310, label: "PLC 24", width: 50, height: 600 },
	{ x: 1960, y: 310, label: "AKL 8", width: 50, height: 500 },

	{ x: 1150, y: 310, label: "PLC 11", width: 100, height: 600 },
	{ x: 2150, y: 310, label: "PLC 12", width: 100, height: 600 },
	{ x: 2350, y: 410, label: "PLC 13", width: 100, height: 800 },
	{ x: 1150, y: 1650, label: "PLC 31", width: 300, height: 150 },
	{ x: 1500, y: 1470, label: "PLC 32", width: 300, height: 150 },
];

export function makeNodes(nodes: Node[]): React.ReactNode {
	return nodes.map((node) => (
		<div
			key={node.label}
			style={{
				position: "absolute",
				left: node.x - node.width / 2,
				top: node.y - node.height / 2,
				width: node.width,
				height: node.height,
				background: "#4CAF50dd",
				color: "#fff",
				borderRadius: "5px",
				textAlign: "center",

				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<div style={{ transform: `rotate(${node.textRotation}deg)` }}>
				{node.label}
			</div>
		</div>
	));
}
