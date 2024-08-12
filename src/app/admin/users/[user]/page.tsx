import AdminUserContent from "./content";

import { hasPermission } from "@/utils/getUser";

export default async function UserPage({
	params,
}: {
	params: { user: string };
}) {
	if (!(await hasPermission("admin"))) {
		//console.log(hasPermission("admin"));

		return <p>You dont have permission</p>;
	}

	return <AdminUserContent user={params.user} />;
}
