import React from "react";

import SorterEncoder from "./sorterEncoder";

const classname =
	"fixed left-1/2 top-1/2 z-[9999] flex h-56 w-8/12 -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded border-4 flash-border border-red-500 bg-red-500 p-4 text-center text-white shadow-lg";

const Alerts: React.FC = () => {
	// Blank placeholder component
	return (
		<div>
			<style>{`.flash-border{animation:flash-border 1s infinite}@keyframes flash-border{0%{border-color:rgba(239,68,68,1)}50%{border-color:rgba(239,68,68,0.15)}100%{border-color:rgba(239,68,68,1)}}`}</style>
			<SorterEncoder className={classname} />
		</div>
	);
};

export default Alerts;
