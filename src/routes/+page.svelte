<script>
	import { onMount } from 'svelte';
	import { blur } from 'svelte/transition';
	let { data } = $props();

	import { Image, HomePageCard, Logo } from '$components';

	const currentSeriesImg = data.currentSeriesImg[0].seriesImage;

	const MAS = {
		title: 'Miss a Sunday?',
		body: 'Watch it here.',
		image: 'currentSeries2',
		link: 'https://www.youtube.com/channel/UCJkTcdfWk2DWGDuqJUOsrxA/playlists',
		newWindow: true
	};
	const currentSeries = {
		title: 'Current Series',
		body: '',
		image: currentSeriesImg,
		link: '/current-series',
		newWindow: false
	};
	const times = {
		title: 'Service Times',
		body: '',
		image: 'building',
		newWindow: false
	};
	const event = {
		title: 'Upcoming Event',
		body: 'Learn more...',
		image: 'marriage',
		link: '/events/better-on-purpose',
		newWindow: false
	};

	let isReady = $state(false);
	let showAnnouncement = $state(true);

	onMount(() => {
		isReady = true;
	});
</script>

<svelte:head>
	<meta
		name="description"
		content="Westwoods Community Church is a non-denominational, intergenerational community church in Lakewood, CO. Join us for authentic relationships, relevant teaching, and a place to belong before you believe."
	/>
</svelte:head>

<div class="bgImageContainer">
	<div class="backgroundImageOuterWrapper">
		<div class="backgroundImage"></div>
	</div>
</div>
<section class="hero" id="hero">
	<div class="logoWrapper">
		<Logo />
	</div>
	<div class="title" id="title">Westwoods Community Church</div>
	<h2 class="belong">Belong before you believe!</h2>
</section>
<section class="homePageCards">
	<HomePageCard cardContent={MAS} />
	<HomePageCard cardContent={currentSeries} />
	<button class="serviceTimesButton" popovertarget="serviceTimesModal">
		<HomePageCard cardContent={times} />
	</button>
	<HomePageCard cardContent={event} />
</section>

<section id="weAreContainer" class="wwIsWrapper">
	<h2 class="wwIs center">Westwoods Is:</h2>
	<div class="wwIsContainer">
		<div class="wwIsBlock b1">
			<p>
				A non-denominational, intergenerational community of imperfect people seeking to be changed
				by the person of Jesus Christ.
			</p>
		</div>
		<div class="wwIsBlock b2">
			<p>
				A church being built on the foundation of authentic relationships and the relevant
				application of God’s Word. Our hope is to be a challenging community for believers, a safe
				community for spiritual seekers and a powerful picture of grace and love to our community.
			</p>
		</div>
		<div class="wwIsBlock b3">
			<p>Maybe you’ve said no to church, but what if church could be different?</p>
			<ul>
				<li>Shouldn’t church be a place of life, connection, excitement and enthusiasm?</li>
				<li>
					Shouldn’t church be a place where people can feel and experience a real connection with
					God?
				</li>
				<li>Shouldn’t church be a place that positively shapes our communities?</li>
			</ul>
			<p class="center bold">WE THINK SO!</p>
		</div>
	</div>
</section>
<div class="planAVisitWrapper">
	<a href="/about-us/plan-a-visit">
		<p class="planAVisitTitle">Plan a Visit</p>
		<div class="planAVisitArrow">
			<svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M399.521 250.13C400.172 257.729 397.589 265.554 391.774 271.37L316.012 347.131C305.552 357.591 288.592 357.591 278.131 347.131C267.671 336.67 267.671 319.711 278.131 309.25L310.596 276.786L116.071 276.786C101.278 276.786 89.2853 264.793 89.2853 250C89.2853 235.207 101.278 223.214 116.071 223.214L310.333 223.214L278.131 191.013C267.671 180.552 267.671 163.592 278.131 153.132C288.592 142.671 305.551 142.671 316.012 153.132L391.773 228.893C397.588 234.708 400.17 242.531 399.521 250.13Z"
					class="planAVisitArrowPath"
				/>
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M0 250C0 111.929 111.929 0 250 0C388.071 0 500 111.929 500 250C500 388.071 388.071 500 250 500C111.929 500 0 388.071 0 250ZM12 250C12 118.556 118.556 12 250 12C381.444 12 488 118.556 488 250C488 381.444 381.444 488 250 488C118.556 488 12 381.444 12 250Z"
					class="planAVisitArrowPath"
				/>
			</svg>
		</div>
	</a>
</div>

<!-- <dialog id="announcementModal" class="announcementModal" popover>
	<div class="modalContent">
		<h2>
			Beginning this Sunday, September 28th, we will be going to 2 services at 9:00 and 10:30am. We
			will also be celebrating our 25th Anniversary! Can't wait to see you there!
		</h2>

		<div class="modalActions">
			<button
				class="closeButton"
				onclick={() => {
					const dialog = document.getElementById('announcementModal');
					if (!dialog) return;
					if (dialog.matches(':popover-open')) dialog.hidePopover?.();
					else dialog.close?.();
					showAnnouncement = false;
				}}>Close</button
			>
		</div>
	</div>
</dialog> -->

