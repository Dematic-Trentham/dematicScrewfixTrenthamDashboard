/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
"use client";
import { useEffect, useState } from "react";
import { useCookies } from "next-client-cookies";
import { FaBars } from "react-icons/fa";

type SideMiniProps = {
	children: React.ReactNode;
};

const SideMini: React.FC<SideMiniProps> = ({ children }) => {
	const cookies = useCookies();

	const [isMinimizedButton, setIsMinimizedButton] = useState(false);
	//const [isMinimized, setIsMinimized] = useState(false);

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

	return (
		<div>
			<div
				style={{
					position: "fixed",
					top: 0,
					left: 0,

					color: "#fff",
					transition: "width 0.3s",
					overflow: "hidden",
				}}
			>
				<div
					className="justify-start px-3 py-6"
					role="button"
					tabIndex={0}
					onClick={toggleMinimize}
				>
					<FaBars
						className={`size-4 ${isMinimizedButton ? "text-gray-300" : "text-white"}`}
					/>
				</div>
			</div>

			<div />
			{!isMinimizedButton && (
				<div className="flex h-screen w-screen flex-col bg-gray-800 py-16">
					<div>{children}</div>
				</div>
			)}
		</div>
	);
};

export default SideMini;
