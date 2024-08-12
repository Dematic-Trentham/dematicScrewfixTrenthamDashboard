import React from "react";
import { FaBars, FaBell, FaHome, FaScrewdriver } from "react-icons/fa";

import { ThemeSwitch } from "../theme-switch";

import Sidebarparentcomponent from "./sidebarparentcomponent";
import Sidebaradmin from "./admin/sidebaradmin";
import SideMini from "../visual/sideMini";

const Sidebar = () => {
	const isHidden = false;

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
						<Sidebaradmin isHidden={isHidden} />
					</nav>
				</div>
			</div>
		</SideMini>
	);
};

export default Sidebar;
