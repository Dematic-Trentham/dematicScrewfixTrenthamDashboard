import React, { ReactNode } from "react";

import { cn } from "@/utils/cn";

type PanelProps = {
	children: ReactNode;
	title?: string;

	className?: string;
};

const PanelMiddle: React.FC<PanelProps> = (props) => {
	return (
		<div className="flex h-screen items-center justify-center">
			<div
				className={cn(
					`w-3/6 rounded-2xl bg-white dark:text-slate-900`,
					props.className
				)}
			>
				<div
					className={`rounded-t-2xl bg-orange-400 text-lg font-bold ${props.title === undefined ? "p-0" : "p-4"}`}
				>
					{props.title}
				</div>

				<div className="h-full p-4">{props.children}</div>
			</div>
		</div>
	);
};

export default PanelMiddle;
