<script>
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { ThemeToggle, Nav } from '$components';
	let { data, children } = $props();
	let theme = $state('light');
	let isReady = $state(false);
	let initialDarkMode = $state(false);
	import '../css/styles.css';
	import '../css/reset.css';

	onMount(() => {
		if (localStorage.getItem('theme') === 'dark') {
			document.body.classList.add('dark');
			document.body.classList.remove('light');
			theme = 'dark';
			initialDarkMode = true;
			isReady = true;
			return;
		} else if (
			window.matchMedia('(prefers-color-scheme: dark)').matches &&
			localStorage.getItem('theme') !== 'light'
		) {
			document.body.classList.add('dark');
			document.body.classList.remove('light');
			theme = 'dark';
			initialDarkMode = true;
			isReady = true;
			return;
		} else {
			document.body.classList.remove('dark');
			document.body.classList.add('light');
			theme = 'light';
			initialDarkMode = false;
			isReady = true;
			return;
		}
	});
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<link
		href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
		rel="stylesheet"
	/>
	<title>Westwoods Community Church</title>
</svelte:head>

{#if isReady}
	<header>
		<Nav />
		<ThemeToggle {initialDarkMode} />
	</header>

	{#key data.pathname}
		<div
			in:fade={{ duration: 150, delay: 155 }}
			out:fade={{ duration: 150 }}
			class="contentWrapper"
		>
			{@render children?.()}
		</div>
	{/key}
{/if}

<style>
	.contentWrapper {
		display: grid;
		grid-template-columns:
			[full-start left-start] auto [left-end wide-start] auto [content-start]
			clamp(0px, 100%, 1200px) [content-end] auto [wide-end right-start] auto [right-end full-end];
	}
</style>
