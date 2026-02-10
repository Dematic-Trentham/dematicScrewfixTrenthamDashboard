"use server";

import { MdOutlineNetworkPing } from "react-icons/md";
import React from "react";

import SidebarParentComponent from "../sidebarParentComponent";

import HorizontalBar from "@/components/visual/horizontalBar";

const SidebarSitePing = async () => {
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
							r="6"
							stroke="#4ade80"
							strokeWidth="2"
						>
							<animate
								attributeName="r"
								dur="1s"
								repeatCount="indefinite"
								values="6;8;6"
							/>
							<animate
								attributeName="opacity"
								dur="1s"
								repeatCount="indefinite"
								values="1;0.5;1"
							/>
						</circle>
						<circle cx="10" cy="10" fill="#4ade80" r="4">
							<animate
								attributeName="fill"
								dur="1s"
								repeatCount="indefinite"
								values="#4ade80;#22d3ee;#4ade80"
							/>
						</circle>
					</svg>
				}
				link="/dashboard/ping"
				text="Site Pinger"
			/>
		</>
	);
};

export default SidebarSitePing;
