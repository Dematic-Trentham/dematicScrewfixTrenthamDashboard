import db from "@/db/db";

export async function GET() {
	const data = await db.faultText.findMany({});

	return Response.json({ data });
}
