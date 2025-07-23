<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	let { data } = $props();
	import { Image } from '$components';

	const currentSeriesID = data.currentSeriesID;

	let description = $state([]);
	let previousSeries = $state([]);
	let showImage = $state(true);
	let previousShowImage = $state(Array(currentSeriesID.length - 1).fill(true));

	let videoUrl = $derived(
		`https://www.youtube.com/embed/videoseries?list=${currentSeriesID[0].linkid}&rel=0&preload=auto`
	);

	onMount(() => {
		description = currentSeriesID[0].description;
		previousSeries = currentSeriesID.slice(1);
	});
</script>

<svelte:head>
	<meta
		name="description"
		content="Watch the latest sermon series from Westwoods Community Church. Join us Sunday mornings in person or online for inspiring messages and worship."
	/>
	<link rel="preload" as="video" href={videoUrl} />
</svelte:head>

<div class="hero">
	<h1 class="pageTitle">Current Series</h1>
	<h2 class="joinUs">Join us Sunday mornings!</h2>
	<h2 class="times">9:30am Live in person and online</h2>
</div>
<div class="contentWrapper">
	<div class="videoWrapper">
		{#if showImage}
			<button
				class="seriesImageWrapper"
				onclick={() => (showImage = false)}
				out:fade={{ duration: 1250 }}
			>
				<Image source={currentSeriesID[0].seriesImage} altTag={currentSeriesID[0].title} />
			</button>
		{:else}
			<iframe
				src="https://www.youtube.com/embed/videoseries?list={currentSeriesID[0]
					.linkid}&autoplay=1&preload=auto"
				title="YouTube video player"
				frameBorder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowFullScreen
			>
			</iframe>
		{/if}
	</div>

	<div class="currentSeriesList">
		<h2 class="ourCurrentSeries">Our current series:</h2>
		<p class="currentSeriesTitle">{currentSeriesID[0].title}</p>
		{#if description}
			<ul>
				{#each description as desc}
					<li>{@html desc}</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>
<div class="previousSeriesWrapper">
	<div class="previousSeriesInnerWrapper">
		<h2 class="previousSeriesTitle">Previous Series</h2>
		<div class="previousSeriesVideoWrapper">
			{#if previousSeries}
				{#each previousSeries as series, index}
					<div class="seriesWrapper">
						<div class="previousVideoWrapper">
							{#if previousShowImage[index]}
								<button
									class="seriesImageWrapper"
									onclick={() => (previousShowImage[index] = false)}
									out:fade={{ duration: 1250 }}
								>
									<Image source={series.seriesImage} altTag={series.title} />
								</button>
							{:else}
								<iframe
									src="https://www.youtube.com/embed/videoseries?list={series.linkid}&autoplay=1"
									title="YouTube video player"
									frameBorder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
								></iframe>
							{/if}
						</div>
						<p class="seriesTitle">{series.title}</p>
					</div>
				{/each}
			{/if}
		</div>
	</div>
</div>

<style>
	.hero {
		display: flex;
		flex-direction: column;
	}
	.joinUs {
		margin: 2rem 0 0;
	}
	.times {
		margin: 0.5rem 0 3rem 0;
	}
	.videoWrapper {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr;
		width: 100%;
		aspect-ratio: 16/9;
		position: relative;
		box-shadow: 0.2rem 0.2rem 1rem oklch(0 0 0 / 0.8);
		border-radius: 1rem;
		overflow: hidden;
	}
	.seriesImageWrapper {
		position: absolute;
		top: 0;
		left: 0;
		border-radius: 1rem;
		overflow: hidden;
		background: var(--backgroundColor);
		border: none;
		cursor: pointer;
		padding: 0;
		line-height: 0;
		box-shadow: 0.2rem 0.2rem 1rem oklch(0 0 0 / 0.8);
		transition: scale 0.5s ease-in-out;
		&:after {
			content: '▶';
			position: absolute;
			inset: 50% 50%;
			width: var(--mockButtonWidth);
			aspect-ratio: 5/3;
			background: #ff0000;
			border-radius: var(--mockButtonBorderRadius);
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: var(--mockButtonFontSize);
			transform: translate(-50%, -50%);
			color: #fff;
		}
		.previousSeriesWrapper & {
			&:hover {
				scale: 1.05;
			}
		}
	}
	.ourCurrentSeries {
		font-size: clamp(1.75rem, 4vw, 3rem);
		margin: 2rem 0 1rem 0;
	}
	.currentSeriesTitle {
		margin: 0 0 1rem 0;
		font-size: clamp(1.25rem, 4vw, 2rem);
	}
	.seriesTitle {
		text-align: center;
		font-size: 1.1rem;
		font-weight: 600;
	}

	.previousVideoWrapper {
		position: relative;
		--mockButtonWidth: 70px;
		--mockButtonFontSize: 1rem;
		--mockButtonBorderRadius: 0.5rem;
		aspect-ratio: 16/9;
	}
	.previousSeriesWrapper {
		margin-block-end: 6rem;
		background: var(--accentColor);
		grid-area: full;
		display: grid;
		place-items: center;
		padding: 5rem;
		clip-path: polygon(0 2.5vw, 100% 0, 100% calc(100% - 2.5vw), 0 100%);
	}
	.previousSeriesInnerWrapper {
		width: 100%;
		max-width: 1200px;
	}
	.previousSeriesVideoWrapper {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 3rem;
		position: relative;
	}
	.previousSeriesTitle {
		text-decoration: underline;
		text-underline-offset: 0.5rem;
	}
	iframe {
		width: 100%;
		aspect-ratio: 16/9;
		border-radius: 1rem;
		box-shadow: 0.2rem 0.2rem 1rem oklch(0 0 0 / 0.8);
	}
	li {
		font-size: 1.2rem;
		margin-block-end: 0.5rem;
	}
	.contentWrapper {
		width: calc(100% - 2rem);
		margin: 0 auto;
		max-width: 1200px;
		grid-area: content;
	}
</style>
