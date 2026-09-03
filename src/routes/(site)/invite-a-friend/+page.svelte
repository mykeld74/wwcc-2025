<script lang="ts">
	import Icon from '$components/Icon.svelte';
	import ShareButtons from '$components/ShareButtons.svelte';
	import CopyBlock from '$components/CopyBlock.svelte';
	import { services, invitation, inviteLink } from '$lib/config/invite';

	const link = inviteLink();

	const facts = [
		{
			icon: 'clock',
			label: 'When',
			value: `${services.dayLabel}s at ${services.timesLabel}`
		},
		{ icon: 'pin', label: 'Where', value: services.address },
		{ icon: 'calendar', label: 'How long', value: services.durationLabel },
		{ icon: 'shirt', label: 'What to wear', value: 'Whatever they own. Jeans are the norm.' },
		{
			icon: 'child',
			label: 'Kids',
			value: 'Classes through elementary age, or they can stay right beside you.'
		},
		{ icon: 'cup', label: 'Coffee', value: 'Yes. Grab a cup on the way in.' },
		{
			icon: 'car',
			label: 'Parking',
			value: 'Free lot on site. Enter through the north or south doors.'
		}
	];

	const samples = [
		{
			label: 'Text message',
			text: `${invitation.sms}${link}`
		},
		{
			label: 'Social post',
			text: `${invitation.short}\n\n${services.dayLabel}s at ${services.timesLabel}\n${services.address}\n\nWhat to expect: ${link}`
		},

		{
			label: 'Email invitation',
			text: `Subject: ${invitation.subject}\n\n${invitation.email}${link}`
		}
	];
</script>

<svelte:head>
	<meta
		name="description"
		content="Invite a friend to Westwoods Community Church. Share the link or copy ready-to-use wording for a text, an email, or a bulletin."
	/>
</svelte:head>

<h1 class="pageTitle">Invite a Friend</h1>

<div class="contentWrapper inviteAFriend">
	<div class="cardWrapper wrapper1">
		<div class="contentCard">
			<h2 class="contentCardTitle">Start Here</h2>
			<div class="cardContentWrapper">
				<div class="cardContent">
					<p class="contentCardText">
						Almost nobody walks into a church because of a sign or an ad. They come because someone
						they trust said <span class="quote">"come with me."</span> If there is a person you have
						been thinking about &mdash; a neighbor, a coworker, your brother-in-law &mdash; this is an
						easy Sunday to bring them to.
					</p>
					<p class="contentCardText">
						Every link below goes to the same page, so whoever you send it to gets honest answers
						about parking, kids, and what the hour is actually like before they ever show up.
					</p>
					<ShareButtons />
				</div>
			</div>
		</div>
	</div>

	<div class="cardWrapper wrapper2">
		<div class="contentCard">
			<h2 class="contentCardTitle">What They'll Walk Into</h2>
			<div class="cardContentWrapper">
				<div class="cardContent">
					<p class="contentCardText">
						The answers to the questions people are too polite to ask. Worth knowing before you
						invite someone, so you can tell them yourself.
					</p>
					<dl class="factGrid">
						{#each facts as fact (fact.label)}
							<div class="fact">
								<dt>
									<span class="factIcon"><Icon name={fact.icon} size={20} /></span>
									{fact.label}
								</dt>
								<dd>{fact.value}</dd>
							</div>
						{/each}
					</dl>
					<p class="contentCardText">
						<a href="/about-us/plan-a-visit">See the full Plan a Visit page</a> for everything else.
					</p>
				</div>
			</div>
		</div>
	</div>

	<div class="cardWrapper wrapper3">
		<div class="contentCard">
			<h2 class="contentCardTitle">Words You Can Steal</h2>
			<div class="cardContentWrapper">
				<div class="cardContent">
					<p class="contentCardText">
						Written to sound like a person, not a promotion. Edit them freely &mdash; but the tone
						matters more than the words: warm, specific, and no pressure.
					</p>
					<div class="samples">
						{#each samples as sample (sample.label)}
							<CopyBlock label={sample.label} text={sample.text} />
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="cardWrapper wrapper4">
		<div class="contentCard">
			<h2 class="contentCardTitle">One More Thing</h2>
			<div class="cardContentWrapper">
				<div class="cardContent">
					<p class="contentCardText">
						The people we most want in that auditorium are the ones who feel least sure about
						walking in. When you invite someone, lead with the invitation, not the event.
						<span class="quote">"Come with me"</span> does more than any flyer ever will.
					</p>
					<p class="contentCardText">
						And if they say yes &mdash; offer to meet them in the parking lot. Walking in beside
						someone is the whole thing.
					</p>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	/* Emphasis without cardAccent's underline - these are quoted phrases, not links. */
	.quote {
		font-weight: 700;
		color: var(--accentColor);
	}

	.contentCard :global(.share) {
		margin-top: 2rem;
	}

	.factGrid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
		gap: 1.25rem 2rem;
		margin: 2rem 0;
	}

	.fact {
		display: grid;
		gap: 0.3rem;
		align-content: start;
	}

	dt {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.85rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--titleColor);
	}

	.factIcon {
		display: grid;
		place-items: center;
		color: var(--accentColor);
	}

	dd {
		margin: 0;
		font-size: 1.1rem;
		line-height: 1.45;
	}

	.shortLink {
		display: grid;
		gap: 0.35rem;
		margin: 1.5rem 0;
		padding: 1rem 1.35rem;
		border: 1px dashed var(--cardBorder);
		border-radius: 0.85rem;
		background: var(--cardBackground);
		width: fit-content;
		max-width: 100%;
	}

	.shortLabel {
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--titleColor);
	}

	code {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--accentColor);
		word-break: break-all;
	}

	.samples {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 22rem), 1fr));
		gap: 1.15rem;
		margin-top: 2rem;
	}
</style>
