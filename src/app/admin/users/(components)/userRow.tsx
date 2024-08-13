import React from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { FaCogs, FaUserAstronaut } from "react-icons/fa";
import { Button } from "@nextui-org/button";
import Link from "next/link";

import { typeUserVisible } from "@/types/user"; // Assuming the User type is defined in a module named "types"
import HoverPopup from "@/components/visual/hoverPopupFloat";

interface UserRowProps {
	key: string | null;
	user: typeUserVisible;
	copyPermissions: (id: string) => void;
	pastePermissions: (id: string) => void;
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
							<div className="flex flex-col space-y-2 rounded-xl border-1 border-black bg-neutral-200 p-4 dark:bg-neutral-800">
								<Button className="w-52">
									<Link
										className="fle text-blue-500 hover:text-blue-700"
										href={"/admin/users/" + props.user.id}
									>
										Edit
									</Link>
								</Button>
								<Button
									className="w-52"
									onClick={() => {
										if (props.user.id) {
											props.copyPermissions(props.user.id);
										}
									}}
								>
									Copy Permissions
								</Button>
								<Button
									className="w-52"
									onClick={() => {
										if (props.user.id) {
											props.pastePermissions(props.user.id);
										}
									}}
								>
									Paste Permissions
								</Button>
							</div>
						}
						xOffset={-200}
					/>
				}
			</TableCell>
		</TableRow>
	);
};

export default UserRow;
