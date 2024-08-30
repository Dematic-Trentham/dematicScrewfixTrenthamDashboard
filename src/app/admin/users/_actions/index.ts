"use server";
import { PrismaClient } from "@prisma/client";

import { typeUserVisible } from "@/types/user";
import { hasPermission } from "@/utils/getUser";

const prisma = new PrismaClient();

export default async function getAllUsers(): Promise<typeUserVisible[]> {
	if (!(await hasPermission("admin"))) {
		return [];
	}

	const users = await prisma.dashboardUsers.findMany({
		orderBy: {
			createdAt: "asc",
		},
	});

	if (!users) {
		return [];
	}

	let usersVisible: typeUserVisible[] = [];

	users.forEach((user: typeUserVisible) => {
		//change the type of user to typeUserVisible
		const userVisible: typeUserVisible = {
			id: user.id,
			name: user.name,
			email: user.email,
			department: user.department,
			profilePic: user.profilePic,
			permissions: user.permissions,
			disabled: user.disabled,
		};

		usersVisible.push(userVisible);
	});

	return usersVisible;
}

export async function getAUser(id: string): Promise<typeUserVisible | null> {
	if (!(await hasPermission("admin"))) {
		return null;
	}
	const user = await prisma.dashboardUsers.findUnique({
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
		disabled: user.disabled,
	};

	return userVisible;
}

export async function updateUser(
	id: string,
	data: any
): Promise<typeUserVisible | null> {
	if (!(await hasPermission("admin"))) {
		return null;
	}
	const user = await prisma.dashboardUsers.update({
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
		disabled: user.disabled,
	};

	return userVisible;
}

export async function deleteUser(id: string): Promise<typeUserVisible | null> {
	if (!(await hasPermission("admin"))) {
		return null;
	}

	const user = await prisma.dashboardUsers.delete({
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
		disabled: user.disabled,
	};

	return userVisible;
}
