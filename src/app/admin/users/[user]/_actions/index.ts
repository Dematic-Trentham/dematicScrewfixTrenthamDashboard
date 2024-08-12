"use server";
import { PrismaClient } from "@prisma/client";

import { typeUserVisible } from "@/types/user";

const prisma = new PrismaClient();

//get one user from the server
export async function getUser(
	id: string
): Promise<typeUserVisible | { error: string }> {
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
export async function deleteUser(id: string): Promise<boolean> {
	//if id is not a string, return an error
	if (typeof id !== "string") {
		return false;
	}

	//delete the user
	const result = await prisma.user.delete({
		where: {
			id: id,
		},
	});

	//if the user is not found, return an error
	if (!result) {
		return false;
	}

	//return true if the user was deleted
	return true;
}

//modify a user on the server
export async function modifyUser(
	user: typeUserVisible
): Promise<typeUserVisible | { error: string }> {
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
export async function getAllPermissions() {
	console.log("getAllPermissions");
	//get all permissions from the server
	const permissions = await prisma.userPermissions.findMany();

	//	console.log("permissions", permissions);
	//if there are no permissions, return an error
	//	if (!permissions) {
	//		return { error: "No permissions found" };
	//	}
	//return the users
	return permissions;
}
