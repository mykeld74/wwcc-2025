<script>
	let { name, title, image } = $props();
	import { Image } from '$components';
</script>

<div class="leaderCard">
	<div class="leaderCardOutline"></div>
	<div class="leaderCardImage"><Image source={image} alt={name} class="" /></div>

	<div class="leaderCardContent">
		<h2 class="leaderCardName">{name}</h2>
		{#if title}
			<p class="leaderCardTitle">{title}</p>
		{/if}
	</div>
</div>

<style>
	.leaderCard {
		display: grid;
		grid-template-columns:
			[img-start] 2rem [card-start left-start] fit-content(175px)
			[img-end content-start] 2fr [content-end card-end];
		grid-template-rows: [card-start] 1fr [card-end];
		gap: 1rem;
		align-items: center;
		padding: 1rem;
	}
	.leaderCardImage {
		border-radius: 20px;
		grid-area: card / img;
		overflow: hidden;
		aspect-ratio: 1/1;
		height: 80%;
		border: 2px solid #333;
		/* box-shadow: 3px 3px 0 var(--accentColor); */
		padding: 0;

		:global(img) {
			width: 101%;
			height: 101%;
		}
	}
	.leaderCardContent {
		grid-area: card / content;
		padding-right: 0.75rem;
	}
	.leaderCardOutline {
		grid-area: card / card;
		border-radius: 20px;
		height: 100%;
		border: 5px solid var(--accentColor);
		box-shadow: 4px 4px 8px 0 rgba(0, 0, 0, 0.6);
	}
</style>
