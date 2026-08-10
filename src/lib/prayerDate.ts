export function getPreviousSunday(referenceDate = new Date()): Date {
	const date = new Date(
		referenceDate.getFullYear(),
		referenceDate.getMonth(),
		referenceDate.getDate(),
		12,
		0,
		0,
		0
	);
	const day = date.getDay();
	date.setDate(date.getDate() - day);
	return date;
}

export function toDateInputValue(date: Date): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

export function getPreviousSundayDateInput(referenceDate = new Date()): string {
	return toDateInputValue(getPreviousSunday(referenceDate));
}
