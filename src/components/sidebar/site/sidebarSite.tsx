"use server";

import { MdOutlineNetworkPing } from "react-icons/md";
import React from "react";

import SidebarParentComponent from "../sidebarParentComponent";

import HorizontalBar from "@/components/visual/horizontalBar";

const SidebarSitePing = () => {
	return (
		<>
			<HorizontalBar />
			<SidebarParentComponent
				icon={<MdOutlineNetworkPing />}
				link="/dashboard/ping"
				text="Site Pinger"
			/>
		</>
	);
};

export default SidebarSitePing;
