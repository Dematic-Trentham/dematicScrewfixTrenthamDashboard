"use server";
import React from "react";
import { FaScrewdriver } from "react-icons/fa6";
import Image from "next/image";

import SidebarParentComponent from "../sidebarParentComponent";
import SidebarParentComponentGroup from "../sidebarParentComponentGroup";

import shuttleIcon from "./shuttle.png";

import HorizontalBar from "@/components/visual/horizontalBar";

const SidebarAdmin = () => {
	return (
		<>
			<HorizontalBar />
			<SidebarParentComponentGroup
				icon={
					<Image
						alt="Shuttle"
						src={shuttleIcon}
						style={{ height: "auto" }}
						width={20}
					/>
				}
				link="/dashboard/shuttles"
				text="DMS"
			>
				<SidebarParentComponent
					icon={<FaScrewdriver />}
					link="/dashboard/shuttles/locations"
					text="Locations"
				/>
			</SidebarParentComponentGroup>
		</>
	);
};

export default SidebarAdmin;
