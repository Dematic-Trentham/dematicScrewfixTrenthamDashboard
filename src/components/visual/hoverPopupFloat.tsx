"use client";
import React, { ReactNode, useState } from "react";

interface HoverPopupProps {
	itemToHover: ReactNode;
	itemToPopUp: ReactNode;
}

const HoverPopup: React.FC<HoverPopupProps> = ({
	itemToHover,
	itemToPopUp,
}) => {
	const [isHovered, setIsHovered] = useState(false);

	const handleMouseEnter = () => {
		setIsHovered(true);
	};

	const handleMouseLeave = () => {
		setIsHovered(false);
	};

	return (
		<div
			className=""
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			{itemToHover}

			<div
				className={`transition-all duration-500 ${
					isHovered ? "fixed opacity-100" : "hidden opacity-0"
				}`}
			>
				{itemToPopUp}
			</div>
		</div>
	);
};

export default HoverPopup;
