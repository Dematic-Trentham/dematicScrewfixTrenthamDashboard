"use server";
import React from "react";
import { FaScrewdriver } from "react-icons/fa6";
import { TbElevator } from "react-icons/tb";
import Image from "next/image";

import SidebarParentComponent from "../sidebarParentComponent";
import SidebarParentComponentGroup from "../sidebarParentComponentGroup";

import shuttleIcon from "./shuttle.png";

import HorizontalBar from "@/components/visual/horizontalBar";

const SidebarAdmin = async () => {
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

				<SidebarParentComponent
					icon={<TbElevator />}
					link="/dashboard/dms/liftMissions"
					text="Lift Missions"
				/>
			</SidebarParentComponentGroup>
		</>
	);
};

export default SidebarAdmin;
