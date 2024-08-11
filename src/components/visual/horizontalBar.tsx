import React from "react";

import { cn } from "@/utils/cn";

interface HorizontalBarProps {
	width?: string;
	styles?: string;
}

const HorizontalBar: React.FC<HorizontalBarProps> = ({ width, styles }) => {
	return (
		<div
			className={cn(
				styles,
				"ml-0 h-1 w-5 rounded-r-full bg-blue-500 opacity-50"
			)}
			style={{ width }}
		/>
	);
};

export default HorizontalBar;
