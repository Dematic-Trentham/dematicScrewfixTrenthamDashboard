"use client";
export const changeDateToReadable = (date: Date) => {
	const newDate = new Date(date);

	//HH:MM DD/MM/YYYY
	const hours = newDate.getHours();
	const minutes = newDate.getMinutes();
	const day = newDate.getDate();
	const month = newDate.getMonth() + 1;
	const year = newDate.getFullYear();

	const formattedHours = hours.toString().padStart(2, '0');
	const formattedMinutes = minutes.toString().padStart(2, '0');
	return `${day}/${month}/${year} - ${formattedHours}:${formattedMinutes}`;
};