<style>
	@property --backgroundSize {
		syntax: '<number>';
		initial-value: 1.75;
		inherits: false;
	}

	@keyframes background-size {
		from {
			--backgroundSize: 1.75;
		}
		to {
			--backgroundSize: 1;
		}
	}

	.hero {
		grid-area: hero / full;
		text-align: center;
		clip-path: var(--clipPath);
		place-content: center;
		padding: clamp(4rem, 10vw, 8rem) 1rem;
	}
	.logoWrapper {
		width: 35%;
		max-width: 300px;
		margin: 0 auto;
	}
	.title {
		display: flex;
		gap: 0.8rem;
		justify-content: center;
		font-size: clamp(2.25rem, 6vw, 4rem);
		font-weight: 800;
		margin: 3rem 0 0;
		text-shadow: var(--textShadow);
	}
	.belong {
		font-family: 'Sedgwick Ave', cursive;
		line-height: 1.4;
		font-size: clamp(2.25rem, 6vw, 4.5rem);
		text-shadow: var(--textShadow);
	}
	.bgImageContainer {
		position: relative;
		z-index: -1;
		display: grid;
		grid-template-columns: [full-start] 1fr [full-end];
		grid-template-rows: [full-start] 1fr [full-end];
		grid-area: hero / full;

		filter: drop-shadow(-1px 6px 3px oklch(0 0 0 / 0.5));
		overflow: clip;
	}
	.backgroundImageOuterWrapper {
		grid-area: full;
		place-items: center;
		clip-path: var(--clipPath);
	}
	.backgroundImage {
		width: 100%;
		height: 100%;
		background: url('https://res.cloudinary.com/mykeld74/image/upload/f_auto,q_auto,w_auto/WestwoodsCC/denverSkyline')
			no-repeat center 100%;
		background-size: cover;
		clip-path: var(--clipPath);
		scale: var(--backgroundSize);
		animation: background-size 3s ease-in-out forwards;
		&::after {
			content: '';
			position: absolute;
			background: var(--overlayColor);
			inset: 0;
			z-index: 1;
			transition: background 0.5s ease-in-out;
		}
	}
	.homePageCards {
		grid-area: cards / full;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
		gap: 3rem;
		padding-inline: 3rem;
		@media (max-width: 768px) {
			grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
			padding-inline: 1rem;
		}
	}
	.serviceTimesButton {
		background: none;
		border: none;
		cursor: pointer;
	}

	@keyframes flyIn {
		from {
			opacity: 0;
			scale: 3.5;
		}
		to {
			opacity: 1;
			scale: 1;
		}
	}
	.planAVisitWrapper {
		background: var(--accentColor);
		color: var(--bgColor);
		padding: 0.5rem 1rem;
		text-align: center;
		position: fixed;
		top: 40vh;
		right: 0;
		rotate: -90deg;
		transform-origin: right center;
		transform: translateY(calc(-50% + 110px));
		transition: all 0.5s ease-in-out;
		border-radius: 10px 10px 0 0;
		box-shadow: -4px -3px 6px 2px rgba(0, 0, 0, 0.25);
		&:hover {
			transform: translateY(-50%);
		}
	}
	.planAVisitTitle {
		font-size: 1.5rem;
		font-weight: 700;
		margin: 0;
		color: var(--textColor);
	}
	.planAVisitArrow {
		width: 100%;
		height: 100%;
		rotate: 90deg;
		width: 80px;
		margin: 0.5rem auto;
	}
	.planAVisitArrowPath {
		fill: var(--textColor);
	}

	/* Announcement modal local tweaks reuse global modal styles */
	.announcementModal {
		h2 {
			line-height: 1.75;
		}
		.currentEvents {
			display: grid;
			grid-template-columns: 1fr;
			gap: 1rem;
		}
		.eventItem {
			display: flex;
			flex-direction: column;
			border: 1px solid var(--contrastColor);
			padding: 1rem;
			border-radius: 0.5rem;
			gap: 0.5rem;
			h3 {
				color: var(--accentColor);
				margin: 0;
			}
			p {
				margin: 0;
			}
			hr {
				width: 100%;
			}
		}
		.modalActions {
			margin-top: 1rem;
			text-align: right;
		}
		.closeButton {
			background: var(--accentColor);
			color: #fff;
			border: none;
			border-radius: 0.5rem;
			padding: 0.5rem 1rem;
			cursor: pointer;
		}
	}

	.wwIsContainer {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		width: calc(100% - 2rem);
		max-width: 1200px;
		margin: 0 auto;
		@container (width < 1000px) {
			grid-template-columns: 1fr;
		}
	}
	.wwIsWrapper {
		background: url('https://res.cloudinary.com/mykeld74/image/upload/f_auto,q_auto,w_auto/WestwoodsCC/wwWorship25.jpg')
			no-repeat center 100px fixed;
		background-size: cover;
		border-radius: 10px;
		box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
		grid-area: full;
		margin-block-start: 5rem;
		container-type: inline-size;
		container-name: wwIsWrapper;
	}
	.wwIs {
		font-size: clamp(2rem, 5vw, 4rem);
		font-weight: 700;
		margin: 0 0 2rem;
		color: #fff;
	}
	.wwIsBlock {
		background: var(--wwIsBackground);
		padding: 2rem;
		border-radius: 10px;
		box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
		p,
		li {
			font-size: clamp(1.25rem, 2vw, 1.75rem);
		}
		&.b3 {
			grid-column: span 2;
			@container (width < 1000px) {
				grid-column: span 1;
			}
		}
	}
</style>
