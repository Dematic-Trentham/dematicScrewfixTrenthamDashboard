import React from "react";
import { FaHome } from "react-icons/fa";

import SideMini from "../visual/sideMini";
import SideMobile from "../visual/sideMobile";
import { ThemeSwitch } from "../theme-switch";

import SidebarParentComponent from "./sidebarParentComponent";
import SidebarAdmin from "./admin/sidebarAdmin";
import SidebarShuttles from "./shuttles/sidebarShuttles";
import SidebarSorter from "./sorter/sidebarSorter";
import SidebarOrderStart from "./orderStart/sidebarOrderStart";
import SidebarAutoCarton from "./autoCarton/sidebarAutoCarton";
import SidebarEMS from "./ems/sidebarEMS";
import SidebarSitePing from "./Site/sidebarSite";

const Sidebar = () => {
	const sideBar = (
		<div className="flex h-full flex-col bg-gray-800">
			<div>
				{/* sidebar */}
				<div className="flex h-fit flex-1 flex-col overflow-y-auto overflow-x-hidden">
					<nav className="">
						<SidebarParentComponent
							icon={<FaHome />}
							link="/"
							text="Dashboard"
						/>
						<SidebarOrderStart />
						<SidebarAutoCarton />
						<SidebarShuttles />

						<SidebarSorter />
						<SidebarEMS />
						<SidebarSitePing />

						<SidebarAdmin />
					</nav>
				</div>
				<div className="flex-grow" />
				<div className="p-1">
					<ThemeSwitch />
					<div className="text-center" style={{ fontSize: 6 }}>
						JWL 2024
					</div>
				</div>
			</div>
		</div>
	);

	return (
		<div>
			<div className="hidden md:flex">
				<SideMini>{sideBar}</SideMini>
			</div>
			<div className="md:hidden">
				<SideMobile>{sideBar}</SideMobile>
			</div>
		</div>
	);
};

export default Sidebar;
