<script>
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { ThemeToggle, Nav, Image, ServiceTimes } from '$components';
	let { data, children } = $props();
	let theme = $state('light');
	let isReady = $state(false);
	let initialDarkMode = $state(false);
	let currentPageTitle = $state('Westwoods Community Church');
	import '../css/styles.css';
	import '../css/reset.css';

	let title = $derived(data.pathname.split('/').pop());

	// regex to split the title on the - and capitalize the first letter of each word
	let formattedTitle = $derived(
		title.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) || 'Home'
	);

	// update the title when the page changes
	$effect(() => {
		currentPageTitle = `${formattedTitle} | Westwoods Community Church`;
	});

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
		href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Sedgwick+Ave&display=swap"
		rel="stylesheet"
	/>
	<script src="https://js.churchcenter.com/modal/v1"></script>
	<title>{currentPageTitle}</title>
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
			class={`contentWrapper ${title}`}
		>
			{@render children?.()}
		</div>
	{/key}

	<footer>
		<div class="mainFooter">
			<div class="footerLogo">
				<Image source="wwLogo" altTag="Westwoods Community Church Logo" />
			</div>
			<div class="socialContainer">
				<a
					href="https://www.facebook.com/westwoodscommunitychurch"
					target="_blank"
					aria-label="Visit our Facebook page"
				>
					<svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 24 24"
						><path
							class="icon"
							d="M20.9,2H3.1A1.1,1.1,0,0,0,2,3.1V20.9A1.1,1.1,0,0,0,3.1,22h9.58V14.25h-2.6v-3h2.6V9a3.64,3.64,0,0,1,3.88-4,20.26,20.26,0,0,1,2.33.12v2.7H17.3c-1.26,0-1.5.6-1.5,1.47v1.93h3l-.39,3H15.8V22h5.1A1.1,1.1,0,0,0,22,20.9V3.1A1.1,1.1,0,0,0,20.9,2Z"
						/></svg
					>
				</a>
				<a
					href="https://www.instagram.com/westwoodschurch/"
					target="_blank"
					aria-label="Visit our Instagram page"
				>
					<svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 24 24"
						><path
							class="icon"
							d="M17.34,5.46h0a1.2,1.2,0,1,0,1.2,1.2A1.2,1.2,0,0,0,17.34,5.46Zm4.6,2.42a7.59,7.59,0,0,0-.46-2.43,4.94,4.94,0,0,0-1.16-1.77,4.7,4.7,0,0,0-1.77-1.15,7.3,7.3,0,0,0-2.43-.47C15.06,2,14.72,2,12,2s-3.06,0-4.12.06a7.3,7.3,0,0,0-2.43.47A4.78,4.78,0,0,0,3.68,3.68,4.7,4.7,0,0,0,2.53,5.45a7.3,7.3,0,0,0-.47,2.43C2,8.94,2,9.28,2,12s0,3.06.06,4.12a7.3,7.3,0,0,0,.47,2.43,4.7,4.7,0,0,0,1.15,1.77,4.78,4.78,0,0,0,1.77,1.15,7.3,7.3,0,0,0,2.43.47C8.94,22,9.28,22,12,22s3.06,0,4.12-.06a7.3,7.3,0,0,0,2.43-.47,4.7,4.7,0,0,0,1.77-1.15,4.85,4.85,0,0,0,1.16-1.77,7.59,7.59,0,0,0,.46-2.43c0-1.06.06-1.4.06-4.12S22,8.94,21.94,7.88ZM20.14,16a5.61,5.61,0,0,1-.34,1.86,3.06,3.06,0,0,1-.75,1.15,3.19,3.19,0,0,1-1.15.75,5.61,5.61,0,0,1-1.86.34c-1,.05-1.37.06-4,.06s-3,0-4-.06A5.73,5.73,0,0,1,6.1,19.8,3.27,3.27,0,0,1,5,19.05a3,3,0,0,1-.74-1.15A5.54,5.54,0,0,1,3.86,16c0-1-.06-1.37-.06-4s0-3,.06-4A5.54,5.54,0,0,1,4.21,6.1,3,3,0,0,1,5,5,3.14,3.14,0,0,1,6.1,4.2,5.73,5.73,0,0,1,8,3.86c1,0,1.37-.06,4-.06s3,0,4,.06a5.61,5.61,0,0,1,1.86.34A3.06,3.06,0,0,1,19.05,5,3.06,3.06,0,0,1,19.8,6.1,5.61,5.61,0,0,1,20.14,8c.05,1,.06,1.37.06,4S20.19,15,20.14,16ZM12,6.87A5.13,5.13,0,1,0,17.14,12,5.12,5.12,0,0,0,12,6.87Zm0,8.46A3.33,3.33,0,1,1,15.33,12,3.33,3.33,0,0,1,12,15.33Z"
						/></svg
					>
				</a>
				<a
					href="https://www.youtube.com/@westwoodscommunitychurch5466"
					target="_blank"
					aria-label="Visit our YouTube channel"
				>
					<svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 24 24"
						><path
							class="icon"
							d="M23,9.71a8.5,8.5,0,0,0-.91-4.13,2.92,2.92,0,0,0-1.72-1A78.36,78.36,0,0,0,12,4.27a78.45,78.45,0,0,0-8.34.3,2.87,2.87,0,0,0-1.46.74c-.9.83-1,2.25-1.1,3.45a48.29,48.29,0,0,0,0,6.48,9.55,9.55,0,0,0,.3,2,3.14,3.14,0,0,0,.71,1.36,2.86,2.86,0,0,0,1.49.78,45.18,45.18,0,0,0,6.5.33c3.5.05,6.57,0,10.2-.28a2.88,2.88,0,0,0,1.53-.78,2.49,2.49,0,0,0,.61-1,10.58,10.58,0,0,0,.52-3.4C23,13.69,23,10.31,23,9.71ZM9.74,14.85V8.66l5.92,3.11C14,12.69,11.81,13.73,9.74,14.85Z"
						/></svg
					>
				</a>
			</div>
			<div class="footerText">
				<p>&copy;{new Date().getFullYear()} Westwoods Community Church</p>
				<button class="serviceTimesButton" popovertarget="serviceTimesModal">
					Directions and Service Times
				</button>
				<p>7700 W. Woodard Drive | Lakewood | CO | 80227 | 303.279.1616</p>
			</div>
		</div>
	</footer>
	<dialog id="serviceTimesModal" class="serviceTimesModal" popover>
		<ServiceTimes />
	</dialog>
{/if}

