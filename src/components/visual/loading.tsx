import React from "react";

import Panel from "@/components/panels/panelMiddle";
import Spinner from "@/components/visual/spinner";

interface LoadingProps {
	text?: string;
}

const Loading: React.FC<LoadingProps> = ({ text }) => {
	return (
		<div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
			<div className="rounded-lg bg-white shadow-lg">
				<div className="flex items-center justify-center pt-2 text-black">
					<div>Content Loading</div>
				</div>
				<div className="p-36">
					<Spinner />
				</div>
				{text && (
					<div className="px-4 pb-4 text-center text-gray-600">{text}</div>
				)}
			</div>
		</div>
	);
};

export default Loading;
