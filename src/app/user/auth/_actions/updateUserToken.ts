"use server";
import { PrismaClient } from "@prisma/client";

import generateJwtToken from "./generateJWT";

import { getUser } from "@/utils/getUser";

const prisma = new PrismaClient();

export default async function updateUserToken(): Promise<{
	token?: string;
	error?: string;
}> {
	//get the user data from the server
	const user = await getUser();

	// Check if the user exists
	if (!user) {
		return { error: "User not found" };
	}

	//get the user data from the server
	const userFromDb = await prisma.dashboardUsers.findUnique({
		where: {
			id: user.id ?? undefined,
		},
	});

	// Check if the email exists
	if (!userFromDb) {
		return { error: "User not found" };
	}

	//all good, make an object for the user
	const userObjectLogin = {
		id: userFromDb.id,
		name: userFromDb.name,
		email: userFromDb.email,
		department: userFromDb.department,
		profilePic: userFromDb.profilePic,
		permissions: userFromDb.permissions,
		disabled: userFromDb.disabled,
	};

	//make jwt token
	const token = generateJwtToken(userObjectLogin);

	//make sure the token is created
	if (!token) {
		return { error: "Unknown error" };
	}

	//return the token
	return { token };
}
