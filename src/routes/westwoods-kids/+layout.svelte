<script>
	let { data, children } = $props();
	import { ScrollingHero } from '$components';
</script>

<div class="wwKidsLayout">
	<div class="bannerContainer">
		<ScrollingHero />
	</div>
	<div class="contentContainer">
		{@render children()}
	</div>
</div>

<style>
	.bannerContainer {
		width: 100vw;
	}
	.contentContainer {
		width: calc(100vw - 4rem);
		margin: 0 auto;
		max-width: 1200px;
	}
</style>
