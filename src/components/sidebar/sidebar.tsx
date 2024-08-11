"use client";
import React from "react";
import { useState } from "react";
import { FaBars, FaBell, FaHome, FaScrewdriver } from "react-icons/fa";

import { ThemeSwitch } from "../theme-switch";

import Sidebarparentcomponent from "./sidebarparentcomponent";
import Sidebaradmin from "./admin/sidebaradmin";

const Sidebar = () => {
	const [isHiddenToggle, setIsHiddenToggle] = useState(false);
	const [isHovered, setIsHovered] = useState(false);
	const [isHidden, setIsHidden] = useState(false);

	const toggleSidebar = () => {
		setIsHiddenToggle(!isHiddenToggle);
		updateIsHidden();
	};

	const mouseEnter = () => {
		setIsHovered(true);
		updateIsHidden();
	};

	const mouseLeave = () => {
		setIsHovered(false);
		updateIsHidden();
	};

	const updateIsHidden = () => {
		if (isHiddenToggle && isHovered) {
			setIsHidden(true);
		} else {
			setIsHidden(false);
		}
	};

	return (
		<div>
			{/* sidebar */}
			<div
				className={`hidden h-full ${isHidden ? "w-10" : "w-64"} duration-5000 flex-col bg-gray-800 transition-width md:flex`}
				onMouseEnter={mouseEnter}
				onMouseLeave={mouseLeave}
			>
				<div className="flex h-16 items-center justify-center bg-gray-900">
					<button className="justify-start px-3 py-5" onClick={toggleSidebar}>
						<FaBars
							className={`size-4 ${isHidden ? "text-gray-300" : "text-white"}`}
						/>
					</button>
					<div
						className={`duration-5000 flex flex-1 justify-center transition-opacity ${isHidden ? "hidden" : "block"}`}
					>
						<span className="font-bold uppercase text-white">Sidebar</span>
					</div>
				</div>

				<div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
					<nav className="flex-1 bg-gray-800">
						<Sidebarparentcomponent
							icon={<FaHome />}
							isHidden={isHidden} // Pass the isHidden state as a prop
							link="/"
							text="Dashboard"
						/>
						<Sidebarparentcomponent
							icon={<FaBell />}
							isHidden={isHidden}
							link="/about"
							text="About"
						/>
						<Sidebarparentcomponent
							icon={<FaScrewdriver />}
							isHidden={isHidden}
							link="/blog"
							text="blog"
						/>
						<Sidebaradmin isHidden={isHidden} />
					</nav>
				</div>

				<div className="bottom-0 flex-col bg-gray-900 pb-2 pt-3 text-white">
					<ThemeSwitch />
					<div className="text-center" style={{ fontSize: 6 }}>
						JWL 2024
					</div>
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
