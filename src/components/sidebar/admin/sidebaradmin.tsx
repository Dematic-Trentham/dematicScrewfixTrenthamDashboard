"use server";
import React from "react";
import { FaCogs } from "react-icons/fa";
import { FaUsersGear } from "react-icons/fa6";

import Sidebarparentcomponent from "../sidebarparentcomponent";

import { hasPermission } from "@/utils/getUser";
import HorizontalBar from "@/components/visual/horizontalBar";

interface SidebaradminProps {
	isHidden: boolean;
}

const Sidebaradmin = async (props: SidebaradminProps) => {
	const userHasPermission = await hasPermission("admin");

	if (!userHasPermission) {
		return <> </>;
	}

	return (
		<>
			<HorizontalBar />
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
		</>
	);
};

export default Sidebaradmin;
