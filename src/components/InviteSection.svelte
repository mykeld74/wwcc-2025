<script lang="ts">
	import ShareButtons from './ShareButtons.svelte';
	import Icon from './Icon.svelte';
</script>

<section class="inviteSection" id="invite" aria-labelledby="inviteHeading">
	<div class="inviteInner">
		<div class="copy">
			<p class="eyebrow">Invite someone</p>
			<h2 id="inviteHeading" class="inviteTitle">Most people come because a friend asked them.</h2>
			<p class="lede">
				Not a sign. Not an ad. A person they trust saying "come with me." If there is someone you
				have been thinking about &mdash; a neighbor, a coworker, your in-laws &mdash; here's an easy
				way to invite them to Westwoods.
			</p>

			<ShareButtons compact />

			<p class="fine">
				Every link lands on the same page, so whoever you send it to gets the same honest answers
				you would give them.
				<a href="/invite-a-friend">Get ready-to-use wording &rarr;</a>
			</p>
		</div>

		<aside class="preview" aria-label="Example invitation">
			<div class="phone">
				<div class="bubble them">
					Hey &mdash; you free Sunday morning? I go to a church off Wadsworth called Westwoods.
				</div>
				<div class="bubble them">
					It's casual, about an hour, and there's coffee. No pressure at all. Want to come with me?
				</div>
				<div class="bubble me">honestly&hellip; yeah, why not</div>
			</div>
			<p class="previewNote">
				<Icon name="heart" size={16} />
				That's the whole thing. No pitch required.
			</p>
		</aside>
	</div>
</section>

<style>
	.inviteSection {
		/*
			Full bleed across the page grid, in the implicit row after .wwIsWrapper.
			`full 2` rather than `full`: the row axis has no line named `full`, so both
			sections would otherwise resolve to the same implicit row and stack on top
			of each other. The second implicit line puts this one below.
		*/
		grid-column: full;
		grid-row: full 2;
		container-type: inline-size;
		container-name: inviteSection;
		margin-block: 5rem 0;
		padding: clamp(2rem, 4vw, 3.5rem) 1rem;
	}

	.inviteInner {
		display: grid;
		gap: clamp(2rem, 4vw, 3.5rem);
		align-items: center;
		width: calc(100% - 2rem);
		max-width: 1200px;
		margin: 0 auto;
	}

	@container inviteSection (width > 900px) {
		.inviteInner {
			grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
		}
	}

	.copy {
		display: grid;
		gap: 1rem;
		justify-items: start;
		min-width: 0;
	}

	.eyebrow {
		margin: 0;
		font-size: 0.85rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--accentColor);
	}

	.inviteTitle {
		margin: 0;
		font-size: clamp(1.85rem, 4vw, 3rem);
		font-weight: 700;
		line-height: 1.15;
		text-wrap: balance;
		color: var(--titleColor);
		text-shadow: 2px 4px 4px oklch(0 0 0 / 0.4);
	}

	.lede {
		margin: 0;
		font-size: clamp(1.1rem, 1.8vw, 1.35rem);
		line-height: 1.5;
		max-width: 40rem;
	}

	.copy :global(.share) {
		margin-top: 0.75rem;
	}

	.fine {
		margin: 0;
		font-size: 1rem;
		line-height: 1.5;
		opacity: 0.85;
		max-width: 40rem;
	}

	.phone {
		display: grid;
		justify-items: start;
		gap: 0.5rem;
		padding: 1.5rem 1.25rem;
		border: 1px solid var(--cardBorder);
		border-radius: 1.15rem;
		background: var(--cardBackground);
		box-shadow: 0 4px 18px var(--overlayColor);
	}

	.bubble {
		max-width: 85%;
		padding: 0.7rem 1rem;
		border-radius: 1.15rem;
		font-size: 1rem;
		line-height: 1.45;
	}

	.them {
		justify-self: start;
		background: var(--navBackground);
		color: var(--textColor);
		border-bottom-left-radius: 0.35rem;
	}

	.me {
		justify-self: end;
		background: var(--primaryColor);
		color: #fff;
		border-bottom-right-radius: 0.35rem;
	}

	.previewNote {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.45rem;
		margin: 0.85rem 0 0;
		font-size: 1rem;
		opacity: 0.85;
	}

	.previewNote :global(svg) {
		color: var(--accentColor);
		flex-shrink: 0;
	}
</style>
