import fs from "fs";
import { join } from "path";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const srcDir = "/home/lobst/jwl_nextjs_auth/src/";

let permissions = [];

function readFilesRecursively(dir) {
	const files = fs.readdirSync(dir);

	return files.reduce((acc, file) => {
		const filePath = join(dir, file);

		if (fs.statSync(filePath).isDirectory()) {
			readFilesRecursively(filePath);
		}
		if (fs.statSync(filePath).isFile()) {
			checkFile(filePath);
		}
	}, []);
}

function checkFile(filePath) {
	const file = fs.readFileSync(filePath, "utf8");
	const lines = file.split("\n");

	lines.forEach((line, i) => {
		if (line.includes(`hasPermission("`)) {
			const matches = line.match(/hasPermission\("(.+?)"\)/g);

			if (matches) {
				matches.forEach((match) => {
					const permission = match.match(/hasPermission\("(.+?)"\)/)[1];

					if (!permissions.includes(permission)) {
						permissions.push(permission);
					}
				});
			}
		}
	});
}

async function main() {
	await readFilesRecursively(srcDir);

	//check if any permissions need to be deleted
	const allPermissions = await prisma.userPermissions.findMany();

	allPermissions.forEach(async (permission) => {
		if (!permissions.includes(permission.name)) {
			const result = await prisma.userPermissions.delete({
				where: {
					id: permission.id,
				},
			});

			console.log(`Permission deleted: ${result.name}`);
		}
	});

	permissions.forEach(async (permission) => {
		//does permission already exist?
		const existingPermission = await prisma.userPermissions.findFirst({
			where: {
				name: permission,
			},
		});

		if (existingPermission) {
			return;
		}
		const result = await prisma.userPermissions.create({
			data: {
				name: permission,
			},
		});

		console.log(`Permission created: ${result.name}`);
	});

	prisma.$disconnect();

	console.log("Done 😊 - Database Updated, don't forget to add comments");
}

main();
