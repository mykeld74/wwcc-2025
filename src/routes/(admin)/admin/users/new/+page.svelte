<script lang="ts">
	import { enhance } from '$app/forms';

	import { DEFAULT_ASSIGNABLE_ROLE } from '$lib/adminRoles';

	let { data, form } = $props();

	let role = $state(form?.role ?? DEFAULT_ASSIGNABLE_ROLE);
	let name = $state(form?.name ?? '');
	let email = $state(form?.email ?? '');
</script>

<div class="authContainer">
	<div class="authCard">
		<h1>Create Account</h1>
		<p class="subtitle">
			Set up sign-in credentials for a new account. They can use these at
			<a href="/account/login">/account/login</a>.
		</p>

		{#if form?.success}
			<div class="message success">
				Account created for <strong>{form.createdEmail}</strong>. They must verify their email
				before they can sign in — a link is sent automatically the first time they try.
			</div>
			<p class="backLink">
				<a href="/admin/users">Back to user list</a>
				<span class="divider">·</span>
				<a href="/admin/users/new">Create another</a>
			</p>
		{:else}
			{#if form?.error}
				<div class="message error">{form.error}</div>
			{/if}

			<form method="POST" use:enhance>
				<div class="formGroup">
					<label for="name">Full name</label>
					<input
						type="text"
						id="name"
						name="name"
						bind:value={name}
						required
						autocomplete="name"
					/>
				</div>

				<div class="formGroup">
					<label for="email">Email</label>
					<input
						type="email"
						id="email"
						name="email"
						bind:value={email}
						required
						autocomplete="email"
					/>
				</div>

				<div class="formGroup">
					<label for="password">Password</label>
					<input
						type="password"
						id="password"
						name="password"
						required
						minlength="8"
						autocomplete="new-password"
					/>
				</div>

				<div class="formGroup">
					<label for="confirmPassword">Confirm password</label>
					<input
						type="password"
						id="confirmPassword"
						name="confirmPassword"
						required
						minlength="8"
						autocomplete="new-password"
					/>
				</div>

				<div class="formGroup">
					<label for="role">Role</label>
					<select id="role" name="role" bind:value={role}>
						{#each data.roles as option}
							<option value={option.value}>{option.label}</option>
						{/each}
					</select>
					<p class="roleHint">
						{data.roles.find((option) => option.value === role)?.description}
					</p>
				</div>

				<button type="submit" class="primaryButton">Create Account</button>
			</form>

			<p class="backLink">
				<a href="/admin/users">Back to user list</a>
				<span class="divider">·</span>
				<a href="/account/login">Sign in page</a>
			</p>
		{/if}
	</div>
</div>

<style>
	.authContainer {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		padding: 2rem 1rem;
		background: #f5f5f5;
		font-family: 'Open Sans', sans-serif;
	}

	.authCard {
		background: #fff;
		padding: 2.5rem;
		border-radius: 0.75rem;
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
		width: 100%;
		max-width: 440px;
	}

	:global(.adminLayout[data-theme='dark']) .authCard {
		background: #0f172a;
		box-shadow: 0 10px 30px rgba(2, 6, 23, 0.45);
	}

	h1 {
		margin: 0 0 0.25rem;
		font-size: 1.75rem;
		color: #1a1a2e;
	}

	:global(.adminLayout[data-theme='dark']) h1 {
		color: #e2e8f0;
	}

	.subtitle {
		margin: 0 0 2rem;
		color: #666;
		font-size: 0.9rem;
		line-height: 1.5;
	}

	:global(.adminLayout[data-theme='dark']) .subtitle {
		color: #94a3b8;
	}

	.subtitle a {
		color: inherit;
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

	:global(.adminLayout[data-theme='dark']) label {
		color: #e2e8f0;
	}

	input,
	select {
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

	:global(.adminLayout[data-theme='dark']) input,
	:global(.adminLayout[data-theme='dark']) select {
		background: #17243e;
		border-color: #334867;
		color: #e2e8f0;
	}

	input:focus,
	select:focus {
		outline: none;
		border-color: #1a1a2e;
	}

	.roleHint {
		margin: 0.5rem 0 0;
		font-size: 0.85rem;
		color: #666;
		line-height: 1.4;
	}

	:global(.adminLayout[data-theme='dark']) .roleHint {
		color: #94a3b8;
	}

	.primaryButton {
		width: 100%;
		padding: 0.75rem;
		background: #1a1a2e;
		color: #fff;
		border: none;
		border-radius: 0.375rem;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.2s;
		margin-top: 0.5rem;
	}

	.primaryButton:hover {
		background: #2a2a4e;
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
		color: #16a34a;
		border: 1px solid #bbf7d0;
	}

	.backLink {
		margin: 1.5rem 0 0;
		text-align: center;
		font-size: 0.9rem;
	}

	.backLink a {
		color: #1a1a2e;
	}

	:global(.adminLayout[data-theme='dark']) .backLink a {
		color: #e2e8f0;
	}

	.divider {
		margin: 0 0.5rem;
		color: #999;
	}
</style>
