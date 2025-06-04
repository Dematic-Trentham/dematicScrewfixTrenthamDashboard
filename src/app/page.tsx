"use client";

import React, { useEffect } from "react";

import DragGrid from "./dashboard/widgets/initialLayout";
import { DMSWidget } from "./dashboard/widgets/DmsWidget";
import { PanelWidget } from "./dashboard/widgets/blankWidget";

const Home = () => {
	const [layout, setLayout] = React.useState<PanelWidget[]>([]);

	useEffect(() => {
		// Initialize the layout with the DMSWidget
		const initialLayout: PanelWidget[] = [DMSWidget];

		setLayout(initialLayout);

		// Set up an interval to update the widget content every 5 seconds
		const interval = setInterval(() => {
			initialLayout.forEach((widget) => {
				if (widget.updateContent) {
					widget.updateContent().catch((err) => {
						console.error(`Error updating widget ${widget.title}:`, err);
					});
				}
			});
		}, 5000);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className="">
			<DragGrid layout={layout} setLayout={setLayout} />
		</div>
	);
};

export default Home;
