/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
"use client";
import { useState } from "react";
import { ThemeSwitch } from "../theme-switch";
import { FaBars } from "react-icons/fa";

type SideMiniProps = {
	children: React.ReactNode;
};

const SideMini: React.FC<SideMiniProps> = ({ children }) => {
	const [isMinimized, setIsMinimized] = useState(false);

	const toggleMinimize = () => {
		setIsMinimized(!isMinimized);
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
