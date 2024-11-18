"use server"
// import { use } from "react";

import AdminUserContent from "./content";

import "react-tabs/style/react-tabs.css";

import { hasPermission } from "@/utils/getUser";

type UserPageProps = Promise<{ user: string }>;

export default async function UserPage(props: { params: UserPageProps }) {

	const  params  = await props.params

	console.log(params);

	const permission = await hasPermission("admin");

	if (!permission) {
		//console.log(permission);

		return <p>You dont have permission</p>;
	}


	return <AdminUserContent user={await params.user} />;

}
