import AdminUserContent from "./content";

import { hasPermission } from "@/utils/getUser";

export default async function UserPage(
    props: {
        params: Promise<{ user: string }>;
    }
) {
    const params = await props.params;
    if (!(await hasPermission("admin"))) {
		//console.log(hasPermission("admin"));

		return <p>You dont have permission</p>;
	}

    return <AdminUserContent user={params.user} />;
}
