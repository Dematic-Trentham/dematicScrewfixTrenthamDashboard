"use server";
import React from "react";
import { FaBarsProgress } from "react-icons/fa6";

import SidebarParentComponent from "../sidebarParentComponent";
import SidebarParentComponentGroup from "../sidebarParentComponentGroup";

import HorizontalBar from "@/components/visual/horizontalBar";

const SidebarAdmin =  () => {
	return (
		<>
			<HorizontalBar />
			<SidebarParentComponentGroup
				icon={<FaBarsProgress />}
				link="/dashboard/sorter"
				text="Sorter"
			>
				<SidebarParentComponent
					icon={<FaBarsProgress />}
					link="/dashboard/sorter/journeys"
					text="Journey's"
				/>
			</SidebarParentComponentGroup>
		</>
	);
};

export default SidebarAdmin;
