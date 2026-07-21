<script>
	import { buildPrayerEmailContent, getDefaultPrayerEmailRange } from '$lib/prayerEmailFormat';

	let { data } = $props();

	const defaultRange = getDefaultPrayerEmailRange();
	let startDate = $state(defaultRange.startDate);
	let endDate = $state(defaultRange.endDate);
	let includeStaffOnly = $state(false);
	let copied = $state(false);
	let copyError = $state('');

	const emailContent = $derived(
		buildPrayerEmailContent(data.requests, { startDate, endDate, includeStaffOnly })
	);

	const rangeIsValid = $derived(Boolean(startDate && endDate && startDate <= endDate));

	async function copyEmail() {
		copyError = '';
		copied = false;

		if (!rangeIsValid) {
			copyError = 'Choose a valid date range before copying.';
			return;
		}

		try {
			if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
				await navigator.clipboard.write([
					new ClipboardItem({
						'text/html': new Blob([emailContent.html], { type: 'text/html' }),
						'text/plain': new Blob([emailContent.plainText], { type: 'text/plain' })
					})
				]);
			} else {
				await navigator.clipboard.writeText(emailContent.plainText);
			}
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2000);
		} catch {
			copyError = 'Could not copy to clipboard. Select the preview and copy manually.';
		}
	}

	function escapeCssString(value) {
		return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
	}

	function printEmail() {
		if (!rangeIsValid || emailContent.filtered.length === 0) return;

		const printRangeLabel = escapeCssString(emailContent.rangeLabel);

		const printFrame = document.createElement('iframe');
		printFrame.setAttribute('aria-hidden', 'true');
		printFrame.style.cssText = 'position:fixed;width:0;height:0;border:0;visibility:hidden';
		document.body.appendChild(printFrame);

		const printWindow = printFrame.contentWindow;
		const doc = printFrame.contentDocument ?? printWindow?.document;

		if (!doc || !printWindow) {
			printFrame.remove();
			return;
		}

		doc.open();
		doc.write(`<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8" />
	<title>Westwoods Prayer Requests</title>
	<style>
		body {
			margin: 0;
			font-family: Arial, Helvetica, sans-serif;
			color: #000000;
		}

		@page {
			margin: 0.85in 0.75in 0.75in 0.75in;

			@top-left {
				content: "Westwoods Prayer Requests";
				font: 700 14px Arial, Helvetica, sans-serif;
				color: #000000;
				vertical-align: bottom;
				padding-top: 2rem;
				margin-bottom: .5rem;
			}

			@top-center {
				content: "${printRangeLabel}";
				font: 12px Arial, Helvetica, sans-serif;
				color: #000000;
				vertical-align: bottom;
				padding-top: 2rem;
				margin-bottom: .5rem;
			}

			@top-right {
				content: "Page " counter(page);
				font: 12px Arial, Helvetica, sans-serif;
				color: #000000;
				vertical-align: bottom;
				padding-top: 2rem;
				margin-bottom: .5rem;
			}
		}

		@media print {
			.print-layout {
				width: 100%;
				border-collapse: collapse;
			}

			.print-layout thead {
				display: table-header-group;
			}

			.print-layout tbody {
				display: table-row-group;
			}

			.print-layout td {
				padding: 0;
				vertical-align: top;
			}

			.print-header-rule {
				height: 0;
				margin: 0;
				padding: 0;
				border: none;
				border-bottom: 1px solid #000000;
				line-height: 0;
			}

			.print-header-spacer {
				height: 1rem;
				margin: 0;
				padding: 0;
				line-height: 0;
			}

			.prayer-email-title,
			.prayer-email-range {
				display: none !important;
			}

			.prayer-email-document {
				padding-top: 0 !important;
			}

			.prayer-request-block {
				break-inside: avoid-page;
				page-break-inside: avoid;
			}

			.prayer-section-heading {
				break-after: avoid-page;
				page-break-after: avoid;
			}
		}
	</style>
</head>
<body>
	<table class="print-layout">
		<thead>
			<tr>
				<td class="print-header-rule" aria-hidden="true"></td>
			</tr>
			<tr>
				<td class="print-header-spacer" aria-hidden="true"></td>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>${emailContent.html}</td>
			</tr>
		</tbody>
	</table>
</body>
</html>`);
		doc.close();

		let cleanedUp = false;
		const cleanup = () => {
			if (cleanedUp) return;
			cleanedUp = true;
			window.setTimeout(() => printFrame.remove(), 500);
		};

		printWindow.addEventListener('afterprint', cleanup, { once: true });
		window.setTimeout(cleanup, 3000);
		printWindow.focus();
		printWindow.print();
	}
