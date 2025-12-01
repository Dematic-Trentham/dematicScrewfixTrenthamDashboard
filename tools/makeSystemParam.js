import fs from "fs";
import { join } from "path";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const srcDir = "./src/";

let systemParams = [];

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

	console.log(systemParams);
}

function checkFile(filePath) {
	const file = fs.readFileSync(filePath, "utf8");
	const lines = file.split("\n");

	lines.forEach((line, i) => {
		if (line.includes("db.dashboardSystemParameters.findFirst({")) {
			console.log("Found in file:", filePath, "at line:", i + 1);

			//look a few lines below for where: {
			//parameter: "constainerName_plc",
			for (let j = i; j < i + 10 && j < lines.length; j++) {
				console.log("Checking line:", lines[j]);
				if (lines[j].includes("parameter:")) {
					const match = lines[j].match(/parameter:\s*["'`](.+?)["'`]/);

					console.log("Match:", match);

					if (match) {
						const parameter = match[1];

						if (!systemParams.includes(parameter)) {
							systemParams.push(parameter);
						}
					}
				}
			}
		}
	});
}

readFilesRecursively(srcDir);
