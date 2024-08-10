import React from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
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
      <TableCell>{props.user.permissions}</TableCell>
      <TableCell>
        <Button>View</Button>
        <Button>Edit</Button>
        <Button>Delete</Button>
      </TableCell>
    </TableRow>
  );
};

export default Userrow;