</script>

<div class="page">
	<header class="pageHeader">
		<div>
			<p class="backLinkWrap">
				<a href="/admin/prayer-requests" class="backLink">← Prayer requests</a>
			</p>
			<h1>Prepare for email</h1>
			<p class="pageIntro">
				Choose a date range, then copy or print a formatted list for your weekly prayer email. WW
				Kids requests appear first. Staff-only requests are excluded unless you check Staff Only
				Email below.
			</p>
		</div>
	</header>

	<section class="controlsPanel" aria-label="Email date range">
		<div class="dateFields">
			<label class="dateField">
				<span>From</span>
				<input type="date" bind:value={startDate} max={endDate || undefined} />
			</label>
			<label class="dateField">
				<span>To</span>
				<input type="date" bind:value={endDate} min={startDate || undefined} />
			</label>
		</div>

		<label class="staffOnlyCheck">
			<input type="checkbox" bind:checked={includeStaffOnly} />
			<span>Staff Only Email</span>
		</label>

		<div class="controlMeta">
			<p>
				{#if rangeIsValid}
					{emailContent.filtered.length} request{emailContent.filtered.length === 1 ? '' : 's'}
					ready · {emailContent.rangeLabel}
				{:else}
					Choose a valid date range.
				{/if}
			</p>
			<div class="actionButtons">
				<button
					class="printBtn"
					type="button"
					onclick={printEmail}
					disabled={!rangeIsValid || emailContent.filtered.length === 0}
				>
					Print
				</button>
				<button
					class="copyBtn"
					type="button"
					onclick={copyEmail}
					disabled={!rangeIsValid || emailContent.filtered.length === 0}
				>
					{copied ? 'Copied!' : 'Copy for email'}
				</button>
			</div>
		</div>

		{#if copyError}
			<p class="copyError" role="alert">{copyError}</p>
		{/if}
	</section>

	<section class="emailPreview" aria-label="Email preview">
		<div class="emailDocument">
			{#if rangeIsValid}
				{@html emailContent.html}
			{:else}
				<p class="emptyPreview">Select a valid date range to preview the email content.</p>
			{/if}
		</div>
	</section>
</div>

<style>
	.page {
		--panelBg: #ffffff;
		--panelBorder: #eceef5;
		--textPrimary: #14162b;
		--textMuted: #6f7692;
		--buttonPrimary: #14162b;
		--buttonPrimaryText: #ffffff;
		--chipBg: #ffffff;
		--chipBorder: #d8dbe8;
		--chipText: #49506a;
		--cardShadow: 0 10px 26px rgba(20, 22, 43, 0.07);
		--linkColor: #0369a1;
		--controlHeight: 2.2rem;
	}

	:global(.adminLayout[data-theme='dark']) .page {
		--panelBg: #0f172a;
		--panelBorder: #26324a;
		--textPrimary: #e2e8f0;
		--textMuted: #94a3b8;
		--buttonPrimary: #e2e8f0;
		--buttonPrimaryText: #0f172a;
		--chipBg: #17243e;
		--chipBorder: #334867;
		--chipText: #b6c2d8;
		--cardShadow: 0 10px 30px rgba(2, 6, 23, 0.45);
		--linkColor: #93c5fd;
	}

	.pageHeader {
		margin-bottom: 1.25rem;
	}

	.backLinkWrap {
		margin: 0 0 0.45rem;
	}

	.backLink {
		color: var(--linkColor);
		text-decoration: none;
		font-size: 0.85rem;
		font-weight: 600;
	}

	.backLink:hover {
		text-decoration: underline;
	}

	.page h1 {
		margin: 0;
		color: var(--textPrimary);
		font-size: clamp(1.4rem, 2.8vw, 2rem);
	}

	.pageIntro {
		margin: 0.35rem 0 0;
		color: var(--textMuted);
		font-size: 0.9rem;
		max-width: 52rem;
	}

	.controlsPanel {
		background: linear-gradient(
			180deg,
			var(--panelBg),
			color-mix(in oklch, var(--panelBg), #f8f9fc 35%)
		);
		border: 1px solid var(--panelBorder);
		border-radius: 0.9rem;
		box-shadow: var(--cardShadow);
		padding: 1rem;
		margin-bottom: 1rem;
		display: grid;
		gap: 0.85rem;
	}

	.dateFields {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.dateField {
		display: grid;
		gap: 0.3rem;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--textMuted);
	}

	.dateField input {
		padding: 0.45rem 0.55rem;
		border: 1px solid var(--chipBorder);
		border-radius: 0.55rem;
		background: var(--chipBg);
		color: var(--textPrimary);
		font: inherit;
		height: var(--controlHeight);
		box-sizing: border-box;
		min-width: 11.5rem;
	}

	.staffOnlyCheck {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--textPrimary);
		cursor: pointer;
		user-select: none;
	}

	.staffOnlyCheck input {
		width: 1.05rem;
		height: 1.05rem;
		margin: 0;
		cursor: pointer;
	}

	.controlMeta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.controlMeta p {
		margin: 0;
		color: var(--textMuted);
		font-size: 0.88rem;
	}

	.actionButtons {
		display: flex;
		flex-wrap: wrap;
		gap: 0.55rem;
	}

	.printBtn,
	.copyBtn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.55rem 0.95rem;
		border-radius: 0.55rem;
		font-size: 0.88rem;
		font-weight: 600;
		cursor: pointer;
		min-height: var(--controlHeight);
	}

	.printBtn {
		border: 1px solid var(--chipBorder);
		background: var(--chipBg);
		color: var(--textPrimary);
	}

	.printBtn:disabled,
	.copyBtn:disabled {
		opacity: 0.55;
		cursor: not-allowed;
	}

	.copyBtn {
		border: 1px solid var(--buttonPrimary);
		background: var(--buttonPrimary);
		color: var(--buttonPrimaryText);
	}

	.copyBtn:disabled {
		opacity: 0.55;
		cursor: not-allowed;
	}

	.copyError {
		margin: 0;
		color: #991b1b;
		font-size: 0.85rem;
		font-weight: 600;
	}

	.emailPreview {
		border: 1px solid var(--panelBorder);
		border-radius: 0.9rem;
		overflow: hidden;
		box-shadow: var(--cardShadow);
	}

	.emailDocument {
		background: #ffffff;
		color: #000000;
		padding: 1.25rem;
		min-height: 12rem;
		font-family: Arial, Helvetica, sans-serif;
		font-size: 17px;
	}

	.emailDocument :global(*) {
		color: #000000;
	}

	.emptyPreview {
		margin: 0;
		color: #000000;
		font-family: Arial, Helvetica, sans-serif;
	}

	@media (max-width: 640px) {
		.dateFields {
			display: grid;
			grid-template-columns: 1fr;
		}

		.dateField input {
			width: 100%;
			min-width: 0;
		}

		.controlMeta {
			align-items: stretch;
		}

		.actionButtons {
			width: 100%;
		}

		.printBtn,
		.copyBtn {
			flex: 1;
		}
	}
</style>
