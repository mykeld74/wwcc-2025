<script>
	import { Image } from '$components';
	import '$css/styles.css';
	import '$css/reset.css';
	import { getTheme, setTheme } from '$lib/theme.svelte.js';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		// Ensure body theme class is applied for CSS variables
		setTheme(getTheme());
	});
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap"
		rel="stylesheet"
	/>
	<link rel="preconnect" href="https://challenges.cloudflare.com" />
	<script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" async defer></script>
	<script src="https://js.churchcenter.com/modal/v1"></script>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="qrShell">
	<header class="qrHeader">
		<a href="/" class="logoLink" aria-label="Westwoods Community Church home">
			<Image source="wwLogo" altTag="Westwoods Community Church Logo" width="280" />
		</a>
	</header>
	{@render children?.()}
</div>

<style>
	.qrShell {
		min-height: 100dvh;
		display: grid;
		grid-template-rows: auto 1fr;
		width: min(100%, 28rem);
		margin: 0 auto;
		padding: 1.5rem 1.25rem 2.5rem;
		box-sizing: border-box;
	}

	.qrHeader {
		display: grid;
		place-items: center;
		padding: 0.5rem 0 1.5rem;
	}

	.logoLink {
		display: block;
		width: min(70vw, 12rem);
		transition: transform var(--animHoverTime) var(--animHoverEase);
	}

	.logoLink:hover {
		transform: scale(1.03);
	}

	:global(.qrShell .wwLogo) {
		display: block;
		width: 100%;
		height: auto;
	}
</style>
