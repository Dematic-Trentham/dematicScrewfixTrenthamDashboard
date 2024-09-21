import React from "react";

import AdminLinksContent from "./content";

import { hasPermission } from "@/utils/getUser";

const Links = async () => {
	if (!(await hasPermission("admin"))) {
		//console.log(hasPermission("admin"));

		return <p>You dont have permission</p>;
	}

	return <AdminLinksContent />;
};

export default Links;
