export function getNextFinishDay(): { date: Date; time: string } {
	const lastDayShift = new Date(2025, 3, 4); // 04/04/2025 (Month is 0-indexed)
	const shiftPattern = 16; // 4 days + 4 off + 4 nights + 4 off = 16 days
	const shiftHours = { day: "19:00", night: "07:00" };

	const now = new Date();
	const daysSinceLastShift = Math.floor(
		(now.getTime() - lastDayShift.getTime()) / (1000 * 60 * 60 * 24)
	);
	const daysToNextShift =
		(shiftPattern - (daysSinceLastShift % shiftPattern)) % shiftPattern;

	const nextFinishDate = new Date(now);

	nextFinishDate.setDate(now.getDate() + daysToNextShift);

	const isDayShift = (daysSinceLastShift + daysToNextShift) % shiftPattern < 4;
	const finishTime = isDayShift ? shiftHours.day : shiftHours.night;

	return { date: nextFinishDate, time: finishTime };
}

// Example usage
const nextFinish = getNextFinishDay();

console.log(
	`Next finish day: ${nextFinish.date.toDateString()} at ${nextFinish.time}`
);
