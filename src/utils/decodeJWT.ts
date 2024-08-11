export function decodeJWT(token: string) {
	if (!token) {
		return;
	}
	const base64Url = token.split(".")[1];
	const base64 = base64Url.replace("-", "+").replace("_", "/");
	const object = JSON.parse(window.atob(base64));

	return object;
}

export default {};
