<script>
	import { onMount } from 'svelte';
	const { initialDarkMode } = $props();

	let darkMode = $state(initialDarkMode);
	let newTheme = $state('light');

	let isDebouncing = false;

	const clickHandler = async () => {
		if (isDebouncing) return;
		isDebouncing = true;

		darkMode = !darkMode;
		newTheme = darkMode ? 'dark' : 'light';
		localStorage.setItem('theme', newTheme);

		if (darkMode) {
			document.body.classList.add('dark');
			document.body.classList.remove('light');
		} else {
			document.body.classList.remove('dark');
			document.body.classList.add('light');
		}
		await new Promise((resolve) => setTimeout(resolve, 300));
		isDebouncing = false;
	};
</script>

<button class={darkMode ? 'dark' : 'light'} onclick={clickHandler} aria-label="Toggle theme"
></button>

<style lang="postcss">
	button {
		--width: 40px;
		--height: calc(var(--width) / 2);
		--radius: calc(var(--height) / 2);
		grid-area: right;
		display: flex;
		position: relative;
		width: var(--width);
		height: var(--height);
		border-radius: var(--radius);
		border: 1px inset #999;
		background-color: #fff;
		transition: background-color 0.3s ease-in-out;
		margin-left: 20px;
		cursor: pointer;
		&:after {
			content: '';
			position: absolute;
			top: -3px;
			left: -3px;
			width: calc(var(--height) + 4px);
			height: calc(var(--height) + 4px);
			border-radius: 50%;
			background-color: #333;
			box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5);
			transition: all 0.3s ease-in-out;
		}
		&.dark::after {
			transform: translate3d(80%, 0, 0);
			background-color: #cbcbcb;
		}
	}
</style>
