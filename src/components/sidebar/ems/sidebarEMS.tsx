"use server";

import { BsStopCircle } from "react-icons/bs";
import React from "react";

import SidebarParentComponent from "../sidebarParentComponent";

import HorizontalBar from "@/components/visual/horizontalBar";

const SidebarEMS = async () => {
	return (
		<>
			<HorizontalBar />
			<SidebarParentComponent
				icon={
					<svg fill="none" height="20" viewBox="0 0 20 20" width="20">
						<circle
							cx="10"
							cy="10"
							fill="none"
							r="8"
							stroke="red"
							strokeWidth="2"
						/>
						<circle cx="10" cy="10" fill="#4ade80" r="4">
							<animate
								attributeName="fill"
								dur="10s"
								repeatCount="indefinite"
								values="#4ade80;red;#4ade80"
							/>
						</circle>
					</svg>
				}
				link="/dashboard/emsZones"
				text="EMS Zones"
			/>
		</>
	);
};

export default SidebarEMS;
