"use server";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

import generateJwtToken from "./../../_actions/generateJWL";

const prisma = new PrismaClient();

export default async function loginUser(data: any) {
	//make an error object
	const error = {
		email: "",
		password: "",
		error: "",
	};

	//make sure the email is not already in use
	const user = await prisma.user.findUnique({
		where: {
			email: data.email,
		},
	});

	// Check if the email exists
	if (!user) {
		error.error = "Email not found";

		return error;
	}

	// Check if the password is correct
	const passwordMatch = await bcrypt.compare(data.password, user.password);

	if (!passwordMatch) {
		error.error = "Password incorrect";

		return error;
	}

	//all good, make an object for the user
	const userObjectLogin = {
		id: user.id,
		name: user.name,
		email: user.email,
		department: user.department,
		profilePic: user.profilePic,
		permissions: user.permissions,
	};

	//make jwt token
	const token = generateJwtToken(userObjectLogin);

	//make sure the token is created
	if (!token) {
		error.error = "Unknown error";
	}

	//return the token

	return { token, result: "success" };
}
