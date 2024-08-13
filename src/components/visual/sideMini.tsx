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

	const [isMinimized, setIsMinimized] = useState(true);

	useEffect(() => {
		const sidebarIsMinimized = cookies.get("sidebarIsMinimized");

		if (sidebarIsMinimized === "true") {
			setIsMinimized(true);
		} else {
			setIsMinimized(false);
		}
	}, []);

	const toggleMinimize = () => {
		setIsMinimized(!isMinimized);

		//make a string of the boolean "true" or "false"
		cookies.set("sidebarIsMinimized", isMinimized ? "false" : "true");
	};

	return (
		<div
			className={`hidden h-full ${isMinimized ? "w-10" : "w-64"} duration-5000 flex-col bg-gray-800 transition-width md:flex`}
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

			<div className="flex-1">{children}</div>

			<div className="bottom-0 flex-col bg-gray-900 pb-2 pt-3 text-white">
				<ThemeSwitch />
				<div className="text-center" style={{ fontSize: 6 }}>
					JWL 2024
				</div>
			</div>
		</div>
	);
};

export default SideMini;
