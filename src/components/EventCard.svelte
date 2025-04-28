<script>
	let { children, cardContent, data } = $props();
	import { PortableText } from '@portabletext/svelte';
</script>

{#each data as event}
	<div class="card">
		<h2 class="cardHeader">{event.title}</h2>
		<div class="cardBody">
			<PortableText value={event.body} />
		</div>
	</div>
{/each}

<style>
	.card {
		display: grid;
		grid-template-columns: [left-start] 0px [left-end content-start] 1fr [content-end right-start] 0px [right-end];
		grid-template-rows:
			[title-start space-start] calc(var(--titleSize) * 0.6)
			[body-start space-end] auto [ title-end] auto [body-end];
		--titleSize: clamp(2rem, 3vw, 3rem);

		margin-top: calc((var(--titleSize) * 0.85));
		position: relative;
	}

	.cardHeader {
		font-family: 'Poppins', sans-serif;
		font-size: var(--titleSize);
		font-weight: 600;
		width: 100%;
		color: #ff8000;
		grid-area: title / content;
		margin: 0 0 0 2rem;
		padding: 0;
		text-shadow: var(--cardTitleStroke);
		-webkit-text-stroke: var(--cardTitleStroke);
		z-index: 1;
	}
	.cardTitle {
		font-family: 'Poppins', sans-serif;
		font-size: clamp(1.4rem, 2vw, 2rem);
		font-weight: 600;
		width: 100%;
		text-decoration: underline;
		text-underline-offset: 0.2rem;
		margin: 1.5rem 0 0;
	}
	.cardBody {
		grid-area: body / content;
		width: 100%;
		background-color: var(--cardBackground);
		color: var(--cardTextColor);
		padding: calc(var(--titleSize) * 0.45) 1rem 1rem;
		border-radius: 0.5rem;
	}

	.card {
		--index0: calc(var(--index) - 1); /* 0-based index */
		--reverse-index: calc(var(--numcards) - var(--index0)); /* reverse index */
		--reverse-index0: calc(var(--reverse-index) - 1); /* 0-based reverse index */
	}

	@keyframes scale {
		to {
			transform: scale(calc(1.1 - calc(0.1 * var(--reverse-index))));
		}
	}

	#cards {
		--numcards: 4;
		view-timeline-name: --cards-element-scrolls-in-body;
	}

	.card__content {
		--start-range: calc(var(--index0) / var(--numcards) * 100%);
		--end-range: calc((var(--index)) / var(--numcards) * 100%);

		animation: linear scale forwards;
		animation-timeline: --cards-element-scrolls-in-body;
		animation-range: exit-crossing var(--start-range) exit-crossing var(--end-range);
	}
</style>
