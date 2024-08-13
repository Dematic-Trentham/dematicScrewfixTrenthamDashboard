"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
interface SidebarparentcomponentProps {
	text: string;
	icon?: JSX.Element;
	children?: React.ReactNode;
	link?: string;
}

const Sidebarparentcomponent = (props: SidebarparentcomponentProps) => {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [highlighted, setHighlighted] = useState(false);

	useEffect(() => {
		const url = window.location.pathname;
		const link = props.link;

		if (link && url.startsWith(link) && link !== "/") {
			setHighlighted(true);
		} else if (url === link) {
			setHighlighted(true);
		} else {
			setHighlighted(false);
		}
	}, [pathname, searchParams]);

	const content = (
		<div
			className={`flex h-10 items-center px-0 py-0 text-gray-100 hover:bg-gray-600 ${highlighted ? "rounded-r-full bg-gray-500" : ""}`}
			title={props.text}
		>
			<button className="w-10 justify-start px-3 py-0">{props.icon}</button>

			<div
				className={`flex items-center px-0 py-0 text-gray-100 hover:bg-gray-700`}
			>
				{props.text}
			</div>
		</div>
	);

	return <>{props.link ? <Link href={props.link}>{content}</Link> : content}</>;
};

export default Sidebarparentcomponent;
