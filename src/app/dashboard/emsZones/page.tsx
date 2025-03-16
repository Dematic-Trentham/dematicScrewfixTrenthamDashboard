"use client";
import createEngine, {
	DiagramModel,
	DefaultNodeModel,
	DefaultLinkModel,
	PortModel,
	PortModelGenerics,
} from "@projectstorm/react-diagrams";
import * as React from "react";
import { CanvasWidget } from "@projectstorm/react-canvas-core";
import { array } from "zod";

import { DemoCanvasWidget } from "./cwidget";

export default function EmsZonesPage() {
	const [mounted, setMounted] = React.useState(false);

	React.useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	//1) setup the diagram engine
	var engine = createEngine();

	//2) setup the diagram model
	var model = new DiagramModel();

	const nodes = [
		{ id: 1, name: "PLC 1", x: 100, y: 100 },
		{ id: 2, name: "PLC 2", x: 400, y: 100 },
		{ id: 3, name: "PLC 33", x: 400, y: 400 },
		{ id: 4, name: "Sorter", x: 100, y: 400 },
		{ id: 5, name: "EMS 4", x: 100, y: 700 },
	];

	let realNodes = {} as Record<string, DefaultNodeModel>;

	//4) link nodes together
	const links = [
		{ source: "PLC 1", target: "PLC 2", name: "data" },
		{ source: "EMS 4", target: "PLC 2", name: "data" },
		{ source: "PLC 2", target: "EMS 4", name: "data" },
		{ source: "Sorter", target: "EMS 4", name: "data" },
	];

	//3) create some nodes
	nodes.forEach((node) => {
		addNode(node.x, node.y, node.name);
	});

	console.log(realNodes);

	links.forEach((link) => {
		linkNodes(link.source, link.target, link.name);
	});

	//5) load model into engine
	engine.setModel(model);

	//model.setLocked(true);
	console.log("engine", engine);

	//6) render the diagram!
	return (
		<DemoCanvasWidget>
			<CanvasWidget engine={engine} />
		</DemoCanvasWidget>
	);

	//function to link two nodes
	function linkNodes(node1: string, node2: string, name: string = "") {
		const link = new DefaultLinkModel();

		const sourceNode = realNodes[node1];
		const targetNode = realNodes[node2];

		if (!sourceNode || !targetNode) {
			return;
		}

		//how many ports are there in the source node
		const sourcePorts = sourceNode.getOutPorts().length;
		const targetPorts = targetNode.getInPorts().length;

		link.setSourcePort(sourceNode.addOutPort(sourcePorts.toString()));
		link.setTargetPort(targetNode.addInPort(targetPorts.toString()));

		link.addLabel(name);

		model.addLink(link);
	}

	// function to add a node
	function addNode(x: number, y: number, name: string) {
		const node = new DefaultNodeModel({
			name: name,
			color: "rgb(0,192,255)",
		});
		var port = node.addOutPort("");

		node.height = 200;
		node.width = 100;
		node.setPosition(x, y);
		model.addNode(node);

		realNodes[name] = node;
	}
}
