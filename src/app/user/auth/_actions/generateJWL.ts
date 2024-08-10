import jwt from "jsonwebtoken";

import { typeUserVisible } from "@/types/user";
import { isErrored } from "stream";

function generateJwtToken(user: typeUserVisible): string {
	const secretKey = process.env.JWT_SECRET; // Replace with your own secret key

	if (!secretKey) {
		throw new Error("JWT Secret key is not set");
	}

	const userInfo = {
		id: user.id,
		name: user.name,
		email: user.email,
		department: user.department,
		profilePic: user.profilePic,
		permissions: user.permissions,
	};

	const token = jwt.sign(userInfo, secretKey, {
		expiresIn: "1day",
	});

	return token;
}

export default generateJwtToken;
