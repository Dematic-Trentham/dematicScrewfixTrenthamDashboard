import React from "react";
import { FaCogs } from "react-icons/fa";
import { FaUsersGear } from "react-icons/fa6";

import Sidebarparentcomponent from "../sidebarparentcomponent";

import { hasPermission } from "@/utils/getUser";
import HorizontalBar from "@/components/visual/horizontalBar";

interface SidebaradminProps {
	isHidden: boolean;
}

const Sidebaradmin = (props: SidebaradminProps) => {
	if (!hasPermission("admin")) {
		return <> </>;
	}

	return (
		<>
			<HorizontalBar />
			<Sidebarparentcomponent
				icon={<FaCogs />}
				isHidden={props.isHidden}
				link="/admin/parameters"
				text="Parameters"
			/>
			<Sidebarparentcomponent
				icon={<FaUsersGear />}
				isHidden={props.isHidden}
				link="/admin/users"
				text="Users"
			/>
		</>
	);
};

export default Sidebaradmin;
