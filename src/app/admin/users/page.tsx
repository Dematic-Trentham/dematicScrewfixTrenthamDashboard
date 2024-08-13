import React from "react";

import AdminUsersContent from "./content";

import { hasPermission } from "@/utils/getUser";

const Users = async () => {
	if (!(await hasPermission("admin"))) {
		//console.log(hasPermission("admin"));

		return <p>You dont have permission</p>;
	}

	return <AdminUsersContent />;
};

export default Users;
