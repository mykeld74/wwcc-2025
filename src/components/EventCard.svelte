<script>
	import { onMount } from 'svelte';
	let { children, cardContent, data } = $props();
	import { PortableText } from '@portabletext/svelte';

	onMount(() => {
		// remove Summer Connect | from all titles
		data = data.map((event) => ({
			...event,
			title: event.title.replace(/^Summer Connect \| /, '')
		}));
	});
</script>

{#each data as event}
	<div class="card">
		<h2 class="cardTitle">{event.title}</h2>
		<div class="cardBodyWrapper">
			<PortableText value={event.body} />
		</div>
	</div>
{/each}

<style>
	.card {
		display: grid;
		grid-template-rows: auto 1fr auto;
		padding: 2rem 1rem 1rem;
		border-radius: 0.5rem;
		margin-top: 3rem;
		position: relative;
		border: 8px solid var(--pageCardBorder);
	}

	.cardTitle {
		font-size: 2.5rem;
		font-weight: 700;
		color: var(--titleColor);
		margin: 0;
		padding: 0;
		text-shadow: var(--cardTitleShadow);
		text-align: left;
		margin-top: -4rem;
	}

	.cardBodyWrapper {
		width: 100%;
		margin: 0;
		justify-self: center;
		margin-bottom: 1rem;
	}
</style>
