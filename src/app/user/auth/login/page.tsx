"use client";
import React, { useState, FormEvent } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { setCookie } from "cookies-next";

import signupUser from "./_actions/loginuser";

import PanelMiddle from "@/components/panels/panelMiddle";

const Login = () => {
	const returnPath = useSearchParams().get("returnPath");

	const router = useRouter();

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<{
		email: string;
		password: string;
		error: string;
	} | null>(null);

	async function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsLoading(true);
		setError(null); // Clear previous errors when a new request starts

		const formData = new FormData(event.currentTarget);
		const data = Object.fromEntries(formData.entries());

		const result = (await signupUser(data)) as {
			error: string;
			token?: string;
			result?: string;
		};

		if (result?.result === "success" && result.token) {
			// Redirect to the dashboard

			toast("Login success", {
				position: "bottom-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});

			//set the token as a cookie
			setCookie("user-token", result.token, {
				maxAge: 60 * 60 * 24 * 7, // 1 week
			});
			setCookie("reloadNeeded", "true");

			setIsLoading(false);

			router.back();
		} else {
			setError(
				result as {
					email: string;
					password: string;
					error: string;
				} | null
			);

			setIsLoading(false);
		}
	}

	const [isVisiblePass, setIsVisiblePass] = useState(false);
	const toggleVisibilityPass = () => setIsVisiblePass(!isVisiblePass);

	return (
		<PanelMiddle title="Login User">
			<form onSubmit={onSubmit}>
				<div className="flex-col gap-4 space-y-2">
					<div className="flex w-full flex-col md:flex-nowrap">
						{error?.error && <div style={{ color: "red" }}>{error.error}</div>}
					</div>
					<div className="flex w-full flex-col md:flex-nowrap">
						{error?.email && <div style={{ color: "red" }}>{error.email}</div>}
						<Input
							disabled={isLoading}
							id="email"
							label="Email"
							name="email"
							placeholder="Enter your email"
							type="email"
						/>
					</div>
					<div className="flex w-full flex-col md:flex-nowrap">
						{error?.password && (
							<div style={{ color: "red" }}>{error.password}</div>
						)}
						<Input
							className=""
							disabled={isLoading}
							endContent={
								<button
									aria-label="toggle password visibility"
									className="focus:outline-none"
									type="button"
									onClick={toggleVisibilityPass}
								>
									{isVisiblePass ? (
										<FaEyeSlash className="pointer-events-none text-2xl text-default-400" />
									) : (
										<FaEye className="pointer-events-none text-2xl text-default-400" />
									)}
								</button>
							}
							id="password"
							label="Password"
							name="password"
							placeholder="Enter your password"
							type={isVisiblePass ? "text" : "password"}
						/>
					</div>
					<div className="flex flex-wrap justify-center gap-4 md:flex-nowrap">
						<Button className="w-52" color="primary" type="submit">
							{isLoading ? "Loading..." : "Login"}
						</Button>
					</div>
				</div>
			</form>
		</PanelMiddle>
	);
};

export default Login;
