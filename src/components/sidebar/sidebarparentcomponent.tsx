"use client";
import Link from "next/link";
import React from "react";

interface SidebarparentcomponentProps {
	text: string;
	isHidden: boolean;
	icon?: JSX.Element;
	children?: React.ReactNode;
	link?: string;
}

const Sidebarparentcomponent = (props: SidebarparentcomponentProps) => {
	const content = (
		<div className="flex h-10 items-center px-0 py-0 text-gray-100 hover:bg-gray-700">
			<button className="w-10 justify-start px-3 py-0">{props.icon}</button>

			<div
				className={`flex items-center px-0 py-0 text-gray-100 hover:bg-gray-700 ${props.isHidden ? "hidden" : "block"}`}
			>
				{props.text}
			</div>
		</div>
	);

	return <>{props.link ? <Link href={props.link}>{content}</Link> : content}</>;
};

export default Sidebarparentcomponent;
