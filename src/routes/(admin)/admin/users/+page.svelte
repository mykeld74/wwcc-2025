<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	let { data, form } = $props();

	let search = $state(data.search);

	const totalPages = $derived(Math.max(1, Math.ceil(data.total / data.pageSize)));
	const roleLabel = $derived(
		Object.fromEntries(data.roles.map((role) => [role.value, role.label]))
	);

	function formatDate(value: string | Date) {
		return new Date(value).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function applySearch(event: Event) {
		event.preventDefault();
		const params = new URLSearchParams();
		if (search.trim()) {
			params.set('search', search.trim());
		}
		goto(`/admin/users?${params.toString()}`);
	}

	function pageHref(page: number) {
		const params = new URLSearchParams();
		if (data.search) {
			params.set('search', data.search);
		}
		if (page > 1) {
			params.set('page', String(page));
		}
		const query = params.toString();
		return query ? `/admin/users?${query}` : '/admin/users';
	}
</script>

<div class="page">
	<div class="pageHeader">
		<div>
			<h1>User Management</h1>
			<p>Create accounts, assign roles, and manage admin access.</p>
		</div>
		<a href="/admin/users/new" class="createBtn">Create Account</a>
	</div>

	{#if data.loadError}
		<p class="inlineError">{data.loadError}</p>
	{/if}

	{#if form?.actionSuccess}
		<p class="inlineSuccess">User updated successfully.</p>
	{/if}

	{#if form?.actionError}
		<p class="inlineError">{form.actionError}</p>
	{/if}

	<section class="panel">
		<div class="panelHeader">
			<h2>Users</h2>
			<p>{data.total} total</p>
		</div>

		<form class="searchForm" onsubmit={applySearch}>
			<input
				type="search"
				placeholder="Search by email"
				bind:value={search}
				aria-label="Search users by email"
			/>
			<button type="submit" class="chipBtn">Search</button>
			{#if data.search}
				<a href="/admin/users" class="chipBtn">Clear</a>
			{/if}
		</form>

		{#if data.users.length === 0}
			<p class="emptyState">No users found.</p>
		{:else}
			<div class="tableWrap">
				<table>
					<thead>
						<tr>
							<th>Name</th>
							<th>Email</th>
							<th>Role</th>
							<th>Status</th>
							<th>Created</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each data.users as user (user.id)}
							<tr class:currentUser={user.id === data.currentUserId}>
								<td>
									<strong>{user.name}</strong>
									{#if user.id === data.currentUserId}
										<span class="youBadge">You</span>
									{/if}
								</td>
								<td>{user.email}</td>
								<td>
									{#if user.id === data.currentUserId}
										<span class="roleBadge">{roleLabel[user.role ?? 'prayer_team'] ?? user.role}</span>
									{:else}
										<form method="POST" action="?/setRole" class="roleForm" use:enhance>
											<input type="hidden" name="userId" value={user.id} />
											<select name="role" onchange={(event) => event.currentTarget.form?.requestSubmit()}>
												{#each data.roles as role}
													<option value={role.value} selected={user.role === role.value}>
														{role.label}
													</option>
												{/each}
											</select>
										</form>
									{/if}
								</td>
								<td>
									{#if user.banned}
										<span class="statusBadge banned">Banned</span>
									{:else}
										<span class="statusBadge active">Active</span>
									{/if}
								</td>
								<td>{formatDate(user.createdAt)}</td>
								<td>
									{#if user.id !== data.currentUserId}
										<div class="actionGroup">
											{#if user.banned}
												<form method="POST" action="?/unbanUser" use:enhance>
													<input type="hidden" name="userId" value={user.id} />
													<button type="submit" class="chipBtn">Unban</button>
												</form>
											{:else}
												<form method="POST" action="?/banUser" use:enhance>
													<input type="hidden" name="userId" value={user.id} />
													<button type="submit" class="chipBtn">Ban</button>
												</form>
											{/if}
											<form
												method="POST"
												action="?/removeUser"
												use:enhance
												onsubmit={(event) => {
													if (!confirm(`Delete ${user.email}? This cannot be undone.`)) {
														event.preventDefault();
													}
												}}
											>
												<input type="hidden" name="userId" value={user.id} />
												<button type="submit" class="deleteBtn">Delete</button>
											</form>
										</div>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			{#if totalPages > 1}
				<div class="pagination">
					{#if data.page > 1}
						<a href={pageHref(data.page - 1)} class="chipBtn">Previous</a>
					{/if}
					<span>Page {data.page} of {totalPages}</span>
					{#if data.page < totalPages}
						<a href={pageHref(data.page + 1)} class="chipBtn">Next</a>
					{/if}
				</div>
			{/if}
		{/if}
	</section>

	<section class="rolesPanel">
		<h2>Role Guide</h2>
		<ul>
			{#each data.roles as role}
				<li>
					<strong>{role.label}</strong>
					<span>{role.description}</span>
				</li>
			{/each}
		</ul>
	</section>
</div>

<style>
	.page {
		--panelBg: #ffffff;
		--panelBorder: #eceef5;
		--textPrimary: #14162b;
		--textSecondary: #49506a;
		--textMuted: #6f7692;
		--buttonPrimary: #14162b;
		--buttonPrimaryText: #ffffff;
		--chipBg: #ffffff;
		--chipBorder: #d8dbe8;
		--chipText: #49506a;
		--cardShadow: 0 10px 26px rgba(20, 22, 43, 0.07);
		--successBg: #dcfce7;
		--successText: #166534;
		--successBorder: #86efac;
		--errorColor: #b91c1c;
		--deleteBg: #fee2e2;
		--deleteText: #991b1b;
		--deleteBorder: #fca5a5;
	}

	:global(.adminLayout[data-theme='dark']) .page {
		--panelBg: #0f172a;
		--panelBorder: #26324a;
		--textPrimary: #e2e8f0;
		--textSecondary: #b6c2d8;
		--textMuted: #94a3b8;
		--buttonPrimary: #e2e8f0;
		--buttonPrimaryText: #0f172a;
		--chipBg: #17243e;
		--chipBorder: #334867;
		--chipText: #b6c2d8;
		--cardShadow: 0 10px 30px rgba(2, 6, 23, 0.45);
		--successBg: rgba(34, 197, 94, 0.34);
		--successText: #dcfce7;
		--successBorder: rgba(134, 239, 172, 0.72);
		--errorColor: #fca5a5;
		--deleteBg: rgba(239, 68, 68, 0.2);
		--deleteText: #fecaca;
		--deleteBorder: rgba(252, 165, 165, 0.45);
	}

	.page h1,
	.page h2 {
		margin: 0;
		color: var(--textPrimary);
	}

	.pageHeader {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
		margin-bottom: 1.5rem;
		flex-wrap: wrap;
	}

	.createBtn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.7rem 1.1rem;
		border-radius: 999px;
		background: var(--buttonPrimary);
		color: var(--buttonPrimaryText);
		font-size: 0.9rem;
		font-weight: 600;
		text-decoration: none;
	}

	.pageHeader p,
	.panelHeader p,
	.rolesPanel li span,
	.emptyState {
		color: var(--textSecondary);
	}

	.panel,
	.rolesPanel {
		background: var(--panelBg);
		border: 1px solid var(--panelBorder);
		border-radius: 1rem;
		box-shadow: var(--cardShadow);
		padding: 1.25rem;
		margin-bottom: 1.5rem;
	}

	.panelHeader {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 1rem;
		margin-bottom: 1rem;
		flex-wrap: wrap;
	}

	.searchForm {
		display: grid;
		gap: 1rem;
		grid-template-columns: minmax(220px, 1fr) auto auto;
		margin-bottom: 1rem;
	}

	label {
		display: grid;
		gap: 0.35rem;
	}

	label span {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--textSecondary);
	}

	input,
	select {
		width: 100%;
		padding: 0.7rem 0.8rem;
		border-radius: 0.6rem;
		border: 1px solid var(--chipBorder);
		background: var(--chipBg);
		color: var(--textPrimary);
		font: inherit;
		box-sizing: border-box;
	}

	.primaryBtn,
	.chipBtn,
	.deleteBtn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 999px;
		padding: 0.65rem 1rem;
		font-size: 0.9rem;
		font-weight: 600;
		border: 1px solid transparent;
		cursor: pointer;
		text-decoration: none;
	}

	.primaryBtn {
		background: var(--buttonPrimary);
		color: var(--buttonPrimaryText);
	}

	.chipBtn {
		background: var(--chipBg);
		color: var(--chipText);
		border-color: var(--chipBorder);
	}

	.deleteBtn {
		background: var(--deleteBg);
		color: var(--deleteText);
		border-color: var(--deleteBorder);
	}

	.inlineError,
	.inlineSuccess,
	.emptyState {
		padding: 0.85rem 1rem;
		border-radius: 0.75rem;
		margin-bottom: 1rem;
	}

	.inlineError {
		background: var(--deleteBg);
		color: var(--errorColor);
		border: 1px solid var(--deleteBorder);
	}

	.inlineSuccess {
		background: var(--successBg);
		color: var(--successText);
		border: 1px solid var(--successBorder);
	}

	.tableWrap {
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th,
	td {
		padding: 0.85rem 0.5rem;
		text-align: left;
		border-bottom: 1px solid var(--panelBorder);
		vertical-align: middle;
	}

	th {
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--textMuted);
	}

	td {
		color: var(--textPrimary);
	}

	tr.currentUser {
		background: color-mix(in oklch, var(--panelBorder) 35%, transparent);
	}

	.youBadge,
	.roleBadge,
	.statusBadge {
		display: inline-flex;
		align-items: center;
		margin-left: 0.5rem;
		padding: 0.2rem 0.55rem;
		border-radius: 999px;
		font-size: 0.75rem;
		font-weight: 700;
	}

	.youBadge {
		background: color-mix(in oklch, var(--buttonPrimary) 12%, transparent);
		color: var(--textSecondary);
	}

	.roleBadge,
	.statusBadge.active {
		background: color-mix(in oklch, #0ea5e9 18%, transparent);
		color: #0369a1;
	}

	.statusBadge.banned {
		background: var(--deleteBg);
		color: var(--deleteText);
	}

	.roleForm select {
		min-width: 9rem;
	}

	.actionGroup {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.pagination {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		margin-top: 1rem;
		color: var(--textSecondary);
	}

	.rolesPanel ul {
		list-style: none;
		padding: 0;
		margin: 1rem 0 0;
		display: grid;
		gap: 0.75rem;
	}

	.rolesPanel li {
		display: grid;
		gap: 0.2rem;
	}
</style>
