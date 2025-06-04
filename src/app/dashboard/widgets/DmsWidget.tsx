import {
	getTotalFaults,
	getTotalMissions,
} from "../shuttles/locations/_actions";

import { PanelWidget } from "./blankWidget";

import { itemsPerFaultNice } from "@/utils/itemsPerFault";

// Optionally, you can override content or other properties directly:
const updateContent = async function (this: PanelWidget) {
	console.log("Updating DMS Totals content");

	const faults = await getTotalFaults(7);
	const missions = await getTotalMissions(7);

	console.log("faults", faults);
	console.log("missions", missions);

	const itemsPerFault = itemsPerFaultNice(missions, faults, "Missions");

	this.content = (
		<div>
			<p>Total Faults: {faults}</p>
			<p>Total Missions: {missions}</p>
			<p>Items per Fault: {itemsPerFault}</p>
		</div>
	);

	return this;
};
// Example if PanelWidget is a class:
const dmsWidget = new PanelWidget(updateContent, 3, 3);

export { dmsWidget as DMSWidget };
