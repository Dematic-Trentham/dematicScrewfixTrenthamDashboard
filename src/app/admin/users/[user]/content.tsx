"use client";

import { IoCloseCircleSharp } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { toast } from "react-toastify";

import {
	deleteUser,
	getAllPermissions,
	getUser as getUser2,
	modifyUser,
} from "./_actions/";

import { getUser } from "@/utils/getUser";
import PanelTop from "@/components/panels/panelTop";
import { typeUserVisible } from "@/types/user";
import YesNoBox from "@/components/visual/yesNoBox";

type AdminUserContentProps = {
	user: string;
};

const AdminUserContent = (AdminUserContentProps: AdminUserContentProps) => {
	const router = useRouter();

	const [user, setUser] = useState<typeUserVisible | null>(null);
	const [allPermissions, setAllPermissions] = useState<
		{ id: string; name: string }[]
	>([]);
	const [currentUser, setCurrentUser] = useState<typeUserVisible | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [newUser, setNewUser] = useState<typeUserVisible | null>(null);
	const [saveRequired, setSaveRequired] = useState(false);
	const [showAreYouSureDelete, setShowAreYouSureDelete] = useState(false);

	function compareUser(localNewUser: typeUserVisible) {
		//set the new user
		setNewUser(localNewUser);

		console.log(localNewUser);

		if (!user || !newUser) {
			return;
		}

		//compare the user and the new user
		if (user === localNewUser) {
			setSaveRequired(false);
		} else {
			setSaveRequired(true);
		}
	}

	function permissionsChanged() {
		let newPermissions: string[] = [];

		//loop through all the permissions
		allPermissions.map((permission) => {
			//check if the permission is checked
			const checked = (
				document.getElementById(permission.id) as HTMLInputElement
			)?.checked;

			//if it is checked, add it to the new permissions
			if (checked) {
				newPermissions.push(permission.name);
			}
		});

		if (!user) {
			return;
		}

		let newUserPermissions = newPermissions.join(",");

		//set the new permissions
		compareUser({ ...user, permissions: newUserPermissions });
	}

	useEffect(() => {
		async function fetchData() {
			//get the user data from the server
			const user = await getUser2(AdminUserContentProps.user);
			const allPermissions = await getAllPermissions();

			const currentUser = await getUser();

			setCurrentUser(currentUser);

			console.log(user);
			console.log(allPermissions);

			if ("error" in user) {
				setUser(null);
				setNewUser(null);
				setError(user.error);
				setIsLoading(false);

				return;
			}

			allPermissions.map((permission) =>
				console.log(
					permission.name + " " + user.permissions.includes(permission.name)
				)
			);

			setAllPermissions(allPermissions);
			setUser(user);
			setNewUser(user);
			setError(null);
			setIsLoading(false);
		}

		fetchData();
	}, []);

	const closeButton = (
		<button
			className="right-2 top-2"
			onClick={() => {
				//go back to all users
				router.push("/admin/users");
			}}
		>
			<IoCloseCircleSharp />
		</button>
	);

	if (isLoading) {
		return (
			<PanelTop
				className="h-auto w-11/12"
				title={"Modify User"}
				topRight={closeButton}
			>
				<div> Loading... </div>
			</PanelTop>
		);
	}

	if (!user) {
		return (
			<PanelTop
				className="h-auto w-11/12"
				title={"Modify User"}
				topRight={closeButton}
			>
				<div> User not found </div>
			</PanelTop>
		);
	}

	if (user) {
		return (
			<>
				<PanelTop
					className="h-auto w-11/12"
					title={"Modify User"}
					topRight={closeButton}
				>
					{error && <div>{error}</div>}
					<div className="flex flex-col space-y-1">
						<Input
							defaultValue={user.name}
							id="name"
							label="Name"
							name="name"
							placeholder="Enter a name"
							type="text"
							onChange={(e) => {
								compareUser({ ...user, name: e.target.value });
							}}
						/>
						<Input
							defaultValue={user.email}
							disabled={isLoading}
							id="email"
							label="Email"
							name="email"
							placeholder="Enter an email"
							type="email"
							onChange={(e) => {
								compareUser({ ...user, email: e.target.value });
							}}
						/>

						<Input
							defaultValue={user.department || ""}
							disabled={isLoading}
							id="department"
							label="Department"
							name="department"
							placeholder="Enter a department"
							type="text"
							onChange={(e) => {
								compareUser({ ...user, department: e.target.value });
							}}
						/>

						<Input
							defaultValue={user.profilePic || ""}
							disabled={isLoading}
							id="profilePic"
							label="Profile Picture"
							name="profilePic"
							placeholder="Enter a profile picture"
							type="text"
							onChange={(e) => {
								compareUser({ ...user, profilePic: e.target.value });
							}}
						/>

						<div>
							<div>User Permissions</div>
							<div className="grid grid-cols-3 gap-2 ps-2">
								{allPermissions.map((permission) => (
									<div key={permission.id} className="flex justify-evenly">
										<div className="">
											{makeFirstLetterUpperCase(permission.name)}
										</div>
										<div className="">
											<input
												key={permission.id}
												defaultChecked={user.permissions.includes(
													permission.name
												)}
												id={permission.id}
												name={permission.name}
												type="checkbox"
												onChange={(e) => {
													permissionsChanged();
												}}
											/>
										</div>
									</div>
								))}
							</div>
						</div>

						<div className="flex flex-row items-center justify-evenly space-x-2">
							<Button
								color="primary"
								isDisabled={!saveRequired}
								onClick={async () => {
									//modify the user
									if (!newUser) {
										return;
									}

									setIsLoading(true);

									const result = await modifyUser(newUser);

									if ("error" in result) {
										setError(result.error);
										setIsLoading(false);

										return;
									}

									setUser(result);

									toast.success("User saved");

									//did we update ourselves?
									if (newUser.id === currentUser?.id) {
										toast.success(
											"You updated yourself, logging out. please log back in to refresh your account",
											{
												autoClose: 10000,
											}
										);
										//logout
										router.push("/user/auth/logout");
									}

									setSaveRequired(false);
									setIsLoading(false);
								}}
							>
								Save
							</Button>
							<Button
								color="danger"
								onClick={() => {
									setShowAreYouSureDelete(true);
								}}
							>
								Delete User
							</Button>
							<Button
								color="primary"
								onClick={() => {
									//go back to all users
									router.push("/admin/users");
								}}
							>
								Back
							</Button>
						</div>
					</div>
				</PanelTop>
				{showAreYouSureDelete && (
					<YesNoBox
						question="Are you sure you want to delete this user?"
						onNo={() => {
							setShowAreYouSureDelete(false);
						}}
						onYes={async () => {
							//delete the user
							if (!user) {
								return;
							}
							const result = await deleteUser(user.id ?? "");

							if (!result) {
								toast.error("Error deleting user");

								return;
							}

							toast.success("User deleted");

							setShowAreYouSureDelete(false);
							//go back to all users
							router.push("/admin/users");
						}}
					/>
				)}
			</>
		);
	}
};

export default AdminUserContent;

function makeFirstLetterUpperCase(string: string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}
