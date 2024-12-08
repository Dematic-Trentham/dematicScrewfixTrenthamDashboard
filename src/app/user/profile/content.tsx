"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { setCookie } from "cookies-next";
import { IoCloseCircleSharp } from "react-icons/io5";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import { modifyUser, getAllPermissions, uploadProfilePic } from "./_actions";

import { getUser } from "@/utils/getUser";
import { typeUserVisible } from "@/types/user";
import PanelTop from "@/components/panels/panelTop";
import updateUserToken from "@/app/user/auth/_actions/updateUserToken";

const ProfileContent = () => {
	const router = useRouter();

	const [user, setUser] = useState<typeUserVisible | null>(null);
	const [currentUser, setCurrentUser] = useState<typeUserVisible | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [newUser, setNewUser] = useState<typeUserVisible | null>(null);
	const [saveRequired, setSaveRequired] = useState(false);
	const [allPermissions, setAllPermissions] = useState<
		| { id: string; name: string; description: string | null }[]
		| { error: string }
	>([]);

	useEffect(() => {
		async function fetchData() {
			//get the user data from the server
			const user = await getUser();
			const allPermissions = await getAllPermissions();

			const currentUser = await getUser();


			//check if the user is valid
			if (!user) {
				setUser(null);
				setNewUser(null);
				setError("User not found");
				setIsLoading(false);

				return;
			}

			setCurrentUser(currentUser);

		

			setAllPermissions(allPermissions);
			setUser(user);
			setNewUser(user);
			setError(null);
			setIsLoading(false);
		}

		fetchData();
	}, []);

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

	if (isLoading) {
		return (
			<PanelTop className="h-auto w-11/12" title={"Modify Profile"}>
				<div> Loading... </div>
			</PanelTop>
		);
	}

	if (!user) {
		return (
			<PanelTop className="h-auto w-11/12" title={"Modify Profile"}>
				{error && <div>{error}</div>}
			</PanelTop>
		);
	}

	return (
		<PanelTop className="h-auto w-11/12" title={"Modify Profile"}>
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
					isDisabled={true}
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
					isDisabled={true}
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
											disabled={true}
											id={permission.id}
											name={permission.name}
											type="checkbox"
										/>
									</div>
								</div>
							))}
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
	);
};

export default ProfileContent;

function makeFirstLetterUpperCase(string: string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}
