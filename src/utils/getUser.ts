"use server";
import { env } from "process";

import { getCookies } from "next-client-cookies/server";

import { decodeJWT } from "@/utils/decodeJWT";
//import { typeUserVisible } from "@/types/user";

const getUser = async () => {
	const cookies = getCookies();

	//get the cookie
	const cookie = cookies.get("user-token");

	//if no cookie return null
	if (!cookie) {
		return null;
	}

	//decode the JWT
	const user = decodeJWT(cookie);

	//if the JWT is invalid return null
	if (!user) {
		return null;
	}

	//if expired return null
	if (user.exp < Date.now() / 1000) {
		return null;
	}

	return user;
};

const isLoggedIn = async () => {
	const user = await getUser();

	if (!user) {
		return false;
	}

	return true;
};

const hasPermission = async (permission: string) => {
	const user = await getUser();

	if (!user || !user.permissions || typeof user.permissions !== "string") {
		return false;
	}

	const permissions = user.permissions.split(",");

	console.log(env.admin_allowed_all_pages);

	if (env.admin_allowed_all_pages === "true" && permissions.includes("admin")) {
		return true;
	}

	if (!permissions.includes(permission)) {
		return false;
	}

	return true;
};

export { getUser, isLoggedIn, hasPermission };
