"use server";

import { BsBoxSeamFill, BsBoxes } from "react-icons/bs";
import React from "react";

import SidebarParentComponent from "../sidebarParentComponent";
import SidebarParentComponentGroup from "../sidebarParentComponentGroup";

import HorizontalBar from "@/components/visual/horizontalBar";

const SidebarAutoCarton = async () => {
	return (
		<>
			<HorizontalBar />
			<SidebarParentComponentGroup
				icon={<BsBoxSeamFill />}
				link="/dashboard/autoCarton"
				text="Auto Carton"
			>
				<SidebarParentComponent
					icon={<BsBoxes />}
					link="/dashboard/autoCarton/cartonLaunch"
					text="Carton Launch"
				/>
				<SidebarParentComponent
					icon={<BsBoxes />}
					link="/dashboard/autoCarton/cartonClosing"
					text="Carton Closing"
				/>
			</SidebarParentComponentGroup>
		</>
	);
};

export default SidebarAutoCarton;
