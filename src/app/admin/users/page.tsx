"use client";
import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

interface UsersProps {
	title: string;
}

import getAllUsers from "./_actions/adminUsers";
import Userrow from "./(components)/userrow";

import { typeUserVisible } from "@/types/user"; // Assuming the User type is defined in a module named "types"
import { hasPermission } from "@/utils/getUser";
import Panel from "@/components/panels/panel";

const Users = (props: UsersProps) => {
	const [loading, setLoading] = useState(true);
	const [users, setUsers] = useState<typeUserVisible[]>([]);

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

	if (!hasPermission("admin")) {
		return <p>You dont have permission</p>;
	}

	if (loading) {
		return <p>Loading...</p>;
	}

	return (
		<>
			<Panel className="mt-36 h-auto w-11/12">
				<TableContainer>
					<Table size="small" sx={{ minWidth: 650 }}>
						<TableHead>
							<TableRow>
								<TableCell>Username</TableCell>
								<TableCell>Email</TableCell>
								<TableCell>Department</TableCell>
								<TableCell>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{users.map((user) => (
								<Userrow key={user.id} user={user} />
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Panel>
		</>
	);
};

export default Users;
