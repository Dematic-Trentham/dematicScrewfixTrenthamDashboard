import React from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { Button } from "@nextui-org/button";

import { typeUserVisible } from "@/types/user"; // Assuming the User type is defined in a module named "types"

interface UserrowProps {
	user: typeUserVisible;
}

const Userrow = (props: UserrowProps) => {
	return (
		<TableRow>
			<TableCell>{props.user.name}</TableCell>
			<TableCell>{props.user.email}</TableCell>
			<TableCell>{props.user.department}</TableCell>
			<TableCell>
				<Button>View</Button>
				<Button>Edit</Button>
				<Button>Delete</Button>
			</TableCell>
		</TableRow>
	);
};

export default Userrow;
