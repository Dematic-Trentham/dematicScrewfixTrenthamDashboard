"use client";
import React, { useEffect, useState } from "react";
import { FaAngleDown, FaUserAstronaut } from "react-icons/fa";
import Link from "next/link";

import HorizontalBar from "../visual/horizontalBar";

import { useUser } from "@/utils/getUser";

interface UserBoxProps {}

const UserBox: React.FC<UserBoxProps> = () => {
  const [returnPath, setReturnPath] = useState("");
  const [isShowing, setIsShowing] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    //get the return URL
    setReturnPath(encodeURIComponent(window.location.pathname));
  }, []);

  //if no user is logged in show the login button
  if (!user) {
    return (
      <div className={`flex w-56 flex-wrap transition-all duration-500 ${isShowing ? "bg-slate-400" : ""}`}>
        <div className="p-1">
          <div className="h-14 rounded-full bg-orange-700 p-3">
            <FaUserAstronaut className="h-full w-full" />
          </div>
        </div>

        <div className="user-info flex-col self-center text-xs">
          <div>Not Logged In</div>
          <div>
            Please{" "}
            <Link className="hover:underline" href={`/user/auth/login?returnPath=${returnPath}`}>
              Login
            </Link>{" "}
            Or{" "}
            <Link className="hover:underline" href={`/user/auth/signup?returnPath=${returnPath}`}>
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const userboxTrigger = (
    <div className={`flex w-56 flex-wrap transition-all duration-500 ${isShowing ? "bg-slate-400" : ""}`}>
      <div className="p-1">
        {user.profilePic ? (
          <img alt="User Profile" className="h-14 w-14 rounded-full" src={user.profilePic} />
        ) : (
          <div className="h-14 rounded-full bg-orange-700 p-3">
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

  return (
    <div className="" onMouseEnter={() => setIsShowing(true)} onMouseLeave={() => setIsShowing(false)}>
      {userboxTrigger}

      <div
        className={`fixed right-1 top-16 w-56 rounded-b bg-slate-400 p-2 shadow-md transition-all duration-500 ${
          isShowing ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex flex-col items-center justify-center space-y-2 text-sm">
          <HorizontalBar />
          <div className="text-center">
            <Link href="/user/profile">My Profile</Link>
          </div>
          <HorizontalBar />
          <div className="text-center">
            <Link href={`/user/auth/logout?returnPath=${returnPath}`}>Logout</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBox;
