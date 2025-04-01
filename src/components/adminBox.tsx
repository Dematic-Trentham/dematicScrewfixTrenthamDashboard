import React, { useEffect, useState } from "react";

import PanelTop from "./panels/panelTop";

import { hasPermission } from "@/utils/getUser";
interface PanelSmallProps {
	checkBoxes: {
		label: string;
		callback: React.Dispatch<React.SetStateAction<boolean>>;
	}[];
}

const PanelSmall: React.FC<PanelSmallProps> = ({ checkBoxes }) => {
	const [userIsAdmin, setUserIsAdmin] = useState(false);

	useEffect(() => {
		//check if we have permission to view this page
		async function checkPermission() {
			if (await hasPermission("admin")) {
				setUserIsAdmin(true);
			}
		}
		checkPermission();
	}, []);

	//check if we have permission to view this page
	if (!userIsAdmin) {
		return <div />;
	}

	return (
		<>
			<br />
			<PanelTop className="col flex flex-col" title="Admin Panel">
				<div className="grid grid-cols-3 gap-4">
					{checkBoxes.map((checkbox, index) => (
						<div key={index} className="flex items-center gap-2">
							<input
								id={`checkbox-${index}`}
								type="checkbox"
								onChange={(event) => checkbox.callback(event.target.checked)}
							/>
							<label htmlFor={`checkbox-${index}`}>{checkbox.label}</label>
						</div>
					))}
				</div>
			</PanelTop>
		</>
	);
};

export default PanelSmall;
