<script>
	let { children, cardContent, data } = $props();
</script>

<div class="card">
	<h2 class="cardTitle">{cardContent?.title}</h2>
	<div class="cardBodyWrapper">
		<p class="cardBody">{cardContent?.desc}</p>
		{#if cardContent?.time}
			<p class="cardBody"><strong>When:</strong> {cardContent?.time}</p>
		{/if}
		{#if cardContent?.features}
			<ul class="cardBody">
				{#each cardContent?.features as feature}
					<li>{feature}</li>
				{/each}
			</ul>
		{/if}
	</div>
	{#if cardContent?.button}
		<div class="cardButtonWrapper">
			<button
				class={`cardButton cardButton-${cardContent?.team}`}
				data-team={cardContent?.team}
				data-title={cardContent?.title}>Learn More</button
			>
		</div>
	{/if}
</div>

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
		font-size: clamp(2.5rem, 5vw, 3rem);
		font-weight: 700;
		color: var(--titleColor);
		margin: 0;
		padding: 0;
		text-shadow: var(--cardTitleShadow);
		text-align: left;
		margin-top: calc(clamp(3.75rem, 5vw, 4.1rem) * -1);
	}

	.cardBodyWrapper {
		width: 100%;
		margin: 0;
		justify-self: center;
		margin-bottom: 1rem;
	}

	.cardButtonWrapper {
		margin: 0;
		justify-self: flex-end;
		align-self: flex-end;
		margin-bottom: 1rem;
	}

	.cardButton {
		background-color: var(--titleColor);
		color: var(--cardTextColor);
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		border: none;
		cursor: pointer;
		font-size: 1.5rem;
		font-weight: 700;
		text-transform: uppercase;
	}
</style>
