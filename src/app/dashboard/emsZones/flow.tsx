import React from "react";

import { makePanels, panels } from "./objects/panels";
import { makeConnections, connections } from "./objects/connections";
import { makeNodes, nodes } from "./objects/nodes";
import { makeBuilding, buildings } from "./objects/building";
import { getEMS } from "./_actions/getEMS";

import Loading from "@/components/visual/loading";
import PanelMiddle from "@/components/panels/panelMiddle";

const FlowChart: React.FC = () => {
	const [data, setData] = React.useState({});
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState("");

	React.useEffect(() => {
		const fetchData = async () => {
			const response = await getEMS();

			if (!Array.isArray(response) && response.error) {
				console.log(response.error);
				setError(response.error);
				setLoading(false);

				return;
			}

			setLoading(false);

			//make stripped copy for debugging
			let strippedData: { name: string; value: string }[] = [];

			if (Array.isArray(response)) {
				response.forEach((item) => {
					const { id, name, value } = item;

					strippedData.push({ name, value });
				});
			}

			console.log("EMS DATA", strippedData);

			setData(strippedData);
		};

		fetchData();

		setInterval(() => {
			fetchData();
		}, 10000);
	}, []);

	if (loading) {
		return (
			<>
				<div
					style={{
						position: "relative",
						background: "#f0f0f0",
						transform: "scale(0.50)",
						transformOrigin: "top left",
					}}
				>
					{makeBg()}
					{makeBuilding(buildings)}
					{makePanels(panels)}
					{makeNodes(nodes)}
				</div>
				<PanelMiddle>
					<div className="bg-gray-50">
						<Loading />
					</div>
				</PanelMiddle>
			</>
		);
	}

	return (
		<div
			style={{
				position: "relative",
				background: "#f0f0f0",
				transform: "scale(0.50)",
				transformOrigin: "top left",
			}}
		>
			{makeBg()}
			{makeBuilding(buildings)}
			{makePanels(panels)}
			{makeNodes(nodes)}
			{makeConnections(connections, nodes, data)}
		</div>
	);
};

export default FlowChart;

function makeBg() {
	return (
		<svg style={{ position: "absolute", width: "2420px", height: "1800px" }}>
			<rect
				key="bg1"
				fill="url(#grid)"
				height="1800"
				width="2420"
				x="0"
				y="0"
			/>
			<defs>
				<pattern
					key="bg2"
					height="60"
					id="grid"
					patternUnits="userSpaceOnUse"
					width="60"
				>
					<rect key="bg3" fill="white" height="60" width="60" x="0" y="0" />
				</pattern>
			</defs>
		</svg>
	);
}
