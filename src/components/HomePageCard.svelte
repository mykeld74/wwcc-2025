<script>
	import { Image } from '$components';
	let { children, cardContent, data } = $props();
</script>

<div class="card" id={cardContent.title.replace(/\s+/g, '')}>
	<div class="imageWrapper">
		{#if cardContent.link}
			<a href={cardContent.link} target={cardContent.newWindow ? '_blank' : null}>
				<Image source={cardContent.image} altTag={cardContent.title} />
			</a>
		{:else}
			<Image source={cardContent.image} altTag={cardContent.title} />
		{/if}
	</div>
	<h2 class="cardTitle">{cardContent.title}</h2>
	<p class="cardBody">{cardContent.body}</p>
</div>

<style>
	@keyframes hoverEffect {
		0% {
			filter: brightness(1);
			scale: 1;
			rotate: 0deg;
		}
		50% {
			rotate: -1deg;
			transform: skewX(1deg);
			scale: 1.025;
		}
		100% {
			filter: brightness(1.15);
			scale: 1.05;
			rotate: 0deg;
		}
	}
	.card {
		width: 100%;
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows:
			[title-start space-start] calc(var(--titleSize) * 0.6)
			[body-start space-end] 1.5rem [ title-end] auto [body-end];
		--titleSize: clamp(3rem, 8vw, 8rem);
		transition: all 0.3s ease-in-out;
		cursor: pointer;
		&:hover {
			filter: brightness(1.15);
			scale: 1.05;
		}
		&#UpcomingEvent {
			@container homePageCards (min-width: 769px) {
				grid-column: 1 / -1;

				max-width: 500px;
			}
			width: 100%;
			margin: 0 auto;
			.imageWrapper {
				aspect-ratio: 1536/1024;
			}
			.cardBody {
				color: #24636a;
				margin-bottom: 0;
				font-size: clamp(1.5rem, 3vw, 2.4rem);
			}
		}
	}
	.imageWrapper {
		width: 100%;
		object-fit: cover;
		grid-area: body;
		border-radius: 2rem;
		overflow: hidden;
		aspect-ratio: 16/9;
		box-shadow: var(--cardImageShadow);
	}

	.cardTitle {
		grid-area: title;
		font-size: clamp(2.5rem, 5vw, 3.2rem);
		font-weight: 700;
		color: var(--titleColor);
		margin: 0 0 0 1.5rem;
		padding: 0;
		align-self: end;
		text-shadow: var(--cardTitleShadow);
		text-align: left;
	}
	.cardBody {
		grid-area: body;
		margin: 0;
		align-self: end;
		justify-self: center;
		margin-bottom: 1rem;
		font-size: 2.4rem;
		color: #fff;
	}
</style>
