import React, { ReactNode } from "react";

import { cn } from "@/utils/cn";

type PanelProps = {
	children: ReactNode;
	title?: string;
	className?: string;
	topRight?: ReactNode;
};

const PanelTop: React.FC<PanelProps> = (props) => {
	return (
		<div className="flex items-start justify-center">
			<div
				className={cn(
					`h-3/6 h-fit w-3/6 rounded-2xl bg-white dark:bg-slate-400 dark:text-slate-900`,
					props.className
				)}
			>
				<div
					className={`rounded-t-2xl bg-orange-400 text-lg font-bold ${props.title === undefined ? "p-0" : "p-4"} `}
				>
					{props.title}
					{props.topRight ? (
						<div className="float-right">{props.topRight}</div>
					) : (
						""
					)}
				</div>

				<div className="h-full rounded-b-2xl bg-white px-4 pb-4 pt-2">
					{props.children}
				</div>
			</div>
		</div>
	);
};

export default PanelTop;
