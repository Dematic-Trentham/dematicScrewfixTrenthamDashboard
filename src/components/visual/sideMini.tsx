/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
"use client";
import { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import { useCookies } from "next-client-cookies";

import { ThemeSwitch } from "../theme-switch";

type SideMiniProps = {
	children: React.ReactNode;
};

const SideMini: React.FC<SideMiniProps> = ({ children }) => {
	const cookies = useCookies();

	const [isMinimizedButton, setIsMinimizedButton] = useState(false);
	const [isMinimized, setIsMinimized] = useState(false);

	useEffect(() => {
		const sidebarIsMinimized = cookies.get("sidebarIsMinimized");

		if (sidebarIsMinimized === "true") {
			setIsMinimizedButton(true);
		} else {
			setIsMinimizedButton(false);
		}
	}, []);

	const toggleMinimize = () => {
		setIsMinimizedButton(!isMinimizedButton);

		//make a string of the boolean "true" or "false"
		cookies.set("sidebarIsMinimized", isMinimizedButton ? "false" : "true");
	};

	const mouseEnter = () => {
		if (isMinimizedButton) {
			setIsMinimized(false);
		}
	};

	const mouseLeave = () => {
		if (isMinimizedButton) {
			setIsMinimized(true);
		}
	};

	return (
		<div
			className={`hidden h-full ${isMinimized ? "w-10" : "w-64"} duration-5000 flex-col bg-gray-800 transition-width md:flex`}
			onMouseEnter={() => mouseEnter()}
			onMouseLeave={() => mouseLeave()}
		>
			<div
				className="flex h-16 items-center justify-center bg-gray-900"
				role="button"
				onClick={toggleMinimize}
			>
				<button className="justify-start px-3 py-5">
					<FaBars
						className={`size-4 ${isMinimized ? "text-gray-300" : "text-white"}`}
					/>
				</button>
				<div
					className={`duration-5000 flex flex-1 justify-center transition-opacity ${isMinimized ? "hidden" : "block"}`}
				>
					<span className="font-bold uppercase text-white">Sidebar</span>
				</div>
			</div>

			<div className="h-1 flex-1 overflow-auto border-r-1 border-r-2 border-r-black">
				{children}
			</div>

			<div className="bottom-0 flex-col border-r-1 border-r-2 border-r-black bg-gray-900 pb-2 pt-3 text-white">
				<ThemeSwitch />
				<div className="text-center" style={{ fontSize: 6 }}>
					JWL 2024
				</div>
			</div>
		</div>
	);
};

export default SideMini;
