<script lang="ts">
	import { site, invitation, inviteLink } from '$lib/config/invite';
	import Icon from './Icon.svelte';

	let { compact = false }: { compact?: boolean } = $props();

	/*
		One bare link for every channel. It used to carry per-channel UTM codes,
		but the link is the thing people read and retype, so it stays clean and
		the /invite redirect does the tagging server-side instead.
	*/
	const copyUrl = inviteLink();

	const encodedText = encodeURIComponent(invitation.short);
	const emailSubject = encodeURIComponent(invitation.subject);

	const links = [
		{
			id: 'sms',
			label: 'Text it',
			icon: 'message',
			// The ?&body= form is the one both iOS and Android accept.
			href: `sms:?&body=${encodeURIComponent(invitation.sms + copyUrl)}`
		},
		{
			id: 'email',
			label: 'Email it',
			icon: 'mail',
			href: `mailto:?subject=${emailSubject}&body=${encodeURIComponent(invitation.email + copyUrl + '\n')}`
		},
		{
			id: 'facebook',
			label: 'Facebook',
			icon: 'share',
			href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(copyUrl)}`,
			external: true
		},
		{
			id: 'x',
			label: 'X',
			icon: 'share',
			href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodeURIComponent(copyUrl)}`,
			external: true
		}
	];

	let copied = $state(false);
	let copyTimer: ReturnType<typeof setTimeout>;

	async function copyLink() {
		try {
			await navigator.clipboard.writeText(copyUrl);
		} catch {
			// Older browsers and non-secure contexts have no clipboard API.
			const field = document.createElement('input');
			field.value = copyUrl;
			document.body.append(field);
			field.select();
			document.execCommand('copy');
			field.remove();
		}
		copied = true;
		clearTimeout(copyTimer);
		copyTimer = setTimeout(() => (copied = false), 2400);
	}

	/**
	 * The OS share sheet, when the browser offers one (most phones). Detected
	 * after mount rather than during render so the server and the client agree
	 * on the initial markup.
	 */
	let canNativeShare = $state(false);

	$effect(() => {
		canNativeShare = typeof navigator.share === 'function';
	});

	async function nativeShare() {
		try {
			await navigator.share({
				title: site.name,
				text: invitation.short,
				url: copyUrl
			});
		} catch {
			// The person dismissed the share sheet - nothing to do.
		}
	}
</script>

<div class="share" class:compact>
	<div class="linkRow">
		<span class="linkText" title={copyUrl}>{copyUrl.replace(/^https?:\/\//, '')}</span>
		<button type="button" class="shareButton copyButton" onclick={copyLink}>
			<Icon name={copied ? 'check' : 'copy'} size={18} />
			{copied ? 'Copied!' : 'Copy link'}
		</button>
	</div>
	<p class="visuallyHidden" role="status">{copied ? 'Invitation link copied' : ''}</p>

	<div class="buttonRow">
		{#if canNativeShare}
			<button type="button" class="shareButton" onclick={nativeShare}>
				<Icon name="share" size={18} />
				Share
			</button>
		{/if}
		{#each links as link (link.id)}
			<a
				class="shareButton"
				href={link.href}
				target={link.external ? '_blank' : undefined}
				rel={link.external ? 'noopener noreferrer' : undefined}
			>
				<Icon name={link.icon} size={18} />
				{link.label}
			</a>
		{/each}
	</div>
</div>

<style>
	/*
		min-width: 0 all the way down to .linkText. Without it the nowrap URL
		sets a min-content floor that pushes the whole column past the viewport
		on narrow phones.
	*/
	.share {
		display: grid;
		gap: 1rem;
		min-width: 0;
		width: 100%;
	}

	.linkRow {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		min-width: 0;
		padding: 0.4rem 0.4rem 0.4rem 1.1rem;
		background: var(--cardBackground);
		border: 1px solid var(--cardBorder);
		border-radius: 999vw;
		box-shadow: 0 4px 18px var(--overlayColor);
	}

	.linkText {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 1rem;
		font-weight: 600;
		color: var(--textColor);
	}

	.buttonRow {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
	}

	.shareButton {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.7rem 1.2rem;
		border-radius: 999vw;
		border: 1px solid var(--cardBorder);
		background: var(--cardBackground);
		color: var(--textColor);
		font: inherit;
		font-size: 1rem;
		font-weight: 600;
		text-decoration: none;
		cursor: pointer;
		white-space: nowrap;
		transition:
			transform var(--animHoverTime) var(--animHoverEase),
			border-color var(--animHoverTime) var(--animHoverEase),
			color var(--animHoverTime) var(--animHoverEase);
	}

	.shareButton:hover,
	.shareButton:focus-visible {
		transform: scale(1.03);
		border-color: var(--primaryColor);
		color: var(--accentColor);
		outline: none;
	}

	.copyButton {
		flex-shrink: 0;
		border-color: var(--primaryColor);
		color: var(--accentColor);
	}

	.compact .shareButton {
		padding: 0.55rem 1rem;
		font-size: 0.9375rem;
	}

	.visuallyHidden {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: -1px;
		padding: 0;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	@media (prefers-reduced-motion: reduce) {
		.shareButton:hover,
		.shareButton:focus-visible {
			transform: none;
		}
	}
</style>
