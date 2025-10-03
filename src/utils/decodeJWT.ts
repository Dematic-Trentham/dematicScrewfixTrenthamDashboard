export function decodeJWT(token: string) {
	if (!token) {
		return;
	}

	let decodedObject;

	try {
		const base64Url = token.split(".")[1];
		const base64 = base64Url.replace("-", "+").replace("_", "/");
		const decoded = atob(base64);

		decodedObject = JSON.parse(decoded);
	} catch (error) {
		error;

		return null;
	}

	return decodedObject;
}

export default {};
