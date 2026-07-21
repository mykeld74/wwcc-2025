<script>
	import { authClient } from '$lib/auth-client';

	let email = $state('');
	let message = $state('');
	let success = $state(false);
	let loading = $state(false);

	async function handleSubmit(e) {
		e.preventDefault();
		message = '';
		loading = true;

		try {
			const { error: authError } = await authClient.requestPasswordReset({
				email,
				redirectTo: '/admin/reset-password'
			});

			if (authError) {
				message = authError.message || 'Unable to send reset email. Please try again.';
				success = false;
				return;
			}

			success = true;
			message =
				'If an account exists for that email, we sent a password reset link. Check your inbox.';
		} catch (err) {
			console.error('Password reset request failed:', err);
			success = false;
			message = 'Unable to send reset email right now. Please try again.';
		} finally {
			loading = false;
		}
	}
</script>

<div class="authContainer">
	<div class="authCard">
		<h1>Forgot Password</h1>
		<p class="subtitle">Enter your email and we will send you a reset link.</p>

		{#if message}
			<div class="message" class:success class:error={!success}>{message}</div>
		{/if}

		{#if !success}
			<form onsubmit={handleSubmit}>
				<div class="formGroup">
					<label for="email">Email</label>
					<input type="email" id="email" bind:value={email} required autocomplete="email" />
				</div>

				<button type="submit" class="primaryButton" disabled={loading}>
					{loading ? 'Sending...' : 'Send Reset Link'}
				</button>
			</form>
		{/if}

		<p class="backLink">
			<a href="/admin/login">Back to sign in</a>
		</p>
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
		border: 1px solid #fecaca;
		background: #fef2f2;
		color: #dc2626;
	}

	.message.success {
		background: #f0fdf4;
		color: #16a34a;
		border-color: #bbf7d0;
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
