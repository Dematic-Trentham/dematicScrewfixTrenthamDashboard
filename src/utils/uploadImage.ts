"use server";
import fs from "fs";
import path from "path";
import { env } from "process";

import { v4 as uuidv4 } from "uuid";

const uploadImage = async (
	data: FormData
): Promise<{ error?: string; filePath?: string }> => {
	return new Promise(async (resolve) => {
		const file = data.get("fileUpload") as File;

		const uploadDir = env.image_upload_directory;

		//throw an error if the upload directory is not set
		if (!uploadDir) {
			console.error("Image upload directory is not set");
			throw new Error("Image upload directory is not set");
		}
		const username = data.get("username");

		//throw an error if the username is not set
		if (!username || typeof username !== "string") {
			resolve({ error: "Username is not set" });

			return;
		}

		//is the file a file?
		if (!file) {
			resolve({ error: "No file uploaded" });

			return;
		}

		//is the file an image?
		if (!file.type.startsWith("image")) {
			resolve({ error: "File is not an image" });

			return;
		}

		//is the file too large?
		if (file.size > 1024 * 1024) {
			resolve({
				error: "File is too large. Please  upload a file smaller than 1MB",
			});

			return;
		}

		//allowed file types
		const allowedTypes = ["image/png", "image/jpeg", "image/gif"];

		//is the file type allowed?
		if (!allowedTypes.includes(file.type)) {
			resolve({ error: "File type not allowed, Only PNG, JPEG, and GIF" });

			return;
		}

		const blob = data.get("fileData") as Blob;

		//is the file a blob?
		if (!blob) {
			resolve({ error: "No file data uploaded" });

			return;
		}

		console.log("uploadDir", uploadDir);

		const realFolderPath = "./public" + uploadDir;

		console.log("realFolderPath", realFolderPath);
		//if the directory does not exist, create it
		if (!fs.existsSync(realFolderPath)) {
			console.log("Creating directory", realFolderPath);
			fs.mkdirSync(realFolderPath, { recursive: true });
		}

		// Create a unique filename for the uploaded image "username-uuid" if the file already exists try again 5 times
		let filename: string;
		let attempts = 0;

		const generateUniqueFilename = (
			username: string,
			extension: string
		): string => {
			const uniqueId = uuidv4();

			return `${username}-${uniqueId}${extension}`;
		};

		do {
			filename = generateUniqueFilename(username, path.extname(file.name));
			attempts++;
		} while (fs.existsSync(path.join(uploadDir, filename)) && attempts < 5);

		if (attempts === 5 && fs.existsSync(path.join(uploadDir, filename))) {
			throw new Error("Failed to generate a unique filename");
		}

		// Create the full path to save the image
		const imagePath = path.join(uploadDir, filename);

		// Save the image
		const realFilePath = "./public" + imagePath;

		fs.writeFile(realFilePath, Buffer.from(await blob.arrayBuffer()), (err) => {
			if (err) {
				resolve({ error: "Failed to save the image" });

				return;
			}

			resolve({ filePath: imagePath });
		});
	});
};

export default uploadImage;
