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
				icon={
					<svg fill="none" height="20" viewBox="0 0 20 20" width="20">
						<g>
							<rect
								fill="#C2A661" // cardboard box color
								height="2"
								rx="2"
								stroke="#8B6F28" // darker cardboard edge
								strokeWidth="1.5"
								width="14"
								x="3"
								y="12"
							>
								<animate
									attributeName="height"
									begin="0s"
									direction="alternate"
									dur="2s"
									fill="freeze"
									from="2"
									repeatCount="indefinite"
									to="8"
								/>
								<animate
									attributeName="y"
									begin="0s"
									direction="alternate"
									dur="2s"
									fill="freeze"
									from="12"
									repeatCount="indefinite"
									to="6"
								/>
							</rect>
							<rect
								fill="#C2A661"
								height="2"
								rx="2"
								stroke="#8B6F28"
								strokeWidth="1.5"
								width="14"
								x="3"
								y="10"
							>
								<animate
									attributeName="height"
									begin="0s"
									direction="alternate"
									dur="2s"
									fill="freeze"
									from="2"
									repeatCount="indefinite"
									to="4"
								/>
								<animate
									attributeName="y"
									begin="0s"
									direction="alternate"
									dur="2s"
									fill="freeze"
									from="10"
									repeatCount="indefinite"
									to="4"
								/>
							</rect>
						</g>
					</svg>
				}
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
