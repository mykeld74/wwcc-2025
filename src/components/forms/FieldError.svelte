<script lang="ts">
	import { fade, fly } from 'svelte/transition';

	interface Props {
		id?: string;
		message?: string;
	}

	let { id, message = '' }: Props = $props();
</script>

{#if message}
	<div
		{id}
		class="errorMessage"
		role="alert"
		in:fly={{ y: -6, duration: 200 }}
		out:fade={{ duration: 150 }}
	>
		{message}
	</div>
{/if}

<style>
	.errorMessage {
		color: #d32f2f;
		background: rgba(211, 47, 47, 0.1);
		padding: 0.75rem;
		border-radius: 0.5rem;
		margin: 0.5rem 0;
		border: 1px solid #f44336;
		font-size: 0.9rem;
	}
</style>
