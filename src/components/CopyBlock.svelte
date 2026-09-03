<script lang="ts">
	import Icon from './Icon.svelte';

	let { label, text }: { label: string; text: string } = $props();

	let copied = $state(false);
	let timer: ReturnType<typeof setTimeout>;

	async function copy() {
		try {
			await navigator.clipboard.writeText(text);
		} catch {
			const area = document.createElement('textarea');
			area.value = text;
			document.body.append(area);
			area.select();
			document.execCommand('copy');
			area.remove();
		}
		copied = true;
		clearTimeout(timer);
		timer = setTimeout(() => (copied = false), 2400);
	}
</script>

<div class="block">
	<div class="blockHead">
		<h3>{label}</h3>
		<button type="button" class="copyButton" onclick={copy}>
			<Icon name={copied ? 'check' : 'copy'} size={16} />
			{copied ? 'Copied' : 'Copy'}
		</button>
	</div>
	<pre>{text}</pre>
</div>

<style>
	.block {
		border: 1px solid var(--cardBorder);
		border-radius: 0.85rem;
		background: var(--cardBackground);
		box-shadow: 0 4px 18px var(--overlayColor);
		overflow: hidden;
	}

	.blockHead {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.8rem 0.8rem 0.8rem 1.25rem;
		border-bottom: 1px solid var(--cardBorder);
	}

	h3 {
		margin: 0;
		font-size: 0.85rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--titleColor);
	}

	.copyButton {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		flex-shrink: 0;
		padding: 0.45rem 0.95rem;
		border-radius: 999vw;
		border: 1px solid var(--cardBorder);
		background: transparent;
		color: var(--textColor);
		font: inherit;
		font-size: 0.9375rem;
		font-weight: 600;
		cursor: pointer;
		transition:
			border-color var(--animHoverTime) var(--animHoverEase),
			color var(--animHoverTime) var(--animHoverEase);
	}

	.copyButton:hover,
	.copyButton:focus-visible {
		border-color: var(--primaryColor);
		color: var(--accentColor);
		outline: none;
	}

	pre {
		margin: 0;
		padding: 1.25rem;
		font-family: inherit;
		font-size: 1rem;
		line-height: 1.6;
		white-space: pre-wrap;
		word-break: break-word;
		color: var(--textColor);
	}
</style>
