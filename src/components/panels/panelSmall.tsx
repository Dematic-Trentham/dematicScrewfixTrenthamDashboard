import React from "react";
import { Box } from "@mui/material";
import clsx from "clsx";

import { cn } from "@/utils/cn";

interface PanelSmallProps {
	accentColor: string;
	children: React.ReactNode;
	className?: string;
}

const PanelSmall: React.FC<PanelSmallProps> = ({
	accentColor,
	children,
	className,
}) => {
	return (
		<Box
			className={cn(`m-1 rounded-2xl bg-slate-100 p-2 text-black`, className)}
			sx={{ borderLeft: `10px solid ${accentColor}` }}
		>
			{children}
		</Box>
	);
};

export default PanelSmall;
