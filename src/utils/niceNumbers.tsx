export const niceFormatPercentage = (
	total: number,
	part: number,
	decimalPlaces: number = 2
) => {
	if (total === 0) return "0%";

	const percentage = (part / total) * 100;

	return `${percentage.toFixed(decimalPlaces)}%`;
};

export const niceRound = (value: number, decimalPlaces: number = 2) => {
	return parseFloat(value.toFixed(decimalPlaces));
};
