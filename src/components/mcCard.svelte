<script>
	let { children, cardContent, data } = $props();
</script>

<div class="card">
	<h2 class="cardTitle">{cardContent?.title}</h2>
	<div class="cardBodyWrapper">
		<p class="cardBody">{cardContent?.desc}</p>
		{#if cardContent?.day}
			<p class="cardBody"><strong>Day:</strong> {cardContent?.day}</p>
		{/if}
		{#if cardContent?.time}
			<p class="cardBody"><strong>Time:</strong> {cardContent?.time}</p>
		{/if}
		{#if cardContent?.contact}
			<p class="cardBody">
				<strong>Contact:</strong>
				<br />

				{#each cardContent?.contact as contact}
					<span class="contactNumber">
						{contact}
					</span><br />
				{/each}
			</p>
		{/if}
		{#if cardContent?.location}
			<p class="cardBody"><strong>Location:</strong> {cardContent?.location}</p>
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
		position: relative;
		display: grid;
		grid-template-rows: auto 1fr auto;
		padding: 2rem 1rem 1rem;
		border-radius: 0.5rem;
		margin-top: 3rem;
		position: relative;
		border: 8px solid var(--pageCardBorder);
		z-index: 1;
		&:after {
			content: '';
			position: absolute;
			inset: 0;
			background: var(--cardBackground);
			z-index: -1;
		}
	}

	.cardTitle {
		font-size: clamp(2.5rem, 5vw, 3.2rem);
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
