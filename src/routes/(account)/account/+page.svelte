<script>
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client';

	let { data, form } = $props();

	let name = $state(form?.name ?? data.account.name);
	let signingOut = $state(false);

	async function handleSignOut() {
		signingOut = true;
		await authClient.signOut();
		goto('/account/login');
	}
</script>

<div class="accountContainer">
	<div class="accountCard">
		<header class="accountHeader">
			<div>
				<h1>Your Account</h1>
				<p class="subtitle">{data.account.email}</p>
			</div>
			<button class="secondaryButton" type="button" onclick={handleSignOut} disabled={signingOut}>
				{signingOut ? 'Signing out...' : 'Sign out'}
			</button>
		</header>

		<section class="panel">
			<h2>Access</h2>
			<div class="statusRow">
				<span class="roleBadge">{data.account.roleLabel}</span>
				{#if data.account.emailVerified}
					<span class="verifiedNote">Email verified</span>
				{/if}
			</div>
			<p class="panelNote">{data.account.roleDescription}</p>

			{#if data.hasAccess}
				<a class="primaryLink" href={data.homePath}>Go to your dashboard</a>
			{:else}
				<p class="panelNote">
					An administrator has to assign your role before you can use the rest of the site. You do
					not need to do anything else — you will be able to sign in and get to work once that
					happens.
				</p>
			{/if}
		</section>

		<section class="panel">
			<h2>Profile</h2>

			{#if form?.profileError}
				<div class="message error">{form.profileError}</div>
			{:else if form?.profileSuccess}
				<div class="message success">{form.profileSuccess}</div>
			{/if}

			<form method="POST" action="?/updateProfile" use:enhance>
				<div class="formGroup">
					<label for="name">Full name</label>
					<input type="text" id="name" name="name" bind:value={name} required autocomplete="name" />
				</div>

				<div class="formGroup">
					<label for="email">Email</label>
					<input type="email" id="email" value={data.account.email} disabled />
					<p class="fieldNote">Contact an administrator to change your email address.</p>
				</div>

				<button type="submit" class="primaryButton">Save changes</button>
			</form>
		</section>

		<section class="panel">
			<h2>Password</h2>

			{#if form?.passwordError}
				<div class="message error">{form.passwordError}</div>
			{:else if form?.passwordSuccess}
				<div class="message success">{form.passwordSuccess}</div>
			{/if}

			<form method="POST" action="?/changePassword" use:enhance>
				<div class="formGroup">
					<label for="currentPassword">Current password</label>
					<input
						type="password"
						id="currentPassword"
						name="currentPassword"
						required
						autocomplete="current-password"
					/>
				</div>

				<div class="formGroup">
					<label for="newPassword">New password</label>
					<input
						type="password"
						id="newPassword"
						name="newPassword"
						required
						minlength="8"
						autocomplete="new-password"
					/>
				</div>

				<div class="formGroup">
					<label for="confirmPassword">Confirm new password</label>
					<input
						type="password"
						id="confirmPassword"
						name="confirmPassword"
						required
						minlength="8"
						autocomplete="new-password"
					/>
				</div>

				<button type="submit" class="primaryButton">Change password</button>
				<p class="fieldNote">Changing your password signs you out everywhere else.</p>
			</form>
		</section>
	</div>
</div>

<style>
	.accountContainer {
		display: flex;
		justify-content: center;
		min-height: 100vh;
		padding: 2rem 1rem 3rem;
		background: #f5f5f5;
		font-family: 'Open Sans', sans-serif;
		box-sizing: border-box;
	}

	.accountCard {
		background: #fff;
		padding: 2.5rem;
		border-radius: 0.75rem;
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
		width: 100%;
		max-width: 620px;
		height: fit-content;
	}

	.accountHeader {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
	}

	h1 {
		margin: 0 0 0.25rem;
		font-size: 1.75rem;
		color: #1a1a2e;
	}

	h2 {
		margin: 0 0 1rem;
		font-size: 1.05rem;
		color: #1a1a2e;
	}

	.subtitle {
		margin: 0;
		color: #666;
		font-size: 0.9rem;
	}

	.panel {
		margin-top: 2rem;
		padding-top: 1.75rem;
		border-top: 1px solid #eee;
	}

	.statusRow {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.roleBadge {
		display: inline-flex;
		align-items: center;
		padding: 0.2rem 0.6rem;
		border-radius: 999px;
		background: #e0f2fe;
		color: #0369a1;
		font-size: 0.8rem;
		font-weight: 700;
	}

	.verifiedNote {
		font-size: 0.8rem;
		color: #15803d;
		font-weight: 600;
	}

	.panelNote {
		margin: 0.75rem 0 0;
		color: #666;
		font-size: 0.9rem;
		line-height: 1.5;
	}

	.fieldNote {
		margin: 0.5rem 0 0;
		color: #888;
		font-size: 0.8rem;
	}

	.primaryLink {
		display: inline-block;
		margin-top: 1.25rem;
		color: #1a1a2e;
		font-weight: 600;
		font-size: 0.9rem;
	}

	.formGroup {
		margin-bottom: 1.25rem;
	}

	label {
		display: block;
		margin-bottom: 0.375rem;
		font-weight: 600;
		font-size: 0.9rem;
		color: #333;
	}

	input {
		width: 100%;
		padding: 0.625rem 0.75rem;
		border: 1px solid #ddd;
		border-radius: 0.375rem;
		font-size: 1rem;
		font-family: inherit;
		box-sizing: border-box;
		background: #fff;
		color: #1a1a2e;
	}

	input:focus {
		outline: none;
		border-color: #1a1a2e;
	}

	input:disabled {
		background: #f5f5f5;
		color: #888;
	}

	.primaryButton {
		padding: 0.75rem 1.25rem;
		background: #1a1a2e;
		color: #fff;
		border: none;
		border-radius: 0.375rem;
		font-size: 0.95rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.2s;
	}

	.primaryButton:hover:not(:disabled) {
		background: #2a2a4e;
	}

	.secondaryButton {
		padding: 0.5rem 0.9rem;
		background: #fff;
		color: #1a1a2e;
		border: 1px solid #ddd;
		border-radius: 0.375rem;
		font-size: 0.85rem;
		font-weight: 600;
		font-family: inherit;
		cursor: pointer;
		transition: background 0.2s;
	}

	.secondaryButton:hover:not(:disabled) {
		background: #f5f5f5;
	}

	.primaryButton:disabled,
	.secondaryButton:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.message {
		padding: 0.75rem;
		border-radius: 0.375rem;
		margin-bottom: 1rem;
		font-size: 0.9rem;
	}

	.message.error {
		background: #fef2f2;
		color: #dc2626;
		border: 1px solid #fecaca;
	}

	.message.success {
		background: #f0fdf4;
		color: #15803d;
		border: 1px solid #bbf7d0;
	}
</style>
