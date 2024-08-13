"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { deleteCookie, setCookie } from "cookies-next";

import Spinner from "@/components/visual/spinner";
import Panel from "@/components/panels/panelMiddle";

const LogoutPage: React.FC = () => {
	const router = useRouter();

	useEffect(() => {
		//delete the token as a cookie
		deleteCookie("user-token");
		setCookie("reloadNeeded", "true");

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

		router.back();
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
