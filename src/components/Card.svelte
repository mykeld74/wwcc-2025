<script>
	let { title, image, children, cardContent } = $props();
</script>

<div class="card">
	<h2 class="cardTitle">{title}</h2>
	<p class="cardDescription">{@render cardContent()}</p>
	{#if image}
		<img src={image} alt={title} />
	{/if}
</div>

<style>
	.card {
		background-color: var(--cardBackground);
		color: var(--cardTextColor);
		padding: 2rem 1rem 1rem;
		border-radius: 0.5rem;
		margin-top: 6rem;
		position: relative;
	}

	.cardTitle {
		font-family: 'Poppins', sans-serif;
		font-size: 8rem;
		font-weight: 600;
		color: orange;
		margin: 0;
		padding: 0;
		position: absolute;
		top: -5rem;
		left: 2rem;
		text-shadow: var(--cardTitleStroke);
		-webkit-text-stroke: var(--cardTitleStroke);
	}
</style>