<style>
	header {
		display: grid;
		grid-template-columns: 60px 1fr 60px;
		grid-template-areas: 'left nav right';
		padding: 0 10px;
		align-items: center;
		position: sticky;
		top: 0;
		background-color: var(--backgroundColor);
		z-index: 100;
		@media (max-width: 1110px) {
			grid-template-columns: 1fr;
			grid-template-areas: 'right';
			height: 60px;
		}
	}
	.contentWrapper {
		width: 100%;
		/* overflow-x: hidden; */
		display: grid;
		grid-template-columns:
			[full-start left-start] auto [left-end wide-start] auto [content-start]
			1fr
			[content-end] auto [wide-end right-start] auto [right-end full-end];
		grid-template-rows: [header-start] auto [header-end hero-start] auto [hero-end cards-start] auto [cards-end content-start] auto [content-end];
		margin-block-end: 100px;
		&.missional-communities {
			margin-block-end: 0;
		}
	}
	footer {
		background: var(--footerBg);
		border-top: 1px solid var(--footerBorder);
	}
	.mainFooter {
		padding: 10px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		p {
			margin: 0;
			font-size: 18px;
			line-height: 2;
		}
		@media (max-width: 468px) {
			flex-wrap: wrap;
		}
	}
	.footerLogo {
		width: 100px;
	}

	.socialContainer {
		display: flex;
		align-items: center;
		justify-content: space-around;
		gap: clamp(20px, 4vw, 40px);

		svg {
			width: clamp(30px, 5vw, 50px);
			height: 50px;
			margin: 0 5px;
			cursor: pointer;

			--iconColor: var(--textColor);
			&:hover {
				--iconColor: var(--accentColor);
			}
		}
	}
	.icon {
		fill: var(--iconColor);
		transition: fill 250ms ease-in-out;
	}

	.serviceTimesButton {
		background: none;
		border: none;
		cursor: pointer;
		color: var(--textColor);
		padding: 0;
		transition: color 250ms ease-in-out;
		&:hover {
			color: var(--accentColor);
		}
	}
</style>
