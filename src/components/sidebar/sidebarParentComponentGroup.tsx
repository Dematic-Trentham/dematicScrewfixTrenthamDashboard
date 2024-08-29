"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { FaAnglesDown } from "react-icons/fa6";
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

	const [open, setOpen] = useState(false);

	useEffect(() => {
		const url = window.location.pathname;
		const link = props.link;

		if (link && url.startsWith(link) && link !== "/") {
			setHighlighted(true);
			setOpen(true);
		} else if (url === link) {
			setHighlighted(true);
			setOpen(true);
		} else {
			setHighlighted(false);
			setOpen(false);
		}
	}, [pathname, searchParams]);

	const toggleOpen = (): void => {
		setOpen(!open);
	};

	//add class to each child
	React.Children.map(props.children, (child) => {
		// @ts-ignore
		child.props.classname = `ml-7`;
	});

	const content = (
		<div
			className={`items-left flex w-64 flex-col px-0 py-0 text-gray-100 hover:bg-gray-600 ${highlighted ? "bg-gray-500" : ""}`}
			title={props.text}
		>
			<button onClick={toggleOpen}>
				<div className="flex h-10">
					<div className="w-20 justify-start px-3 py-3">{props.icon}</div>

					<div
						className={`flex items-center px-0 py-0 text-gray-100 hover:bg-gray-700`}
					>
						{props.text}
					</div>
					<div className="ml-auto mr-2 flex">
						<div
							className={`ease self-center overflow-hidden transition-all duration-500 ${open ? "rotate-180" : "rotate-90"}`}
						>
							<div className="rotate-180">
								<FaAnglesDown />
							</div>
						</div>
					</div>
				</div>
			</button>

			<div
				className={`ease overflow-hidden transition-all duration-500 ${open ? "max-h-96" : "max-h-0"}`}
			>
				{props.children}
			</div>
		</div>
	);

	return content;
};

export default Sidebarparentcomponent;
