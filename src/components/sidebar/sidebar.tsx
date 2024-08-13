import React from "react";
import { FaBell, FaHome, FaScrewdriver } from "react-icons/fa";

import SideMini from "../visual/sideMini";

import Sidebarparentcomponent from "./sidebarparentcomponent";
import Sidebaradmin from "./admin/sidebaradmin";

const Sidebar = () => {
	return (
		<SideMini>
			<div>
				{/* sidebar */}

				<div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
					<nav className="flex-1 bg-gray-800">
						<Sidebarparentcomponent
							icon={<FaHome />}
							link="/"
							text="Dashboard"
						/>
						<Sidebarparentcomponent
							icon={<FaBell />}
							link="/about"
							text="About"
						/>
						<Sidebarparentcomponent
							icon={<FaScrewdriver />}
							link="/blog"
							text="blog"
						/>
						<Sidebaradmin />
					</nav>
				</div>
			</div>
		</SideMini>
	);
};

export default Sidebar;
