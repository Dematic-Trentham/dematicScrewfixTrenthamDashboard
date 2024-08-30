"use server";
import { PrismaClient } from "@prisma/client";

import { typeUserVisible } from "@/types/user";
import uploadImage from "@/utils/uploadImage";
import updateUserToken from "@/app/user/auth/_actions/updateUserToken";
import { getUser as getUserCookie } from "@/utils/getUser";

const prisma = new PrismaClient();

//get one user from the server
export async function getUser(): Promise<typeUserVisible | { error: string }> {
	const userCookie = await getUserCookie();

	if (!userCookie) {
		return { error: "User not found" };
	}

	const idFromCookie = userCookie.id;

	//if id is not a string, return an error
	if (typeof idFromCookie !== "string") {
		return { error: "Invalid id" };
	}

	const userResult = await prisma.dashboardUsers.findUnique({
		where: {
			id: idFromCookie,
		},
	});

	//if the user is not found, return an error
	if (!userResult) {
		return { error: "User not found" };
	}

	//convert the user to a typeUserVisible object
	const user: typeUserVisible = {
		id: userResult.id,
		name: userResult.name,
		email: userResult.email,
		department: userResult.department,
		profilePic: userResult.profilePic,
		permissions: userResult.permissions,
		disabled: userResult.disabled,
	};

	//get the user data from the server
	return user;
}

//modify a user on the server
export async function modifyUser(
	user: typeUserVisible
): Promise<typeUserVisible | { error: string }> {
	//if user is not a typeUserVisible object, return an error

	const userCookie = await getUserCookie();

	if (!userCookie) {
		return { error: "User not found" };
	}

	const idFromCookie = userCookie.id;

	//if id is not a string, return an error
	if (typeof idFromCookie !== "string") {
		return { error: "Invalid id" };
	}

	if (!user) {
		return { error: "Invalid user" };
	}

	if (!user.id) {
		return { error: "Invalid user" };
	}

	//update the user
	const result = await prisma.dashboardUsers.update({
		where: {
			id: idFromCookie,
		},
		data: {
			name: user.name,
			email: user.email,
			department: user.department || "", // Provide a default value if department is null
			profilePic: user.profilePic || "", // Provide a default value if profilePic is null
			permissions: user.permissions,
		},
	});

	//if the user is not found, return an error
	if (!result) {
		return { error: "User not found" };
	}

	//return the updated user
	return user;
}

//upload a user profile picture to the server
export async function uploadProfilePic(
	data: FormData
): Promise<{ error?: string; token?: string }> {
	const userCookie = await getUserCookie();

	if (!userCookie) {
		return { error: "User not found" };
	}

	const idFromCookie = userCookie.id;

	const { error, filePath } = await uploadImage(data);

	if (error) {
		return { error };
	}

	if (!filePath) {
		return { error: "File path is undefined" };
	}

	const result = await prisma.dashboardUsers.update({
		where: {
			id: idFromCookie,
		},
		data: {
			profilePic: filePath,
		},
	});

	if (!result) {
		return { error: "User not found" };
	}

	const newToken = await updateUserToken();

	if ("error" in newToken) {
		return { error: newToken.error };
	}

	const token = newToken.token;

	return { token };
}

export async function getAllPermissions(): Promise<
	{ id: string; name: string; description: string | null }[] | { error: string }
> {
	//get all permissions from the server
	const permissions = await prisma.dashboardUsersPermissions.findMany();

	//if there are no permissions, return an error
	if (!permissions) {
		return { error: "No permissions found" };
	}

	//return the permissions
	return permissions;
}
