export const LineTypeStrokeDashed = {
	dotted: "1,1",
	dashed: "10,10",
	solid: "0",
} as const;

export type LineTypeStrokeDashed =
	(typeof LineTypeStrokeDashed)[keyof typeof LineTypeStrokeDashed];

export type LineType = {
	Colour: string;
	type: LineTypeStrokeDashed;
	Width: number;
};
