import React from "react";

interface StatBoxProps {
	title?: string;
	children?: React.ReactNode;
	content?: React.ReactNode;
	style?: React.CSSProperties;
}

export const StatBox: React.FC<StatBoxProps> = ({
	title = "Stat Title",
	children,
	content,

	style,
}) => (
	<div
		className="flex h-56 w-56 flex-col items-center justify-center rounded-lg border-1 border-gray-300 bg-white p-2 text-black shadow-md dark:border-slate-500 dark:bg-slate-700 dark:text-white"
		style={{ minHeight: 100, ...style }}
	>
		<div className="text-center text-2xl font-bold">{title}</div>
		{children != null && <div>{children}</div>}
		{content != null && (
			<div className="pt-8 text-center text-6xl">{content}</div>
		)}
	</div>
);

export default StatBox;
