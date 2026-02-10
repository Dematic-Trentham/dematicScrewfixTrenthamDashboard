// Format seconds into a human friendly string, e.g.
// 60 -> "1 minute", 120 -> "2 minutes", 3600 -> "1 hour", etc.
export const formatDuration = (seconds: number) => {
	if (seconds <= 0) return "0 seconds";
	const parts: string[] = [];

	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const secs = seconds % 60;

	if (hours) parts.push(`${hours} hour${hours === 1 ? "" : "s"}`);
	if (minutes) parts.push(`${minutes} minute${minutes === 1 ? "" : "s"}`);
	if (secs && !hours) {
		// only show seconds when less than an hour (avoid "1 hour 0 minutes 10 seconds")
		parts.push(`${secs} second${secs === 1 ? "" : "s"}`);
	}

	return parts.join(" ");
};
