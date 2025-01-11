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
					`h-3/6 w-3/6 rounded-2xl border-1 border-slate-900 bg-white shadow-lg dark:bg-slate-400 dark:text-slate-900`,
					props.className
				)}
			>
				<div
					className={`flex rounded-t-2xl bg-orange-400 text-lg font-bold ${props.title === undefined ? "p-0" : "p-4 py-2"} `}
				>
					<div className="w-full">{props.title}</div>
					<div className="w-full" />
					{props.topRight ? (
						<div className="justify-self-end">{props.topRight}</div>
					) : (
						""
					)}
				</div>

				<div className="h-fit rounded-b-2xl bg-white px-4 pb-4 pt-1">
					{props.children}
				</div>
			</div>
		</div>
	);
};

export default PanelTop;
