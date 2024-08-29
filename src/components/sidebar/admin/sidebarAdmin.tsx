"use server";
import React from "react";
import { FaCogs, FaUserShield } from "react-icons/fa";
import { FaUsersGear } from "react-icons/fa6";

import Sidebarparentcomponent from "../sidebarParentComponent";
import SidebarparentcomponentGroup from "../sidebarParentComponentGroup";

import { hasPermission } from "@/utils/getUser";
import HorizontalBar from "@/components/visual/horizontalBar";

const Sidebaradmin = async () => {
	const userHasPermission = await hasPermission("admin");

	if (!userHasPermission) {
		return <> </>;
	}

	return (
		<>
			<HorizontalBar />
			<SidebarparentcomponentGroup
				icon={<FaUserShield />}
				link="/admin"
				text="Admin"
			>
				<Sidebarparentcomponent
					icon={<FaCogs />}
					link="/admin/parameters"
					text="Parameters"
				/>
				<Sidebarparentcomponent
					icon={<FaUsersGear />}
					link="/admin/users"
					text="Users"
				/>
			</SidebarparentcomponentGroup>
		</>
	);
};

export default Sidebaradmin;
