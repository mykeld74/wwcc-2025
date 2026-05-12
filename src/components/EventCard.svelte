<script>
	import { PortableText } from '@portabletext/svelte';

	let { data } = $props();

	let displayEvents = $derived(
		data.map((event) => ({
			...event,
			title: event.title.replace(/^Summer Connect \| /, '')
		}))
	);
</script>

{#each displayEvents as event}
	<div class="card">
		<h2 class="cardTitle">{event.title}</h2>
		{#if event.date || event.timeLine || event.location}
			<p class="eventMeta">
				{#if event.date}{event.date}{/if}
				{#if event.timeLine}
					{#if event.date} · {/if}{event.timeLine}
				{/if}
				{#if event.location}
					{#if event.date || event.timeLine}<br />{/if}{event.location}
				{/if}
			</p>
		{/if}
		<div class="cardBodyWrapper">
			{#if event.body}
				<PortableText value={event.body} />
			{:else if event.descriptionHtml}
				<div class="pcoDescription">{@html event.descriptionHtml}</div>
			{/if}
			{#if event.churchCenterUrl}
				<p class="eventLinkWrap">
					<a
						href={event.churchCenterUrl}
						class="eventLink"
						target="_blank"
						rel="noopener noreferrer">View on Church Center</a
					>
				</p>
			{/if}
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

	.eventMeta {
		margin: 0 0 1rem;
		font-size: clamp(1rem, 2.5vw, 1.125rem);
		color: var(--contrastColor);
		line-height: 1.5;
	}

	.cardBodyWrapper {
		width: 100%;
		margin: 0;
		justify-self: center;
		margin-bottom: 1rem;
	}

	.pcoDescription :global(p) {
		margin-top: 0;
	}

	.pcoDescription :global(p:last-child) {
		margin-bottom: 0;
	}

	.eventLinkWrap {
		margin: 1.25rem 0 0;
	}

	.eventLink {
		color: var(--primaryColor);
		font-weight: 600;
		text-decoration: underline;
		text-underline-offset: 0.15em;
	}

	.eventLink:hover {
		text-decoration-thickness: 2px;
	}
</style>
