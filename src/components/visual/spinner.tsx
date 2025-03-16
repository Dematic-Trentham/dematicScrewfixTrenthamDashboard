import { MdOutlineSatelliteAlt } from "react-icons/md";
import React from "react";
import Image from "next/image";

import earth from "./../../app/images/earth.gif";

const Spinner: React.FC = () => {
	return (
		<div className="flex flex-col items-center justify-center">
			<div className="fixed self-center">
				<div
					className="rounded-full"
					style={{
						width: 200,
						height: 200,
						background: "radial-gradient(circle, black, transparent)",
					}}
				/>
			</div>
			<div className="fixed self-center">
				<Image alt="" height={100} src={earth} width={100} />
			</div>
			<div className="fixed self-center">
				<div className="flex h-full flex-col items-center justify-center space-x-4 space-y-4">
					<div className="animate-spin">
						<div className="h-36 w-36">
							<MdOutlineSatelliteAlt size={50} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Spinner;
