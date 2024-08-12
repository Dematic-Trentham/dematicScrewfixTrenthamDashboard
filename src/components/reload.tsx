"use client";
import { useEffect } from "react";
import { useCookies } from "next-client-cookies";

const ReloadPage: React.FC = () => {
	const cookies = useCookies();

	useEffect(() => {
		const interval = setInterval(() => {
			const hasCookie = cookies.get("reloadNeeded");

			if (hasCookie) {
				cookies.remove("reloadNeeded");
				location.reload();
			}
		}, 500);

		return () => {
			clearInterval(interval);
		};
	}, []);

	return null;
};

export default ReloadPage;
