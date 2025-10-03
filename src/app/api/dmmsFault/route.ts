import db from "@/db/db";

export async function GET() {
	const data = await db.controlRoomFaults.findMany({});

	return Response.json({ data });
}

export async function POST(request: Request) {
	//const { faultId, complete } = await request.json();
	//let data = await db.controlRoomFaults.findFirst({
	//	where: { faultID: faultId },
	//});
	//console.log("data", data);
	//	if (data) {
	//	data = await db.controlRoomFaults.update({
	//		where: { id: data.id },
	//		data: { DMMSDONE: complete },
	//	});
	//} else {
	//		data = await db.controlRoomFaults.create({
	//			data: { faultID: faultId, DMMSDONE: complete },
	//		});
	//}
	//	return Response.json({ data });
}
