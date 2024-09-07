import React from "react";
import { FaHome } from "react-icons/fa";

import SideMini from "../visual/sideMini";

import SidebarParentComponent from "./sidebarParentComponent";
import SidebarAdmin from "./admin/sidebarAdmin";
import SidebarShuttles from "./shuttles/sidebarShuttles";
import SidebarSorter from "./sorter/sidebarSorter";

const Sidebar = () => {
	return (
		<SideMini>
			<div>
				{/* sidebar */}

				<div className="flex h-fit flex-1 flex-col overflow-y-auto overflow-x-hidden">
					<nav className="flex-1 bg-gray-800">
						<SidebarParentComponent
							icon={<FaHome />}
							link="/"
							text="Dashboard"
						/>

						<SidebarShuttles />
						<SidebarSorter />
						<SidebarAdmin />
					</nav>
				</div>
			</div>
		</SideMini>
	);
};

export default Sidebar;
