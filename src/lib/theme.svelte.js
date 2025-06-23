// Theme state using Svelte 5 runes
let theme = $state('light');

// Initialize theme on module load
if (typeof window !== 'undefined') {
	// Check localStorage first
	if (localStorage.getItem('theme') === 'dark') {
		theme = 'dark';
		document.body.classList.add('dark');
		document.body.classList.remove('light');
	} else if (
		// Check system preference if no localStorage setting
		window.matchMedia('(prefers-color-scheme: dark)').matches &&
		localStorage.getItem('theme') !== 'light'
	) {
		theme = 'dark';
		document.body.classList.add('dark');
		document.body.classList.remove('light');
	} else {
		// Default to light
		theme = 'light';
		document.body.classList.remove('dark');
		document.body.classList.add('light');
	}
}

// Getter function to access the current theme
export function getTheme() {
	return theme;
}

// Toggle theme function
export function toggleTheme() {
	const newTheme = theme === 'light' ? 'dark' : 'light';
	theme = newTheme;
	localStorage.setItem('theme', newTheme);

	if (newTheme === 'dark') {
		document.body.classList.add('dark');
		document.body.classList.remove('light');
	} else {
		document.body.classList.remove('dark');
		document.body.classList.add('light');
	}
}

// Set specific theme function
export function setTheme(newTheme) {
	if (newTheme !== 'light' && newTheme !== 'dark') return;

	theme = newTheme;
	localStorage.setItem('theme', newTheme);

	if (newTheme === 'dark') {
		document.body.classList.add('dark');
		document.body.classList.remove('light');
	} else {
		document.body.classList.remove('dark');
		document.body.classList.add('light');
	}
}
