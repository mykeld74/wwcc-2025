<script>
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	let bulkTab = $state('rows');
	let bulkSubmitting = $state(false);
	let bulkSubmittedAt = $state('');
	let nextRowId = $state(6);

	function createEmptyRow(id) {
		return {
			id,
			firstName: '',
			lastName: '',
			request: '',
			isStaffOnly: false,
			isWwKid: false
		};
	}

	let bulkRows = $state([
		createEmptyRow(1),
		createEmptyRow(2),
		createEmptyRow(3),
		createEmptyRow(4),
		createEmptyRow(5)
	]);

	function resetBulkForm() {
		nextRowId = 6;
		bulkSubmittedAt = '';
		bulkRows = [
			createEmptyRow(1),
			createEmptyRow(2),
			createEmptyRow(3),
			createEmptyRow(4),
			createEmptyRow(5)
		];
		bulkTab = 'rows';
	}

	function addBulkRow() {
		bulkRows = [...bulkRows, createEmptyRow(nextRowId)];
		nextRowId += 1;
	}

	function removeBulkRow(id) {
		if (bulkRows.length === 1) {
			bulkRows = [createEmptyRow(nextRowId)];
			nextRowId += 1;
			return;
		}
		bulkRows = bulkRows.filter((row) => row.id !== id);
	}

	function downloadCsvTemplate() {
		const blob = new Blob([data.csvTemplate], { type: 'text/csv;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = 'prayer-requests-template.csv';
		link.click();
		URL.revokeObjectURL(url);
	}
</script>

<div class="page">
	<header class="pageHeader">
		<div>
			<p class="backLinkWrap">
				<a href="/admin/prayer-requests" class="backLink">← Prayer requests</a>
			</p>
			<h1>Bulk upload</h1>
			<p class="pageIntro">Enter paper cards as rows, or upload a CSV.</p>
		</div>
	</header>

	{#if form?.bulkSuccess && form?.bulkMessage}
		<p class="bulkBanner success" role="status">
			{form.bulkMessage}
			<a href="/admin/prayer-requests">View prayer requests</a>
		</p>
	{/if}

	<section class="bulkPanel" aria-label="Bulk add prayer requests">
		<div class="bulkTabs" role="tablist" aria-label="Bulk entry method">
			<button
				type="button"
				class="bulkTab"
				class:active={bulkTab === 'rows'}
				role="tab"
				aria-selected={bulkTab === 'rows'}
				onclick={() => (bulkTab = 'rows')}
			>
				Enter rows
			</button>
			<button
				type="button"
				class="bulkTab"
				class:active={bulkTab === 'csv'}
				role="tab"
				aria-selected={bulkTab === 'csv'}
				onclick={() => (bulkTab = 'csv')}
			>
				Upload CSV
			</button>
		</div>

		{#if form?.bulkMessage && !form?.bulkSuccess}
			<p class="bulkBanner error" role="alert">{form.bulkMessage}</p>
		{/if}

		{#if form?.bulkErrors?.length > 0}
			<ul class="bulkErrorList">
				{#each form.bulkErrors as error, index (index)}
					<li>
						{#if error.row > 0}
							Row {error.row}: {error.message}
						{:else}
							{error.message}
						{/if}
					</li>
				{/each}
			</ul>
		{/if}

		{#if bulkTab === 'rows'}
			<form
				method="POST"
				action="?/bulkCreate"
				class="bulkForm"
				use:enhance={() => {
					bulkSubmitting = true;
					return async ({ result, update }) => {
						bulkSubmitting = false;
						if (result.type === 'success') {
							resetBulkForm();
						}
						await update({ reset: false });
					};
				}}
			>
				<input type="hidden" name="source" value="rows" />
				<input
					type="hidden"
					name="rows"
					value={JSON.stringify(
						bulkRows
							.filter(
								(row) =>
									row.firstName.trim() ||
									row.lastName.trim() ||
									row.request.trim() ||
									row.isStaffOnly ||
									row.isWwKid
							)
							.map(({ firstName, lastName, request, isStaffOnly, isWwKid }) => ({
								firstName,
								lastName,
								request,
								isStaffOnly,
								isWwKid,
								submittedAt: bulkSubmittedAt
							}))
					)}
				/>

				<label class="sharedDateField">
					<span>Date for all requests</span>
					<input type="date" bind:value={bulkSubmittedAt} />
					<small>Leave blank to use today’s date. Empty rows are ignored.</small>
				</label>

				<div class="bulkRows">
					{#each bulkRows as row, index (row.id)}
						<article class="bulkRow">
							<div class="bulkRowTop">
								<span class="bulkRowLabel">Row {index + 1}</span>
								<button
									class="removeRowBtn"
									type="button"
									onclick={() => removeBulkRow(row.id)}
								>
									Remove
								</button>
							</div>
							<div class="bulkFields">
								<label>
									<span>First name</span>
									<input type="text" bind:value={row.firstName} />
								</label>
								<label>
									<span>Last name</span>
									<input type="text" bind:value={row.lastName} />
								</label>
								<label class="requestField">
									<span>Request</span>
									<textarea rows="2" bind:value={row.request}></textarea>
								</label>
								<div class="checkboxRow">
									<label class="flagCheck">
										<input type="checkbox" bind:checked={row.isStaffOnly} />
										<span>Staff only</span>
									</label>
									<label class="flagCheck">
										<input type="checkbox" bind:checked={row.isWwKid} />
										<span>WW Kid</span>
									</label>
								</div>
							</div>
						</article>
					{/each}
				</div>

				<div class="bulkActions">
					<button class="secondaryBtn" type="button" onclick={addBulkRow}>Add row</button>
					<button class="bulkSubmitBtn" type="submit" disabled={bulkSubmitting}>
						{bulkSubmitting ? 'Saving…' : 'Save requests'}
					</button>
				</div>
			</form>
		{:else}
			<form
				method="POST"
				action="?/bulkCreate"
				enctype="multipart/form-data"
				class="bulkForm"
				use:enhance={() => {
					bulkSubmitting = true;
					return async ({ result, update }) => {
						bulkSubmitting = false;
						if (result.type === 'success') {
							resetBulkForm();
						}
						await update({ reset: false });
					};
				}}
			>
				<input type="hidden" name="source" value="csv" />

				<div class="csvHelp">
					<p>
						Required header:
						<code>firstName,lastName,request,isStaffOnly,isWwKid,submittedAt</code>
					</p>
					<p>
						<code>request</code> is required.
						<code>isStaffOnly</code> and <code>isWwKid</code> accept true/false, yes/no, or 1/0.
						<code>submittedAt</code> is optional
						<code>YYYY-MM-DD</code>. Max 200 rows. Blank rows are ignored.
					</p>
					<button class="templateLink" type="button" onclick={downloadCsvTemplate}>
						Download CSV template
					</button>
					<a class="templateLink" href="/prayer-requests-template.csv" download>
						Or open template file
					</a>
				</div>

				<label class="fileField">
					<span>CSV file</span>
					<input type="file" name="file" accept=".csv,text/csv" required />
				</label>

				<div class="bulkActions">
					<button class="bulkSubmitBtn" type="submit" disabled={bulkSubmitting}>
						{bulkSubmitting ? 'Uploading…' : 'Upload CSV'}
					</button>
				</div>
			</form>
		{/if}
	</section>
</div>

<style>
	.page {
		--panelBg: #ffffff;
		--panelAltBg: #f8f9fc;
		--panelBorder: #eceef5;
		--textPrimary: #14162b;
		--textSecondary: #49506a;
		--textMuted: #6f7692;
		--buttonPrimary: #14162b;
		--buttonPrimaryText: #ffffff;
		--chipBg: #ffffff;
		--chipBorder: #d8dbe8;
		--chipText: #49506a;
		--chipActiveBg: #14162b;
		--chipActiveText: #ffffff;
		--cardShadow: 0 10px 26px rgba(20, 22, 43, 0.07);
		--deleteText: #991b1b;
		--linkColor: #0369a1;
		--controlHeight: 2.2rem;
		--successBg: #ecfdf5;
		--successText: #065f46;
		--successBorder: #a7f3d0;
		--errorBg: #fef2f2;
		--errorText: #991b1b;
		--errorBorder: #fecaca;
	}

	:global(.adminLayout[data-theme='dark']) .page {
		--panelBg: #0f172a;
		--panelAltBg: #111c33;
		--panelBorder: #26324a;
		--textPrimary: #e2e8f0;
		--textSecondary: #b6c2d8;
		--textMuted: #94a3b8;
		--buttonPrimary: #e2e8f0;
		--buttonPrimaryText: #0f172a;
		--chipBg: #17243e;
		--chipBorder: #334867;
		--chipText: #b6c2d8;
		--chipActiveBg: #e2e8f0;
		--chipActiveText: #0f172a;
		--cardShadow: 0 10px 30px rgba(2, 6, 23, 0.45);
		--deleteText: #fecaca;
		--linkColor: #93c5fd;
		--successBg: rgba(16, 185, 129, 0.18);
		--successText: #a7f3d0;
		--successBorder: rgba(167, 243, 208, 0.4);
		--errorBg: rgba(239, 68, 68, 0.18);
		--errorText: #fecaca;
		--errorBorder: rgba(252, 165, 165, 0.4);
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
	}

	.bulkPanel {
		background: linear-gradient(180deg, var(--panelBg), var(--panelAltBg));
		border: 1px solid var(--panelBorder);
		border-radius: 0.9rem;
		box-shadow: var(--cardShadow);
		padding: 1.1rem;
		display: grid;
		gap: 1rem;
	}

	.bulkTabs {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.bulkTab {
		padding: 0.45rem 0.8rem;
		border: 1px solid var(--chipBorder);
		border-radius: 999px;
		background: var(--chipBg);
		color: var(--chipText);
		font-size: 0.82rem;
		font-weight: 600;
		cursor: pointer;
	}

	.bulkTab.active {
		background: var(--chipActiveBg);
		color: var(--chipActiveText);
		border-color: var(--chipActiveBg);
	}

	.bulkBanner {
		margin: 0 0 1rem;
		padding: 0.7rem 0.85rem;
		border-radius: 0.6rem;
		font-size: 0.88rem;
		font-weight: 600;
		border: 1px solid transparent;
	}

	.bulkBanner.success {
		background: var(--successBg);
		color: var(--successText);
		border-color: var(--successBorder);
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		align-items: center;
	}

	.bulkBanner.success a {
		color: inherit;
	}

	.bulkBanner.error {
		margin: 0;
		background: var(--errorBg);
		color: var(--errorText);
		border-color: var(--errorBorder);
	}

	.bulkErrorList {
		margin: 0;
		padding: 0.75rem 0.75rem 0.75rem 1.4rem;
		background: var(--errorBg);
		color: var(--errorText);
		border: 1px solid var(--errorBorder);
		border-radius: 0.6rem;
		font-size: 0.82rem;
	}

	.bulkForm {
		display: grid;
		gap: 1rem;
	}

	.sharedDateField {
		display: grid;
		gap: 0.3rem;
		justify-items: start;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--textMuted);
		padding: 0.75rem;
		border: 1px solid var(--panelBorder);
		border-radius: 0.7rem;
		background: color-mix(in oklch, var(--panelBg), var(--panelAltBg) 35%);
	}

	.sharedDateField input {
		padding: 0.5rem 0.6rem;
		border: 1px solid var(--chipBorder);
		border-radius: 0.5rem;
		background: var(--panelBg);
		color: var(--textPrimary);
		font: inherit;
		height: var(--controlHeight);
		box-sizing: border-box;
	}

	.sharedDateField small {
		font-weight: 400;
		color: var(--textMuted);
	}

	.bulkRows {
		display: grid;
		gap: 0.75rem;
	}

	.bulkRow {
		border: 1px solid var(--panelBorder);
		border-radius: 0.7rem;
		padding: 0.75rem;
		background: color-mix(in oklch, var(--panelBg), var(--panelAltBg) 35%);
	}

	.bulkRowTop {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.65rem;
	}

	.bulkRowLabel {
		font-size: 0.78rem;
		font-weight: 700;
		color: var(--textMuted);
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	.removeRowBtn {
		border: none;
		background: transparent;
		color: var(--deleteText);
		font-size: 0.78rem;
		font-weight: 600;
		cursor: pointer;
		padding: 0;
	}

	.bulkFields {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.65rem;
	}

	.bulkFields label {
		display: grid;
		gap: 0.3rem;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--textMuted);
	}

	.bulkFields input,
	.bulkFields textarea,
	.fileField input {
		width: 100%;
		padding: 0.5rem 0.6rem;
		border: 1px solid var(--chipBorder);
		border-radius: 0.5rem;
		background: var(--panelBg);
		color: var(--textPrimary);
		font: inherit;
		box-sizing: border-box;
	}

	.requestField {
		grid-column: 1 / -1;
	}

	.checkboxRow {
		grid-column: 1 / -1;
		display: flex;
		flex-wrap: wrap;
		gap: 1rem 1.5rem;
		align-items: center;
	}

	.flagCheck {
		display: flex !important;
		align-items: center;
		gap: 0.65rem;
		min-height: var(--controlHeight);
		cursor: pointer;
	}

	.flagCheck span {
		font-size: 0.9rem;
		color: var(--textPrimary);
	}

	.flagCheck input {
		width: 1.35rem;
		height: 1.35rem;
		margin: 0;
		flex-shrink: 0;
		accent-color: var(--buttonPrimary);
		cursor: pointer;
	}

	.bulkActions {
		display: flex;
		justify-content: flex-end;
		gap: 0.6rem;
		flex-wrap: wrap;
	}

	.secondaryBtn,
	.bulkSubmitBtn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem 0.9rem;
		border-radius: 0.55rem;
		font-size: 0.85rem;
		font-weight: 600;
		cursor: pointer;
		min-height: var(--controlHeight);
	}

	.secondaryBtn {
		border: 1px solid var(--chipBorder);
		background: var(--chipBg);
		color: var(--chipText);
	}

	.bulkSubmitBtn {
		border: 1px solid var(--buttonPrimary);
		background: var(--buttonPrimary);
		color: var(--buttonPrimaryText);
	}

	.bulkSubmitBtn:hover {
		opacity: 0.92;
	}

	.bulkSubmitBtn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.csvHelp {
		display: grid;
		gap: 0.45rem;
		color: var(--textSecondary);
		font-size: 0.85rem;
	}

	.csvHelp p {
		margin: 0;
	}

	.csvHelp code {
		font-size: 0.8rem;
		color: var(--textPrimary);
	}

	.templateLink {
		justify-self: start;
		color: var(--linkColor);
		font-weight: 600;
		font-size: 0.85rem;
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		text-decoration: none;
	}

	.templateLink:hover {
		text-decoration: underline;
	}

	.fileField {
		display: grid;
		gap: 0.35rem;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--textMuted);
	}

	@media (max-width: 760px) {
		.bulkFields {
			grid-template-columns: 1fr;
		}

		.bulkActions {
			justify-content: stretch;
		}

		.bulkActions > * {
			flex: 1;
		}
	}
</style>
