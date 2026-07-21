<script>
	import { authClient } from '$lib/auth-client';

	let { data } = $props();

	let password = $state('');
	let confirmPassword = $state('');
	let message = $state('');
	let success = $state(false);
	let loading = $state(false);

	const token = $derived(data.token);
	const invalidToken = $derived(data.invalidToken || !token);

	async function handleSubmit(e) {
		e.preventDefault();
		message = '';

		if (password.length < 8) {
			message = 'Password must be at least 8 characters.';
			return;
		}

		if (password !== confirmPassword) {
			message = 'Passwords do not match.';
			return;
		}

		loading = true;

		try {
			const { error: authError } = await authClient.resetPassword({
				newPassword: password,
				token
			});

			if (authError) {
				message = authError.message || 'Unable to reset password. Please request a new link.';
				return;
			}

			success = true;
			message = 'Your password has been reset. You can now sign in.';
		} catch (err) {
			console.error('Password reset failed:', err);
			message = 'Unable to reset password right now. Please try again.';
		} finally {
			loading = false;
		}
	}
</script>

<div class="authContainer">
	<div class="authCard">
		<h1>Reset Password</h1>

		{#if invalidToken}
			<div class="message error">
				This reset link is invalid or has expired. Please request a new one.
			</div>
			<p class="backLink">
				<a href="/admin/forgot-password">Request a new reset link</a>
			</p>
		{:else if success}
			<div class="message success">{message}</div>
			<p class="backLink">
				<a href="/admin/login">Go to sign in</a>
			</p>
		{:else}
			<p class="subtitle">Choose a new password for your account.</p>

			{#if message}
				<div class="message error">{message}</div>
			{/if}

			<form onsubmit={handleSubmit}>
				<div class="formGroup">
					<label for="password">New password</label>
					<input
						type="password"
						id="password"
						bind:value={password}
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
						bind:value={confirmPassword}
						required
						minlength="8"
						autocomplete="new-password"
					/>
				</div>

				<button type="submit" class="primaryButton" disabled={loading}>
					{loading ? 'Saving...' : 'Reset Password'}
				</button>
			</form>

			<p class="backLink">
				<a href="/admin/login">Back to sign in</a>
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
		background: #f5f5f5;
		font-family: 'Open Sans', sans-serif;
	}

	.authCard {
		background: #fff;
		padding: 2.5rem;
		border-radius: 0.75rem;
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
		width: 100%;
		max-width: 400px;
	}

	h1 {
		margin: 0 0 0.25rem;
		font-size: 1.75rem;
		color: #1a1a2e;
	}

	.subtitle {
		margin: 0 0 2rem;
		color: #666;
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
		transition: border-color 0.2s;
	}

	input:focus {
		outline: none;
		border-color: #1a1a2e;
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

	.primaryButton:hover:not(:disabled) {
		background: #2a2a4e;
	}

	.primaryButton:disabled {
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
</style>
