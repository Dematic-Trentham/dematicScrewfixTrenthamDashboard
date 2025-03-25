export type Panel = {
	name: string;
	x: number;
	y: number;

	width: number;
	height: number;
	label?: string;
	bgColor?: string;
};

export const panels: Panel[] = [
	{ name: "EMS 1", x: 500, y: 900, width: 480, height: 470 },
	//{ name: "EMS 2", x: 980, y: 900, width: 180, height: 420 },
	{ name: "EMS 3", x: 1040, y: 670, width: 1220, height: 180 },

	{ name: "DMS", x: 550, y: 10, width: 400, height: 600, label: "DMS" },
];

export function makePanels(panels: Panel[]): React.ReactNode {
	return panels.map((panel) => (
		<div
			key={panel.name}
			style={{
				position: "absolute",
				left: panel.x,
				top: panel.y,
				width: panel.width,
				height: panel.height,
				background: panel.bgColor || "grey",
				color: "#fff",
				borderRadius: "5px",
				textAlign: "center",

				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			{panel.label}
		</div>
	));
}
