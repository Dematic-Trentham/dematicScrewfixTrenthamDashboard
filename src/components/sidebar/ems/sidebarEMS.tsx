"use server";

import { BsStopCircle } from "react-icons/bs";
import React from "react";

import SidebarParentComponent from "../sidebarParentComponent";

import HorizontalBar from "@/components/visual/horizontalBar";

const SidebarEMS = () => {
	return (
		<>
			<HorizontalBar />
			<SidebarParentComponent
				icon={<BsStopCircle />}
				link="/dashboard/emsZones"
				text="EMS Zones"
			/>
		</>
	);
};

export default SidebarEMS;
