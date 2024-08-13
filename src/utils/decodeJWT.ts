export function decodeJWT(token: string) {
	if (!token) {
		return;
	}
	const base64Url = token.split(".")[1];
	const base64 = base64Url.replace("-", "+").replace("_", "/");
	const decoded = atob(base64);
	const decodedObject = JSON.parse(decoded);

	return decodedObject;
}

export default {};
