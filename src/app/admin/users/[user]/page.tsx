import { use } from "react";

import AdminUserContent from "./content";

import "react-tabs/style/react-tabs.css";

import { hasPermission } from "@/utils/getUser";

export default async function UserPage(props: {
	params: Promise<{ user: string }>;
}) {
	const params = use(props.params);
	const permission = await hasPermission("admin");

	if (!permission) {
		//console.log(permission);

		return <p>You dont have permission</p>;
	}

	return <AdminUserContent user={params.user} />;
}
