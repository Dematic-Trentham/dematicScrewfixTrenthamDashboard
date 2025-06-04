import clsx from "clsx";
import React, { ReactNode } from "react";

interface StatPanelProps {
	title?: string;
	icon?: React.ReactNode;
	children: ReactNode;
	style?: React.CSSProperties;
}

const StatPanel: React.FC<StatPanelProps> = ({
	title,
	icon,
	children,
	style,
}) => (
	<>
		<div
			className={clsx(
				"flex flex-col items-center justify-center rounded-lg border border-gray-300 bg-gray-200 p-2 shadow-md"
			)}
		>
			<div className="pb-1">
				{icon && <div className="text-xl">{icon}</div>}
				{title && <div className="text-xl">{title}</div>}
			</div>
			<div className="grid">{children}</div>
		</div>
	</>
);

export default StatPanel;
