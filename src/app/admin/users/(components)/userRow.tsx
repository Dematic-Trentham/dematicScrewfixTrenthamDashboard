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
	setDisabled(id: string, disabled: boolean): void;
	copyPermissions: (id: string) => void;
	pastePermissions: (id: string) => void;
}

const UserRow = (props: UserRowProps) => {
	//does the user have the admin permission
	const isAdmin = props.user.permissions.includes("admin");
	const isDisabled = props.user.disabled;

	return (
		<TableRow
			className={`${isAdmin ? "bg-green-300" : ""} ${isDisabled ? "bg-gray-600" : ""}`}
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
								<Link
									className="group relative z-0 box-border inline-flex h-10 w-52 min-w-20 select-none appearance-none items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-medium bg-default px-4 text-small font-normal text-default-foreground subpixel-antialiased outline-none tap-highlight-transparent transition-transform-colors-opacity data-[focus-visible=true]:z-10 data-[pressed=true]:scale-[0.97] data-[hover=true]:opacity-hover data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-offset-2 data-[focus-visible=true]:outline-focus motion-reduce:transition-none [&>svg]:max-w-[theme(spacing.8)]"
									href={"/admin/users/" + props.user.id}
								>
									Edit
								</Link>

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
								<Button
									className="w-52"
									onClick={() => {
										if (props.user.id) {
											props.setDisabled(props.user.id, !props.user.disabled);
										}
									}}
								>
									{props.user.disabled ? "Enable" : "Disable"} User
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
