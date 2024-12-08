"use server";

import { BsDropbox } from "react-icons/bs";
import React from "react";

import SidebarParentComponent from "../sidebarParentComponent";
import SidebarParentComponentGroup from "../sidebarParentComponentGroup";

import HorizontalBar from "@/components/visual/horizontalBar";

const SidebarOrderStart = () => {
	return (
		<>
			<HorizontalBar />
			<SidebarParentComponentGroup
				icon={<BsDropbox />}
				link="/dashboard/orderStart"
				text="Order Start Stats"
			>
				<SidebarParentComponent
					icon={<BsDropbox />}
					link="/dashboard/orderStart/stats"
					text="Stats"
				/>
			</SidebarParentComponentGroup>
		</>
	);
};

export default SidebarOrderStart;
