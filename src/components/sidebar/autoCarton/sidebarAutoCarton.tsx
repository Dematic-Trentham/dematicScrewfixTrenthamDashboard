"use server";

import {  BsBoxSeamFill,BsBox ,BsBoxes   } from "react-icons/bs";
import React from "react";

import SidebarParentComponent from "../sidebarParentComponent";
import SidebarParentComponentGroup from "../sidebarParentComponentGroup";

import HorizontalBar from "@/components/visual/horizontalBar";

const SidebarAutoCarton = async () => {

	//todo remove 
	return (<>	</>
	);
	return (
		<>
			<HorizontalBar />
			<SidebarParentComponentGroup
				icon={<BsBoxSeamFill />}
				link="/dashboard/autoCarton"
				text="Auto Carton"
			>
				<SidebarParentComponent
					icon={<BsBox />}
					link="/dashboard/autoCarton/orderStart"
					text="Order Start"
				/>
					<SidebarParentComponent
					icon={<BsBoxes  />}
					link="/dashboard/autoCarton/cartonClosing"
					text="Carton Closing"
				/>
			</SidebarParentComponentGroup>
		</>
	);
};

export default SidebarAutoCarton;
