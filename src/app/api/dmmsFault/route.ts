import db from "@/db/db";

export async function GET() {
	const data = await db.controlRoomFaults.findMany({});

	return Response.json({ data });
}

export async function POST(request: Request) {
	const { faultId, complete } = await request.json();

	const data = await db.controlRoomFaults.updateMany({
		where: { faultID: faultId },
		data: { DMMSDONE: complete },
	});

	return Response.json({ data });
}
