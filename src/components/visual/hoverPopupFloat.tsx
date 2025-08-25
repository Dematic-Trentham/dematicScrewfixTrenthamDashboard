"use client";
import React, { ReactNode, useState } from "react";

interface HoverPopupProps {
	itemToHover: ReactNode;
	itemToPopUp: ReactNode;
	xOffset?: number;
	yOffset?: number;
}

const HoverPopup: React.FC<HoverPopupProps> = ({
	itemToHover,
	itemToPopUp,
	xOffset = 0,
	yOffset = 0,
}) => {
	const [isHovered, setIsHovered] = useState(false);
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

	const handleMouseEnter = (e: { clientX: any; clientY: any }) => {
		if (isHovered) return;
		setIsHovered(true);

		setMousePosition({
			x: e.clientX,
			y: e.clientY,
		});
	};

	const handleMouseLeave = () => {
		setIsHovered(false);
	};
	const handleMouseMove = (e: { clientX: any; clientY: any }) => {
		setIsHovered(true);
	};

	return (
		<div
			className=""
			onMouseLeave={handleMouseLeave}
			onMouseMove={handleMouseMove}
		>
			<div onMouseEnter={handleMouseEnter}>{itemToHover}</div>

			<div
				className={`transition-all duration-500 placeholder:${
					isHovered ? "fixed opacity-100" : "hidden opacity-0"
				}`}
			>
				{isHovered && (
					<div
						style={{
							position: "absolute",

							left: `${mousePosition.x + xOffset - 2}px`,
							top: `${mousePosition.y + yOffset - 2}px`,
						}}
					>
						{itemToPopUp}
					</div>
				)}
			</div>
		</div>
	);
};

export default HoverPopup;
