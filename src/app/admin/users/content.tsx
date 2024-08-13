"use client";
import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { TableFooter } from "@mui/material";
import { toast } from "react-toastify";

import getAllUsers, { getAUser, updateUser } from "./_actions";
import UserRow from "./(components)/userRow";

import { typeUserVisible } from "@/types/user"; // Assuming the User type is defined in a module named "types"
import PanelTop from "@/components/panels/panelTop";
import { makeFirstLetterUpperCase } from "@/utils/strings";

const AdminUsersContent = () => {
	const [loading, setLoading] = useState(true);
	const [users, setUsers] = useState<typeUserVisible[]>([]);

	const [errors, setErrors] = useState<string>("");

	const [permissionsCopied, setPermissionsCopied] = useState<{
		email: string;
		permissions: string[];
	}>({
		email: "",
		permissions: [],
	});

	useEffect(() => {
		async function fetchData() {
			//get data from server
			const users = await getAllUsers();

			console.log(users);

			setUsers(users);
			setLoading(false);
		}

		fetchData();
	}, []);

	async function copyPermissions(id: string) {
		setLoading(true);
		//copy permissions from one user to another

		//get user data from server
		const user = await getAUser(id);

		if (!user) {
			setErrors("User not found for copying permissions");

			setLoading(false);

			return;
		}

		setPermissionsCopied({
			email: user.email,
			permissions: user.permissions.split(","),
		});

		toast.success("Permissions copied");
		setErrors("");
		setLoading(false);
	}

	async function pastePermissions(id: string) {
		//paste permissions from copied user to another user
		setLoading(true);

		//get user data from server
		const user = await getAUser(id);

		if (!user) {
			setErrors("User not found for pasting permissions");
			setLoading(false);

			return;
		}

		if (!permissionsCopied.permissions.length) {
			setErrors("No permissions copied");
			setLoading(false);

			return;
		}

		//update the user with the new permissions
		const updatedUser = {
			...user,
			permissions: permissionsCopied.permissions.join(","),
		};

		//save the user to the server
		const result = await updateUser(id, updatedUser);

		if (!result) {
			setErrors("Error saving permissions");
			setLoading(false);

			return;
		}

		setPermissionsCopied({
			email: "",
			permissions: [],
		});

		//get the updated user list
		const users = await getAllUsers();

		if (!users) {
			setErrors("Error getting users");
			setLoading(false);

			return;
		}

		setUsers(users);

		setErrors("");

		toast.success("Permissions pasted");
		setLoading(false);
	}

	async function setDisabled(id: string, disabled: boolean) {
		setLoading(true);

		//get user data from server
		const user = await getAUser(id);

		if (!user) {
			setErrors("User not found for disabling");
			setLoading(false);

			return;
		}

		//update the user with the new permissions
		const updatedUser = {
			...user,
			disabled: disabled,
		};

		//save the user to the server
		const result = await updateUser(id, updatedUser);

		if (!result) {
			setErrors("Error saving disabled status");
			setLoading(false);

			return;
		}

		//get the updated user list
		const users = await getAllUsers();

		if (!users) {
			setErrors("Error getting users");
			setLoading(false);

			return;
		}

		setUsers(users);

		setErrors("");

		toast.success("User disabled status updated");
		setLoading(false);
	}

	if (loading) {
		return (
			<PanelTop className="h-auto w-11/12" title="User Administration">
				<TableContainer className="rounded-2xl border">
					<Table size="small" sx={{ minWidth: 650 }}>
						<TableHead className="bg-slate-200 dark:bg-slate-600">
							<TableRow>
								<TableCell className="dark:text-slate-200">Profile</TableCell>
								<TableCell className="dark:text-slate-200">Username</TableCell>
								<TableCell className="dark:text-slate-200">Email</TableCell>
								<TableCell className="dark:text-slate-200">
									Department
								</TableCell>
								<TableCell className="dark:text-slate-200">Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							<TableRow>
								<TableCell>Loading...</TableCell>
								<TableCell />
								<TableCell />
								<TableCell />
								<TableCell />
							</TableRow>
						</TableBody>
						<TableFooter>
							<TableRow className="bg-slate-200 dark:bg-slate-600">
								<TableCell colSpan={5}> </TableCell>
							</TableRow>
						</TableFooter>
					</Table>
				</TableContainer>
			</PanelTop>
		);
	}

	return (
		<>
			<PanelTop className="h-auto w-11/12" title="User Administration">
				{errors && (
					<div className="mb-2 rounded-2xl bg-red-300 p-2 text-center dark:bg-red-600">
						{errors}
					</div>
				)}
				{permissionsCopied.email && (
					<div className="mb-2 rounded-2xl bg-green-300 p-2 text-center dark:bg-green-600">
						Permissions copied from user {permissionsCopied.email}
						<br />
						<div className="grid grid-cols-3 gap-2 ps-2">
							{permissionsCopied.permissions.map((permission) => (
								<div key={permission}>
									{makeFirstLetterUpperCase(permission)}
								</div>
							))}
						</div>
					</div>
				)}
				<TableContainer className="rounded-2xl border">
					<Table size="small" sx={{ minWidth: 650 }}>
						<TableHead>
							<TableRow className="bg-slate-200 dark:bg-slate-600">
								<TableCell className="dark:text-slate-200">Profile</TableCell>
								<TableCell className="dark:text-slate-200">Username</TableCell>
								<TableCell className="dark:text-slate-200">Email</TableCell>
								<TableCell className="dark:text-slate-200">
									Department
								</TableCell>
								<TableCell className="dark:text-slate-200">Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{users.map((user) => (
								<UserRow
									key={user.id ?? null}
									copyPermissions={copyPermissions}
									pastePermissions={pastePermissions}
									setDisabled={setDisabled}
									user={user}
								/>
							))}
						</TableBody>
						<TableFooter>
							<TableRow className="bg-slate-200 dark:bg-slate-600">
								<TableCell colSpan={5}> </TableCell>
							</TableRow>
						</TableFooter>
					</Table>
				</TableContainer>

				<br />
				<div className="flex justify-evenly">
					<div>Total Users :{users.length}</div>
					<div>
						Total Admins (green) :
						{users.filter((user) => user.permissions.includes("admin")).length}
					</div>
					<div>
						Total Disabled (Gray) :
						{users.filter((user) => user.disabled).length}
					</div>
				</div>
			</PanelTop>
		</>
	);
};

export default AdminUsersContent;
