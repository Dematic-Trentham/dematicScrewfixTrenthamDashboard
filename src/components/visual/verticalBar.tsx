import React from "react";

import { cn } from "@/utils/cn";

interface VerticalBarProps {
	height?: string;
	styles?: string;
}

const VerticalBar: React.FC<VerticalBarProps> = ({ height, styles }) => {
	if (!height) {
		height = "90% ";
	}

	return (
		<div
			className={cn(styles, "w-0.5 rounded-full bg-blue-500 opacity-50")}
			style={{ height }}
		/>
	);
};

export default VerticalBar;
