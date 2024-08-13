import React from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { FaCogs, FaUserAstronaut } from "react-icons/fa";
import Link from "next/link";

import { typeUserVisible } from "@/types/user"; // Assuming the User type is defined in a module named "types"
import HoverPopup from "@/components/visual/hoverPopupFloat";

interface UserRowProps {
	key: string | null;
	user: typeUserVisible;
}

const UserRow = (props: UserRowProps) => {
	//does the user have the admin permission
	const isAdmin = props.user.permissions.includes("admin");

	return (
		<TableRow
			className={isAdmin ? "bg-green-300 dark:text-white" : "dark:text-white"}
		>
			<TableCell>
				{props.user.profilePic ? (
					<img
						alt="User Profile"
						className="h-14 w-14 rounded-full object-cover"
						src={props.user.profilePic}
					/>
				) : (
					<div className="h-14 w-14 rounded-full bg-orange-700 p-3">
						<FaUserAstronaut className="h-full w-full" />
					</div>
				)}
			</TableCell>
			<TableCell>{props.user.name}</TableCell>
			<TableCell>{props.user.email}</TableCell>
			<TableCell>{props.user.department}</TableCell>

			<TableCell>
				{
					<HoverPopup
						itemToHover={
							<button className="text-blue-500 hover:text-blue-700">
								<FaCogs />
							</button>
						}
						itemToPopUp={
							<div className="flex space-x-2 rounded-full border-1 border-black bg-neutral-200 px-4 py-2 dark:bg-neutral-800">
								<Link
									className="fle text-blue-500 hover:text-blue-700"
									href={"/admin/users/" + props.user.id}
								>
									Edit
								</Link>
							</div>
						}
					/>
				}
			</TableCell>
		</TableRow>
	);
};

export default UserRow;
