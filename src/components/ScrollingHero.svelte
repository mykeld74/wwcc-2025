<script>
	let { currentPage = 'kids', children } = $props();
	import { onMount } from 'svelte';
	import {
		Banner1,
		Banner2,
		Banner3,
		Banner4,
		Banner5,
		Students1,
		Students2,
		Students3,
		Students4,
		Students5,
		WoW1,
		WoW2,
		WoW3,
		WoW4,
		WoW5
	} from '$img';
	import { Image } from '$components';

	let pages = $state([]);
	let logo = $state('');
	if (currentPage === 'kids') {
		pages = [Banner1, Banner2, Banner3, Banner4, Banner5];
		logo = 'wwKidsBanner_ds';
	} else if (currentPage === 'students') {
		pages = [Students1, Students2, Students3, Students4, Students5];
		logo = 'studentsLogo';
	} else if (currentPage === 'wow') {
		pages = [WoW1, WoW2, WoW3, WoW4, WoW5];
		logo = 'WoW_Logo2025';
	}

	let scrollers = [];

	function addAnimation() {
		scrollers.forEach((scroller) => {
			scroller.setAttribute('data-animated', 'true');
			const scrollerInner = document.querySelector('.innerScroller');
			const scrollerInnerContent = Array.from(scrollerInner?.children || []);

			scrollerInnerContent.forEach((item) => {
				const duplicatedItem = item.cloneNode(true);
				duplicatedItem.setAttribute('aria-hidden', 'true');
				scrollerInner?.appendChild(duplicatedItem);
			});
		});
	}

	onMount(() => {
		scrollers = Array.from(document.querySelectorAll('.scrollerContainer'));
		if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			addAnimation();
		}
	});
</script>

<div class="scrollerHero">
	<div class={`scrollerLogoContainer ${currentPage}`}>
		<Image source={logo} alt="Westwoods Kids Banner 1" />
	</div>
	<div class="scrollerContainer" data-animationSpeed="slow">
		<ul class="pages innerScroller">
			{#each pages as page}
				<li class="imgContainer">
					<img src={page} alt="Page {page}" />
				</li>
			{/each}
		</ul>
	</div>
</div>

<style>
	.scrollerHero {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr;
		grid-template-areas: 'hero';
		place-items: center;
	}
	.scrollerContainer {
		width: 100%;
		overflow: hidden;
		padding-bottom: 1rem;
		grid-area: hero;
		height: 33vh;
	}
	.scrollerLogoContainer {
		grid-area: hero;
		width: 90%;
		max-width: 1200px;
		z-index: 1;
		&.students {
			width: 25vh;
			background: rgba(255, 255, 255, 0.75);
			padding: 0.45rem 0.25rem 0.25rem;
			border-radius: 300vw;
		}
		&.wow {
			width: clamp(250px, 40vh, 650px);
			max-width: 650px;
			background: rgba(255, 255, 255, 0.75);
			padding: 0.45rem 0.25rem 0.25rem;
			border-radius: 300vw;
		}
	}

	.innerScroller {
		width: fit-content;
		display: flex;
		flex-wrap: wrap;
		list-style: none;
		padding: 0;
		margin: 0;
		gap: var(--innerScrollGap);
		height: 100%;
	}
	:global(.scrollerContainer[data-animated]) {
		width: 100%;
		overflow: hidden;
		mask: linear-gradient(90deg, transparent, #fff 15%, #fff 85%, transparent);
		.innerScroller {
			flex-wrap: nowrap;
			animation: scroll var(--animationDuration, 10s) linear infinite;
		}
	}

	:global([data-animationSpeed='fast']) {
		--animationDuration: 20s;
	}
	:global([data-animationSpeed='slow']) {
		--animationDuration: 90s;
	}
	.imgContainer {
		width: max-content;
		flex-shrink: 0;
		img {
			box-shadow: 3px 3px 12px oklch(20% 0 0);
			height: 100%;
			width: auto;
		}
	}

	@keyframes scroll {
		to {
			transform: translateX(-50%);
		}
	}
</style>
