"use server";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

import { validateSignup } from "../_util/validation";
import generateJwtToken from "../../_actions/generateJWT";

const prisma = new PrismaClient();

export default async function signupUser(data: any) {
	// Validate the form data
	const validationError = validateSignup(data);

	if (validationError) {
		const error = {
			error: "Validation error",
		};

		return error;
	}

	//make an error object
	const error = {
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
		error: "",
	};

	//make sure the email is not already in use
	const user = await prisma.dashboardUsers.findUnique({
		where: {
			email: data.email,
		},
	});

	if (user) {
		error.email = "Email already in use";
	}

	// Hash the password
	const SALT_ROUNDS = process.env.SALT_ROUNDS;

	//make sure the salt is set
	if (!SALT_ROUNDS) {
		error.error = "Unknown error";

		throw new Error("Salt rounds not set");
	}

	const hashedPassword = await bcrypt.hash(
		data.password,
		parseInt(SALT_ROUNDS)
	);

	//make sure the password is hashed
	if (!hashedPassword) {
		error.error = "Unknown error";
	}

	// Check if there are any errors
	if (
		error.email ||
		error.password ||
		error.name ||
		error.confirmPassword ||
		error.error
	) {
		return error;
	}

	//all good, make an object for the user
	const userObject = {
		name: data.name,
		email: data.email,
		password: hashedPassword,
		department: process.env.DEFAULT_USER_DEPARTMENT,
		permissions: "",
	};

	//is this the first user? if so, make them an admin
	const userCount = await prisma.dashboardUsers.count();

	if (userCount === 0) {
		userObject.permissions = "admin";

		console.log("First user, making them an admin");
	}

	// Add the user to the database
	const creationResult = await prisma.dashboardUsers.create({
		data: userObject,
	});

	// Check if the user was created
	if (!creationResult) {
		error.error = "Unknown error";

		return error;
	}

	const userObjectCreated = {
		id: creationResult.id,
		name: creationResult.name,
		email: creationResult.email,
		department: creationResult.department,
		profilePic: creationResult.profilePic,
		permissions: creationResult.permissions,
		disabled: creationResult.disabled,
	};

	//make jwt token
	const token = generateJwtToken(userObjectCreated);

	//make sure the token is created
	if (!token) {
		error.error = "Unknown error";
	}

	//return the token

	return { token, result: "success" };
}
