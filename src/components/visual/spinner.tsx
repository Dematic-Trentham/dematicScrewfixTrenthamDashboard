import { ImSpinner6 } from "react-icons/im";
import React from "react";

interface SpinnerProps {
	children: React.ReactNode;
}

const Spinner: React.FC<SpinnerProps> = (props) => {
	return (
		<div className="flex h-full flex-col items-center justify-center space-x-4 space-y-4">
			<div className="animate-spinner-linear-spin">
				<ImSpinner6 size={50} />
			</div>

			{props.children}
		</div>
	);
};

export default Spinner;
