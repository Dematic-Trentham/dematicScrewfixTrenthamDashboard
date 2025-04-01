import React, { useEffect, useState } from "react";

import PanelTop from "./panels/panelTop";

import { hasPermission } from "@/utils/getUser";
interface AdminBoxProps {
	checkBoxes: {
		label: string;
		callback: (checked: boolean) => void;
	}[];
}

const AdminBox: React.FC<AdminBoxProps> = ({ checkBoxes }) => {
	const [userIsAdmin, setUserIsAdmin] = useState<boolean | null>(null); //  userIsAdmin is null until we check if the user is admin ,
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		//check if we have permission to view this page
		async function checkPermission() {
			//check if we have permission to view this page
			//if we have permission, set userIsAdmin to true
			try {
				//
				if (await hasPermission("admin")) {
					setUserIsAdmin(true);
				} else {
					setUserIsAdmin(false);
				}
				//
			} catch (error) {
				//if there is an error, set userIsAdmin to false and set error message
				setError(error instanceof Error ? error.message : String(error));
			}
		}
		checkPermission();
	}, []);

	//if there is an error, return the error message
	if (error) {
		return <div className="text-red-500">{error}</div>;
	}

	// Only render the admin panel if the user is confirmed as an admin
	if (userIsAdmin !== true) {
		return null;
	}

	//if user is admin, return the admin panel
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

export default AdminBox;
