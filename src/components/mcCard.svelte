<script>
	let { children, cardContent, data } = $props();
</script>

<div class="card">
	<h2 class="cardTitle">{cardContent?.title}</h2>
	<div class="cardBodyWrapper">
		<p class="cardBody">{cardContent?.desc}</p>
		{#if cardContent?.day}
			<p class="cardBody cardBodyDay">{cardContent?.day}</p>
		{/if}
		{#if cardContent?.time}
			<p class="cardBody cardBodyTime">{cardContent?.time}</p>
		{/if}
		{#if cardContent?.contact}
			<p
				class="cardBody cardBodyContact
			"
			>
				{#each cardContent?.contact as contact}
					<span class="contactNumber">
						<a href="tel:{contact}">{contact}</a>
					</span><br />
				{/each}
			</p>
		{/if}
		{#if cardContent?.location}
			<p class="cardBody cardBodyLocation">{cardContent?.location}</p>
		{/if}
	</div>
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
		border: 6px ridge var(--pageCardBorder);
		z-index: 1;
		box-shadow: 5px 5px 8px 0 rgba(0, 0, 0, 0.6);
		&:after {
			content: '';
			position: absolute;
			inset: 0;
			background: var(--cardBackground);
			z-index: -1;
		}
	}

	.cardTitle {
		font-size: clamp(2rem, 5vw, 2.8rem);
		font-weight: 700;
		color: var(--titleColor);
		margin: 0;
		padding: 0;
		text-shadow: var(--cardTitleShadow);
		text-align: left;
		margin-top: calc(clamp(3.35rem, 5vw, 3.9rem) * -1);
	}

	.cardBodyWrapper {
		width: 100%;
		margin: 0;
		justify-self: center;
		margin-bottom: 1rem;
		text-align: center;
	}

	.cardBody {
		margin: 0 0 0.75rem;
		padding: 0;
		font-size: 1.4rem;
		line-height: 1.5;
	}
	.cardBodyDay {
		font-weight: 700;
		font-size: 1.7rem;
	}
</style>
