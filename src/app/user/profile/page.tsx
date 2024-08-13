import React from "react";

import ProfileContent from "./content";

import { isLoggedIn } from "@/utils/getUser";

const Profile = async () => {
	if (!(await isLoggedIn())) {
		return <p>You are not Logged in</p>;
	}

	return <ProfileContent />;
};

export default Profile;
