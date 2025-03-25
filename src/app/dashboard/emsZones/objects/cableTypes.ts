import { LineType, LineTypeStrokeDashed } from "./lineTypes";

const ProfiBusType: LineType = {
	Colour: "purple",
	Width: 5,
	type: LineTypeStrokeDashed.dotted,
};
const ProfiNetType: LineType = {
	Colour: "green",

	Width: 5,
	type: LineTypeStrokeDashed.dotted,
};
const ASIType: LineType = {
	Colour: "yellow",
	Width: 5,
	type: LineTypeStrokeDashed.dotted,
};
const cableType: LineType = {
	Colour: "black",
	Width: 5,
	type: LineTypeStrokeDashed.dotted,
};

export const cableTypes = {
	ProfiBusType,
	ProfiNetType,
	ASIType,
	cableType,
};
