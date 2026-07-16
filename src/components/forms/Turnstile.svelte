<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { onDestroy, onMount } from 'svelte';

	const siteKey = env.PUBLIC_TURNSTILE_SITE_KEY;
	let container = $state<HTMLDivElement | null>(null);
	let widgetId: string | undefined;
	let retry: ReturnType<typeof setTimeout> | undefined;

	onMount(() => {
		if (!siteKey) return;

		function renderWidget() {
			if (container && window.turnstile) {
				widgetId = window.turnstile.render(container, {
					sitekey: siteKey,
					theme: 'auto'
				});
				return;
			}

			retry = setTimeout(renderWidget, 50);
		}

		renderWidget();
	});

	onDestroy(() => {
		if (retry) {
			clearTimeout(retry);
		}

		if (widgetId) {
			window.turnstile?.remove(widgetId);
		}
	});
</script>

<div class="turnstileGroup">
	{#if siteKey}
		<div bind:this={container}></div>
	{:else}
		<p class="turnstileWarning">Security check is not configured.</p>
	{/if}
</div>

<style>
	.turnstileGroup {
		display: grid;
		justify-items: start;
		margin: 0 0 1.25rem;
	}

	.turnstileWarning {
		margin: 0;
		color: #d32f2f;
		font-size: 0.9rem;
	}
</style>
