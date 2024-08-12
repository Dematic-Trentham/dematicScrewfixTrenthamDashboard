"use client";
import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import getAllUsers from "./_actions/adminUsers";
import UserRow from "./(components)/userRow";

import { typeUserVisible } from "@/types/user"; // Assuming the User type is defined in a module named "types"
import PanelTop from "@/components/panels/panelTop";

const AdminUsersContent = () => {
	const [loading, setLoading] = useState(true);
	const [users, setUsers] = useState<typeUserVisible[]>([]);

	useEffect(() => {
		async function fetchData() {
			//get data from server
			const users = await getAllUsers();

			setUsers(users);
			setLoading(false);
		}

		fetchData();
	}, []);

	if (loading) {
		return (
			<PanelTop className="h-auto w-11/12" title="User Administration">
				<TableContainer className="sm:rounded-tl-2xl sm:rounded-tr-2xl">
					<Table size="small" sx={{ minWidth: 650 }}>
						<TableHead className="bg-slate-200 dark:bg-slate-600">
							<TableRow>
								<TableCell />
								<TableCell>Username</TableCell>
								<TableCell>Email</TableCell>
								<TableCell>Department</TableCell>
								<TableCell>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							<TableRow>
								<TableCell>Loading...</TableCell>
								<TableCell />
								<TableCell />
							</TableRow>
						</TableBody>
					</Table>
				</TableContainer>
			</PanelTop>
		);
	}

	return (
		<>
			<PanelTop className="h-auto w-11/12" title="User Administration">
				<TableContainer className="sm:rounded-tl-2xl sm:rounded-tr-2xl sm:border">
					<Table size="small" sx={{ minWidth: 650 }}>
						<TableHead>
							<TableRow className="bg-slate-200 dark:bg-slate-600">
								<TableCell>Profile</TableCell>
								<TableCell>Username</TableCell>
								<TableCell>Email</TableCell>
								<TableCell>Department</TableCell>
								<TableCell>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{users.map((user) => (
								<UserRow key={user.id ?? null} user={user} />
							))}
						</TableBody>
					</Table>
				</TableContainer>

				<br />
				<div className="flex justify-evenly">
					<div>Total Users :{users.length}</div>
					<div>
						Total Admins (green) :
						{users.filter((user) => user.permissions.includes("admin")).length}
					</div>
				</div>
			</PanelTop>
		</>
	);
};

export default AdminUsersContent;
