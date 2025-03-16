import { RxRocket } from "react-icons/rx";
import React from "react";

interface SpinnerProps {
	children: React.ReactNode;
}

const Spinner: React.FC<SpinnerProps> = (props) => {
	return (
		<div className="flex h-full flex-col items-center justify-center space-x-4 space-y-4">
			<div className="animate-spin">
				<div className="h-36 w-36">
					<RxRocket size={50} />
				</div>
			</div>

			{props.children}
		</div>
	);
};

export default Spinner;
