"use client";

import React from "react";

import TopBarRightSide from "./topbarrightside";

const Topbar = () => {
	return (
		<div className="flex h-16 w-full items-center justify-between bg-gray-900 px-0 text-slate-100">
			<div className="flex h-16 w-full items-center justify-between bg-gray-900 px-0">
				<div />

				{/* Right side content */}
				<div className="flex h-16 items-center space-x-1 pr-1">
					<TopBarRightSide />
				</div>
			</div>
		</div>
	);
};

export default Topbar;
