"use server";
import { PrismaClient } from "@prisma/client";

import { typeUserVisible } from "@/types/user";

const prisma = new PrismaClient();

export default async function getAllUsers(): Promise<typeUserVisible[]> {
	const users = await prisma.user.findMany();

	if (!users) {
		return [];
	}

	let usersVisible: typeUserVisible[] = [];

	users.forEach((user) => {
		//change the type of user to typeUserVisible
		const userVisible: typeUserVisible = {
			id: user.id,
			name: user.name,
			email: user.email,
			department: user.department,
			profilePic: user.profilePic,
			permissions: user.permissions,
		};

		usersVisible.push(userVisible);
	});

	return usersVisible;
}

export async function getAUser(id: string): Promise<typeUserVisible | null> {
	const user = await prisma.user.findUnique({
		where: {
			id: id,
		},
	});

	if (!user) {
		return null;
	}

	//change the type of user to typeUserVisible
	const userVisible: typeUserVisible = {
		id: user.id,
		name: user.name,
		email: user.email,
		department: user.department,
		profilePic: user.profilePic,
		permissions: user.permissions,
	};

	return userVisible;
}

export async function updateUser(
	id: string,
	data: any
): Promise<typeUserVisible | null> {
	const user = await prisma.user.update({
		where: {
			id: id,
		},
		data: data,
	});

	if (!user) {
		return null;
	}

	//change the type of user to typeUserVisible
	const userVisible: typeUserVisible = {
		id: user.id,
		name: user.name,
		email: user.email,
		department: user.department,
		profilePic: user.profilePic,
		permissions: user.permissions,
	};

	return userVisible;
}

export async function deleteUser(id: string): Promise<typeUserVisible | null> {
	const user = await prisma.user.delete({
		where: {
			id: id,
		},
	});

	if (!user) {
		return null;
	}

	//change the type of user to typeUserVisible
	const userVisible: typeUserVisible = {
		id: user.id,
		name: user.name,
		email: user.email,
		department: user.department,
		profilePic: user.profilePic,
		permissions: user.permissions,
	};

	return userVisible;
}
