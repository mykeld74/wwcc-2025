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

	onMount(() => {
		const serviceTimesModal = document.getElementById('serviceTimesModal');
	});
</script>

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
</section>

<section id="weAreContainer" class="wwIsContainer">
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

<dialog id="serviceTimesModal" class="serviceTimesModal" popover>
	<h2>Service Times</h2>
	<p class="xtraLrg">9:30am</p>
	<p>7700 Woodard Dr.</p>
	<p>Lakewood, CO 80227</p>
	<iframe
		src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3070.8329214253686!2d-105.08480848435234!3d39.675972808278864!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x876b81ad73d8223d%3A0xef2d6fab8083844!2sWestwoods%20Community%20Church!5e0!3m2!1sen!2sus!4v1569100714699!5m2!1sen!2sus"
		frameBorder="0"
		allowFullScreen
		title="Westwoods Map"
		id="wwMap"
	></iframe>
</dialog>

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
	/* .contentWrapper {
		display: grid;
		grid-template-columns:
			[full-start left-start] auto [left-end wide-start] auto [content-start]
			clamp(300px, 100%, 1240px)
			[content-end] auto [wide-end right-start] auto [right-end full-end];
		grid-template-rows: [header-start] auto [header-end hero-start] auto [hero-end card-start] auto [card-end content-start] auto [content-end];
	} */
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
	.serviceTimesModal {
		opacity: 0;
		scale: 0.5;
		transition: all 0.5s ease-in-out;
		transition-behavior: allow-discrete;
		&::backdrop {
			opacity: 0;
			transition: opacity 0.25s ease-in-out;
			transition-behavior: allow-discrete;
		}
		&:popover-open {
			opacity: 1;
			scale: 1;
			transition: all 0.5s ease-in-out;
			width: calc(100vw - 2rem);
			height: fit-content;
			max-width: 800px;
			border-radius: 1rem;
			background: var(--backgroundColor);
			color: var(--textColor);
			padding: 2rem;
			@starting-style {
				opacity: 0;
				scale: 0.5;
			}
			&::backdrop {
				opacity: 1;
				background: oklch(0 0 0 / 0.5);
				transition: opacity 0.25s ease-in-out;
				transition-behavior: allow-discrete;
				@starting-style {
					opacity: 0;
				}
			}
		}
	}
	.wwIsContainer {
		display: grid;
		grid-area: content;
		grid-template-columns: repeat(3, 1fr);
		gap: 2rem;
	}
</style>
