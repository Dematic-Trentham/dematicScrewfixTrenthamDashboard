export type buildingLayout = {
	x1: number;
	y1: number;
	x2: number;
	y2: number;
};

export const buildings: buildingLayout[] = [
	{ x1: 50, y1: 550, x2: 50, y2: 750 },
];

export function makeBuilding(building: buildingLayout[]): React.ReactNode {
	return building.map((building) => (
		<svg
			key="building"
			style={{ position: "absolute", width: "2420px", height: "1350px" }}
		>
			<line
				stroke="black"
				strokeWidth="5"
				x1={building.x1}
				x2={building.x2}
				y1={building.y1}
				y2={building.y2}
			/>
		</svg>
	));
}
