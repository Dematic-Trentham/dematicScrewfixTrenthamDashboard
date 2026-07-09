enum TeamColours {
	GREEN = "green",
	BLUE = "blue",
	RED = "red",
	YELLOW = "yellow",
	BROWN = "brown",
	PURPLE = "purple",
}

//20-04-2026 between 07:00 and 19:00 is green team
//20-04-2026 between 19:00 and 07:00 ( next day) is blue team
//24-04-2026 between 07:00 and 19:00 is red team
//24-04-2026 between 19:00 and 07:00 ( next day) is yellow team
//this repeats every 4 days, so the next blue will be 28-04-2026 between 07:00 and 19:00 and green team will be on 28-04-2026 between 19:00 and 07:00

//get the team colour from the date given
export const getTeamColourFromDateToTW = (date: Date): string => {
	// Start date: 20-04-2026 07:00 (green team starts)
	const startDate = new Date(2026, 3, 20, 7, 0, 0); // April 20, 2026 07:00

	// Day cycle pattern (16 days repeating):
	// 20-04 to 23-04: 07:00-19:00 GREEN, 19:00-07:00 BLUE
	// 24-04 to 27-04: 07:00-19:00 RED, 19:00-07:00 YELLOW
	// 28-04 to 31-04: 07:00-19:00 GREEN, 19:00-07:00 BLUE
	// 01-05 to 04-05: 07:00-19:00 YELLOW, 19:00-07:00 RED
	// Then repeats...

	// Calculate days since start date
	const timeDiff = date.getTime() - startDate.getTime();
	const daysSinceStart = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
	const hourOfDay = date.getHours();

	// Determine position in 16-day cycle
	const cyclePosition = daysSinceStart % 16;

	let team: string;

	if (cyclePosition < 4) {
		// 20-04 to 23-04
		team =
			hourOfDay >= 7 && hourOfDay < 19 ? TeamColours.GREEN : TeamColours.BLUE;
	} else if (cyclePosition < 8) {
		// 24-04 to 27-04
		team =
			hourOfDay >= 7 && hourOfDay < 19 ? TeamColours.RED : TeamColours.YELLOW;
	} else if (cyclePosition < 12) {
		// 28-04 to 01-05
		team =
			hourOfDay >= 7 && hourOfDay < 19 ? TeamColours.GREEN : TeamColours.BLUE;
	} else {
		// 02-05 to 05-05
		team =
			hourOfDay >= 7 && hourOfDay < 19 ? TeamColours.YELLOW : TeamColours.RED;
	}

	//console.log(`Date: ${date.toLocaleString()}, Team: ${team}`); // Debug log

	//make the team colour a tailwind colour
	switch (team) {
		case TeamColours.GREEN:
			return "bg-green-500";
		case TeamColours.BLUE:
			return "bg-blue-500";
		case TeamColours.RED:
			return "bg-red-500";
		case TeamColours.YELLOW:
			return "bg-yellow-500";
		case TeamColours.BROWN:
			return "bg-brown-500";
		case TeamColours.PURPLE:
			return "bg-purple-500";
		default:
			return "bg-white"; // Default to white if no match
	}
};
