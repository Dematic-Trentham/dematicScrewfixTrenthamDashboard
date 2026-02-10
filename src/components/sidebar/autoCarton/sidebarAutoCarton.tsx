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
				icon={
					<svg fill="none" height="20" viewBox="0 0 20 20" width="20">
						<g>
							<rect
								fill="#C2A661"
								height="8"
								rx="2"
								stroke="#8B6F28"
								strokeWidth="1.5"
								width="14"
								x="3"
								y="6"
							>
								<animate
									attributeName="height"
									begin="0s"
									direction="alternate"
									dur="2s"
									fill="freeze"
									from="8"
									repeatCount="indefinite"
									to="2"
								/>
								<animate
									attributeName="y"
									begin="0s"
									direction="alternate"
									dur="2s"
									fill="freeze"
									from="6"
									repeatCount="indefinite"
									to="12"
								/>
							</rect>
							<rect
								fill="#C2A661"
								height="4"
								rx="2"
								stroke="#8B6F28"
								strokeWidth="1.5"
								width="14"
								x="3"
								y="4"
							>
								<animate
									attributeName="y"
									begin="0s"
									direction="alternate"
									dur="02s"
									fill="freeze"
									from="4"
									repeatCount="indefinite"
									to="10"
								/>
							</rect>
						</g>
					</svg>
				}
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
