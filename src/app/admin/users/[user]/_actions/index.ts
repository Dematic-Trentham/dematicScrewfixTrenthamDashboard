"use server";
import { PrismaClient } from "@prisma/client";

import { typeUserVisible } from "@/types/user";
import uploadImage from "@/utils/uploadImage";
import updateUserToken from "@/app/user/auth/_actions/updateUserToken";
import { hasPermission } from "@/utils/getUser";

const prisma = new PrismaClient();

//get one user from the server
export async function getUser(
	id: string
): Promise<typeUserVisible | { error: string }> {
	if (!hasPermission("admin")) {
		return { error: "Permission denied" };
	}

	//if id is not a string, return an error
	if (typeof id !== "string") {
		return { error: "Invalid id" };
	}

	const userResult = await prisma.user.findUnique({
		where: {
			id: id,
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
	};

	//get the user data from the server
	return user;
}

//delete a user from the server
//delete a user from the server
export async function deleteUser(
	id: string
): Promise<boolean | { error: string }> {
	if (!hasPermission("admin")) {
		return { error: "Permission denied" };
	}
	//if id is not a string, return an error
	if (typeof id !== "string") {
		return { error: "Invalid id" };
	}

	//delete the user
	const result = await prisma.user.delete({
		where: {
			id: id,
		},
	});

	//if the user is not found, return an error
	if (!result) {
		return { error: "User not found" };
	}

	//return true if the user was deleted
	return true;
}

//modify a user on the server
export async function modifyUser(
	user: typeUserVisible
): Promise<typeUserVisible | { error: string }> {
	if (!hasPermission("admin")) {
		return { error: "Permission denied" };
	}
	//if user is not a typeUserVisible object, return an error
	if (!user) {
		return { error: "Invalid user" };
	}

	if (!user.id) {
		return { error: "Invalid user" };
	}

	//update the user
	const result = await prisma.user.update({
		where: {
			id: user.id,
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

//get all permissions from the server

export async function getAllPermissions(): Promise<
	{ id: string; name: string }[] | { error: string }
> {
	if (!(await hasPermission("admin"))) {
		return { error: "Permission denied" };
	}

	//get all permissions from the server
	const permissions = await prisma.userPermissions.findMany();

	//if there are no permissions, return an error
	if (!permissions) {
		return { error: "No permissions found" };
	}

	//return the permissions
	return permissions;
}

//upload a user profile picture to the server
export async function uploadProfilePic(
	data: FormData
): Promise<{ error?: string; token?: string }> {
	if (!hasPermission("admin")) {
		return { error: "Permission denied" };
	}

	const { error, filePath } = await uploadImage(data);

	if (error) {
		return { error };
	}

	if (!filePath) {
		return { error: "File path is undefined" };
	}

	if (typeof data.get("id") !== "string") {
		return { error: "Invalid id" };
	}

	const result = await prisma.user.update({
		where: {
			id: data.get("id") as string,
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
