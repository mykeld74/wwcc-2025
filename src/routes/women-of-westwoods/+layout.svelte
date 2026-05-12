<script>
	let { children } = $props();
</script>

<div class="wowLayout">
	<div class="contentContainer">
		{@render children()}
	</div>
</div>

<style>
	.wowLayout {
		grid-area: full;
	}

	.contentContainer {
		width: min(1200px, calc(100% - 2rem));
		margin-inline: auto;
		box-sizing: border-box;
	}
</style>
