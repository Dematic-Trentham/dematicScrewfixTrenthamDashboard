import React from "react";

import { makePanels, panels } from "./objects/panels";
import { makeConnections, connections } from "./objects/connections";
import { makeNodes, nodes } from "./objects/nodes";
import { makeBuilding, buildings } from "./objects/building";

const FlowChart: React.FC = () => {
	return (
		<div
			style={{
				position: "relative",
				background: "#f0f0f0",
				transform: "scale(0.63)",
				transformOrigin: "top left",
			}}
		>
			{makeBg()}
			{makeBuilding(buildings)}
			{makePanels(panels)}
			{makeNodes(nodes)}
			{makeConnections(connections, nodes)}
		</div>
	);
};

export default FlowChart;

function makeBg() {
	return (
		<svg style={{ position: "absolute", width: "2420px", height: "1800px" }}>
			<rect fill="url(#grid)" height="1800" width="2420" x="0" y="0" />
			<defs>
				<pattern height="60" id="grid" patternUnits="userSpaceOnUse" width="60">
					<rect fill="white" height="60" width="60" x="0" y="0" />
				</pattern>
			</defs>
		</svg>
	);
}
