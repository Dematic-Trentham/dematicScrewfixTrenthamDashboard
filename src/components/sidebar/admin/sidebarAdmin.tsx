"use client";

import { GoBook } from "react-icons/go";
import React, { useEffect, useState } from "react";
import { FaCogs, FaUserShield } from "react-icons/fa";
import { FaUsersGear } from "react-icons/fa6";

import Sidebarparentcomponent from "../sidebarParentComponent";
import SidebarparentcomponentGroup from "../sidebarParentComponentGroup";

import { hasPermission } from "@/utils/getUser";
import HorizontalBar from "@/components/visual/horizontalBar";

const Sidebaradmin = () => {
	const [userHasPermission, setUserHasPermission] = useState(false);

	useEffect(() => {
		const checkPermission = async () => {
			const hasPerm = await hasPermission("admin");
			setUserHasPermission(hasPerm);
		};
		checkPermission();
	}, []);

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
				<Sidebarparentcomponent
					icon={<GoBook />}
					link="/admin/links"
					text="Links"
				/>
			</SidebarparentcomponentGroup>
		</>
	);
};

export default Sidebaradmin;
