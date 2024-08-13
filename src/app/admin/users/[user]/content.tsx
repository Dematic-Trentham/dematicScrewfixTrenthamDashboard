"use client";

import { IoCloseCircleSharp } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { toast } from "react-toastify";
import { setCookie } from "cookies-next";

import {
	deleteUser,
	getAllPermissions,
	getUser as getUser2,
	modifyUser,
	uploadProfilePic,
} from "./_actions/";

import { getUser } from "@/utils/getUser";
import PanelTop from "@/components/panels/panelTop";
import { typeUserVisible } from "@/types/user";
import YesNoBox from "@/components/visual/yesNoBox";
import updateUserToken from "@/app/user/auth/_actions/updateUserToken";
import { makeFirstLetterUpperCase } from "@/utils/strings";

type AdminUserContentProps = {
	user: string;
};

const AdminUserContent = (AdminUserContentProps: AdminUserContentProps) => {
	const router = useRouter();

	const [user, setUser] = useState<typeUserVisible | null>(null);
	const [allPermissions, setAllPermissions] = useState<
		| { id: string; name: string; description: string | null }[]
		| { error: string }
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

		//check if allPermissions is an array
		if (Array.isArray(allPermissions)) {
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
		}

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

			if ("error" in user) {
				setUser(null);
				setNewUser(null);
				setError(user.error);
				setIsLoading(false);

				return;
			}

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

						<div className="rounded-xl bg-zinc-100 px-3 py-2 dark:bg-zinc-800 dark:text-white">
							<div className="text-sm text-zinc-600 dark:text-zinc-300">
								Profile Picture
							</div>
							<div className="flex items-center justify-between space-y-0 self-auto">
								{user.profilePic ? (
									<img
										alt="User Profile"
										className="size-36 rounded-full object-cover"
										src={user.profilePic}
									/>
								) : (
									<div className="size-36 rounded-full bg-orange-700 p-3">
										<IoCloseCircleSharp className="h-full w-full" />
									</div>
								)}

								<form className="flex flex-col items-end">
									<input
										name="fileUpload"
										style={{ color: "transparent", width: "100px" }}
										type="file"
										onChange={async (e) => {
											if (!e.target.files) {
												return;
											}

											const file = e.target.files[0];
											const formData = new FormData();

											//add the file to the form
											const fileData = new Blob([file], { type: file.type });

											formData.append("fileUpload", file);
											formData.append("fileData", fileData);

											//add the username to the form data
											formData.append("username", user.email);
											formData.append("id", user.id ?? "");

											// handle the formData here
											const result = await uploadProfilePic(formData);

											toast.success("Profile picture uploaded");

											setCookie("user-token", result.token, {
												maxAge: 60 * 60 * 24 * 7, // 1 week
											});
											setCookie("reloadNeeded", "true");
										}}
									/>
								</form>
							</div>
						</div>
						<div className="rounded-xl bg-zinc-100 px-3 py-2 dark:bg-zinc-800 dark:text-white">
							<div className="text-sm text-zinc-600 dark:text-zinc-300">
								User Permissions
							</div>
							<div className="grid grid-cols-3 gap-2 ps-2">
								{allPermissions && "error" in allPermissions && (
									<div className="text-red-500">{allPermissions.error}</div>
								)}

								{Array.isArray(allPermissions) &&
									allPermissions.map((permission) => (
										<div
											key={permission.id}
											className="flex justify-evenly"
											title={permission.description ?? ""}
										>
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
													// eslint-disable-next-line @typescript-eslint/no-unused-vars
													onChange={(e) => {
														permissionsChanged();
													}}
												/>
											</div>
										</div>
									))}
							</div>
						</div>
						<div className="grid grid-cols-3 gap-2 rounded-xl bg-zinc-100 px-3 py-2 ps-2 dark:bg-zinc-800 dark:text-white">
							<div className="flex justify-evenly space-x-2 text-sm text-zinc-600 dark:text-zinc-300">
								<div> User Disabled</div>

								<input
									defaultChecked={user.disabled}
									id="disabled"
									name="disabled"
									type="checkbox"
									onChange={(e) => {
										compareUser({ ...user, disabled: e.target.checked });
									}}
								/>
							</div>
						</div>

						<div className="bg- flex flex-row items-center justify-evenly space-x-2 pt-2">
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

									toast.success("User saved", {
										position: "bottom-right",
										autoClose: 5000,
										hideProgressBar: false,
										closeOnClick: true,
										pauseOnHover: true,
										draggable: true,
										progress: undefined,
									});

									//did we update ourselves?
									if (newUser.id === currentUser?.id) {
										const result = await updateUserToken();

										setCookie("user-token", result.token, {
											maxAge: 60 * 60 * 24 * 7, // 1 week
										});
										setCookie("reloadNeeded", "true");
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
