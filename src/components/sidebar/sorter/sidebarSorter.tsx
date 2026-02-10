"use server";
import React from "react";
import { FaBarsProgress } from "react-icons/fa6";
import { BiDotsHorizontal } from "react-icons/bi";

import SidebarParentComponent from "../sidebarParentComponent";
import SidebarParentComponentGroup from "../sidebarParentComponentGroup";

import HorizontalBar from "@/components/visual/horizontalBar";

const SidebarAdmin = async () => {
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
				<SidebarParentComponent
					icon={<FaBarsProgress />}
					link="/dashboard/sorter/cells"
					text="Disabled Cells"
				/>
				<SidebarParentComponent
					icon={
						<svg fill="none" height="20" viewBox="0 0 20 20" width="20">
							<g transform="rotate(20 10 10)">
								<rect fill="#d3d3d3" height="10" width="30" x="-5" y="5" />
								{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
									<circle key={i} cx={24 - i * 3} cy={10} fill="black" r="3">
										<animate
											attributeName="fill"
											dur="1s"
											keyTimes={Array(11)
												.fill(0)
												.map((_, idx) => (idx / 10).toFixed(2))
												.join(";")}
											repeatCount="indefinite"
											values={
												Array(10)
													.fill("black")
													.map((_, idx) =>
														idx === i || idx === (i + 5) % 10
															? "orange"
															: "black"
													)
													.join(";") + ";black"
											}
										/>
									</circle>
								))}
							</g>
						</svg>
					}
					link="/dashboard/sorter/encoder"
					text="Encoder"
				/>
			</SidebarParentComponentGroup>
		</>
	);
};

export default SidebarAdmin;
