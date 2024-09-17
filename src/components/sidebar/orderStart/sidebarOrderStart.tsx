"use server";

import { BsDropbox } from "react-icons/bs";
import React from "react";

import SidebarParentComponent from "../sidebarParentComponent";
import SidebarParentComponentGroup from "../sidebarParentComponentGroup";

import HorizontalBar from "@/components/visual/horizontalBar";

const SidebarOrderStart = async () => {
	return (
		<>
			<HorizontalBar />
			<SidebarParentComponentGroup
				icon={<BsDropbox />}
				link="/dashboard/orderStart"
				text="Order Start"
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
