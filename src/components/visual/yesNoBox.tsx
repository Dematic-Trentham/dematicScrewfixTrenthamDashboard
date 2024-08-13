import React from "react";
import { Button } from "@nextui-org/button";

import PanelMiddle from "../panels/panelMiddle";

type YesNoBoxProps = {
	question: string;
	onYes: () => void;
	onNo: () => void;
};

const YesNoBox: React.FC<YesNoBoxProps> = ({ question, onYes, onNo }) => {
	return (
		<PanelMiddle
			className="absolute left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 transform"
			title={question}
		>
			<div className="flex justify-evenly">
				<Button color="danger" onClick={onYes}>
					Yes
				</Button>
				<Button color="primary" onClick={onNo}>
					No
				</Button>
			</div>
		</PanelMiddle>
	);
};

export default YesNoBox;
