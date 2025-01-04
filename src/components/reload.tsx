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

	useEffect(() => {
		let lastActivity = Date.now();
		const refreshAfter = 60 * 60 * 1000; // 1 hour in milliseconds

		function resetActivity() {
			lastActivity = Date.now();
		}

		window.onload = resetActivity;
		window.onmousemove = resetActivity;

		const activityInterval = setInterval(() => {
			if (Date.now() - lastActivity > refreshAfter) {
				window.location.reload();
			}
		}, 60000); // Check every minute

		return () => {
			clearInterval(activityInterval);
			window.onload = null;
			window.onmousemove = null;
			
		};
	}, []);

	return null;
};

export default ReloadPage;
