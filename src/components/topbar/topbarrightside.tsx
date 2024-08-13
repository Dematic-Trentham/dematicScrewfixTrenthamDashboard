import React from "react";

import UserBox from "../userBox/userBox";
import VerticalBar from "../visual/verticalBar";

interface TopBarRightSideProps {}

const TopBarRightSide = (_props: TopBarRightSideProps) => {
	return (
		<>
			<VerticalBar />
			<UserBox />
		</>
	);
};

export default TopBarRightSide;
