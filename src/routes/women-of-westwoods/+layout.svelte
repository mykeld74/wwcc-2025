<script>
	let { children } = $props();
	import { ScrollingHero, GlowButton } from '$components';
	import { page } from '$app/stores';

	const currentWowPage = $derived($page.url.pathname.split('/').pop() || 'wowHome');
	const wowPageName = $derived(
		currentWowPage === 'women-of-westwoods' ? 'wowHome' : currentWowPage
	);
	/** WOW Connect calendar yes; event detail pages no */
	const isWowConnectEventDetail = $derived(
		/\/women-of-westwoods\/wow-connect\/events\/.+/.test($page.url.pathname)
	);
</script>

<div class="wowLayout">
	{#if wowPageName !== 'mom2mom' && !isWowConnectEventDetail}
		<div class="bannerContainer">
			<ScrollingHero currentPage="wow" currentSubPage={wowPageName} />
		</div>
	{/if}

	<div class="contentContainer">
		{@render children()}
	</div>

	{#if !isWowConnectEventDetail}
		<div class="wowLinksContainer">
			<div class="wowLinks">
				{#if wowPageName !== 'wowHome'}
					<a href="../women-of-westwoods"><GlowButton text="WoW Home" /></a>
				{/if}
				{#if wowPageName !== 'wow-connect'}
					<a href="../women-of-westwoods/wow-connect"> <GlowButton text="WoW Events" /></a>
				{/if}
				{#if wowPageName !== 'prayer-gatherings'}
					<a href="../women-of-westwoods/prayer-gatherings">
						<GlowButton text="Prayer Gatherings" /></a
					>
				{/if}
				{#if wowPageName !== 'mom2mom'}
					<a href="../women-of-westwoods/mom2mom"> <GlowButton text="Mom2Mom" /></a>
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	.wowLayout {
		grid-area: full;
	}

	.bannerContainer {
		width: 100vw;
	}

	.contentContainer {
		width: min(1200px, calc(100% - 2rem));
		margin-inline: auto;
		box-sizing: border-box;
	}

	.wowLinksContainer {
		margin-top: 3rem;
	}

	.wowLinks {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 2rem;
		width: calc(100% - 2rem);
		max-width: 1000px;
		margin: 0 auto;
		place-items: center;
		a {
			width: 100%;
		}
	}
</style>
