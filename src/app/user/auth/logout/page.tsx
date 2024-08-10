"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import Spinner from "@/components/visual/spinner";
import Panel from "@/components/panels/panel";

const LogoutPage: React.FC = () => {
	const router = useRouter();

	useEffect(() => {
		// Delete user's token from local storage
		localStorage.removeItem("token");

		window.dispatchEvent(new Event("storage"));

		// Get the return URL from the query parameters
		const returnUrl = new URLSearchParams(location.search).get("returnUrl");

		//toast the user
		toast("Logout success", {
			position: "bottom-right",
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
		});

		// Redirect to the dashboard
		if (!returnUrl) {
			router.push("/");

			return;
		}

		// Redirect to the return path
		router.push(returnUrl);
	});

	return (
		<div>
			<Panel>
				<Spinner>
					<span className="visually-hidden">Loading...</span>
				</Spinner>
			</Panel>
		</div>
	);
};

export default LogoutPage;
