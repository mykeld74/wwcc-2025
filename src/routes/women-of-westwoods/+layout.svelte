<script>
	let { data, children } = $props();
	import { ScrollingHero, GlassButton, GlowButton } from '$components';
</script>

<div class="wowLayout">
	<div class="bannerContainer">
		<ScrollingHero currentPage="wow" />
	</div>
	<div class="contentContainer">
		{@render children()}
	</div>

	<div class="wowLinksContainer">
		<div class="wowLinks">
			<a href="../women-of-westwoods"><GlowButton text="WoW Home" /></a>
			<a href="../women-of-westwoods/wow-connect"> <GlowButton text="WoW Connect" /></a>
			<a href="../women-of-westwoods/prayer-gatherings"> <GlowButton text="Prayer Gatherings" /></a>
		</div>
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
	.wowLinks {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 2rem;
		width: calc(100% - 2rem);
		max-width: 1000px;
		margin: 0 auto;
		place-items: center;
	}
	.wowLinksContainer {
		margin-top: 3rem;
		padding: 1rem 0;
		a {
			width: 100%;
		}
	}
</style>
