import { NextResponse } from "next/server";

import { v4 as uuidv4 } from "uuid";

let appId: string;

export async function GET() {
	if (!appId) {
		appId = uuidv4();
	}
	return NextResponse.json({
		return: appId,
	});
}
