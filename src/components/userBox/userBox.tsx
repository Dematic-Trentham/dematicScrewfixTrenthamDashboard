"use client"
import React from "react";
import { FaAngleDown, FaUserAstronaut } from "react-icons/fa";
import Link from "next/link";

import HorizontalBar from "../visual/horizontalBar";
import HoverPopup from "../visual/hoverPopupUserBox";

import { typeUserVisible } from "@/types/user";
import { getUser } from "@/utils/getUser";

interface UserBoxProps {}

const UserBox: React.FC<UserBoxProps> = () => {
	const [user, setUser] = React.useState<typeUserVisible | null>(null);

	React.useEffect(() => {
		const fetchUser = async () => {
			const userData = await getUser();
			setUser(userData);
		};
		fetchUser();
	}, []);

	//console.log(user);

	//if no user is logged in show the login button
	if (!user) {
		return (
			<div className={`flex w-56 flex-wrap transition-all duration-500`}>
				<div className="p-1">
					<div className="size-14 rounded-full bg-orange-700 p-3">
						<FaUserAstronaut className="h-full w-full" />
					</div>
				</div>

				<div className="user-info flex-col self-center text-xs">
					<div>Not Logged In</div>
					<div>
						Please{" "}
						<Link className="hover:underline" href={`/user/auth/login`}>
							Login
						</Link>{" "}
						Or{" "}
						<Link className="hover:underline" href={`/user/auth/signup`}>
							Sign Up
						</Link>
					</div>
				</div>
			</div>
		);
	}

	const userboxTrigger = (
		<div className={`flex w-56 flex-wrap transition-all duration-500`}>
			<div className="p-1">
				{user.profilePic ? (
					<img
						alt="User Profile"
						className="size-14 rounded-full object-cover"
						src={user.profilePic}
					/>
				) : (
					<div className="size-14 rounded-full bg-orange-700 p-3">
						<FaUserAstronaut className="h-full w-full" />
					</div>
				)}
			</div>

			<div className="user-info flex-col self-center text-xs">
				<div>{user.name}</div>
				<div>{user.department}</div>
			</div>
			<div className="self-center pl-3">
				<FaAngleDown />
			</div>
		</div>
	);

	const userboxContent = (
		<div className="flex flex-col items-center justify-center space-y-2 text-sm">
			<HorizontalBar />
			<div className="text-center">
				<Link href="/user/profile">My Profile</Link>
			</div>
			<HorizontalBar />
			<div className="text-center">
				<Link href={`/user/auth/logout`}>Logout</Link>
			</div>
		</div>
	);

	//if the user is logged in show the user box
	return (
		<HoverPopup itemToHover={userboxTrigger} itemToPopUp={userboxContent} />
	);
};

export default UserBox;
