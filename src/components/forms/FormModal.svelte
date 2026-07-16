<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		open?: boolean;
		title: string;
		onClose?: () => void;
		children: Snippet;
	}

	let { open = false, title, onClose, children }: Props = $props();

	let dialog = $state<HTMLDialogElement | null>(null);
	let isClosing = $state(false);

	$effect(() => {
		if (!dialog) return;

		if (open && !dialog.open && !isClosing) {
			dialog.showModal();
			return;
		}

		if (!open && dialog.open && !isClosing) {
			void animateClose();
		}
	});

	async function animateClose() {
		if (!dialog || isClosing) return;

		isClosing = true;

		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (!reducedMotion) {
			await new Promise<void>((resolve) => {
				const finish = () => {
					dialog?.removeEventListener('animationend', onAnimationEnd);
					resolve();
				};

				const onAnimationEnd = (event: AnimationEvent) => {
					if (event.target === dialog && event.animationName === 'modalOut') {
						finish();
					}
				};

				dialog?.addEventListener('animationend', onAnimationEnd);
				window.setTimeout(finish, 280);
			});
		}

		if (dialog.open) {
			dialog.close();
		}
		isClosing = false;
		onClose?.();
	}

	function handleCloseRequest() {
		if (!open || isClosing) return;
		void animateClose();
	}
</script>

<dialog
	bind:this={dialog}
	class="formModal"
	class:closing={isClosing}
	oncancel={(event) => {
		event.preventDefault();
		handleCloseRequest();
	}}
	onclick={(event) => {
		if (event.target === dialog) {
			handleCloseRequest();
		}
	}}
	aria-labelledby="formModalTitle"
>
	<div class="modalHeader">
		<h2 id="formModalTitle">{title}</h2>
		<button type="button" class="closeButton" onclick={handleCloseRequest} aria-label="Close">
			×
		</button>
	</div>
	<div class="modalBody">
		{@render children()}
	</div>
</dialog>

<style>
	.formModal {
		width: min(100vw - 1.5rem, 34rem);
		max-height: min(92dvh, 52rem);
		margin: auto;
		padding: 0;
		border: 1px solid var(--cardBorder);
		border-radius: 0.85rem;
		background: var(--backgroundColor);
		color: var(--textColor);
		box-shadow: 0 12px 40px var(--overlayColor);
		opacity: 0;
		translate: 0 1rem;
		scale: 0.96;
		overflow: hidden;
	}

	.formModal:not([open]) {
		display: none;
	}

	.formModal[open] {
		display: grid;
		grid-template-rows: auto minmax(0, 1fr);
		opacity: 1;
		translate: 0 0;
		scale: 1;
		animation: modalIn 320ms var(--animHoverEase) both;
	}

	.formModal[open]::backdrop {
		background: oklch(0 0 0 / 0.65);
		animation: backdropIn 320ms ease both;
	}

	.formModal.closing {
		animation: modalOut 240ms var(--animHoverEase) forwards;
	}

	.formModal.closing::backdrop {
		animation: backdropOut 240ms ease forwards;
	}

	.modalHeader {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 1.1rem;
		border-bottom: 1px solid var(--cardBorder);
		background: var(--backgroundColor);
	}

	.modalHeader h2 {
		margin: 0;
		font-size: 1.25rem;
		color: var(--titleColor);
	}

	.closeButton {
		width: 2.4rem;
		height: 2.4rem;
		border: none;
		border-radius: 999px;
		background: transparent;
		color: var(--textColor);
		font-size: 1.75rem;
		line-height: 1;
		cursor: pointer;
	}

	.closeButton:hover {
		color: var(--primaryColor);
	}

	.modalBody {
		padding: 1.1rem;
		overflow-x: hidden;
		overflow-y: auto;
		min-height: 0;
	}

	@keyframes modalIn {
		from {
			opacity: 0;
			translate: 0 1rem;
			scale: 0.96;
		}
		to {
			opacity: 1;
			translate: 0 0;
			scale: 1;
		}
	}

	@keyframes modalOut {
		from {
			opacity: 1;
			translate: 0 0;
			scale: 1;
		}
		to {
			opacity: 0;
			translate: 0 0.75rem;
			scale: 0.96;
		}
	}

	@keyframes backdropIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes backdropOut {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.formModal,
		.formModal[open],
		.formModal.closing,
		.formModal[open]::backdrop,
		.formModal.closing::backdrop {
			animation: none;
			opacity: 1;
			translate: none;
			scale: 1;
		}
	}
</style>
