import path from "path/win32";

import { NextResponse } from "next/server";

const versionFilePath = path.join("./version.txt");

export async function GET() {
	let version = process.env.APP_VERSION || "dev";

	if (version === "dev") {
		try {
			const fs = await import("fs/promises");

			console.log("Reading version from file:", versionFilePath);

			version = await fs.readFile(versionFilePath, "utf-8");
		} catch (err) {
			console.error("Failed to read version file:", err);
		}
	}

	return NextResponse.json({
		version: version.trim(),
	});
}
