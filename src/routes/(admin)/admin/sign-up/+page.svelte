<script>
	import { authClient } from '$lib/auth-client';

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let error = $state('');
	let loading = $state(false);

	async function handleSignUp(e) {
		e.preventDefault();
		error = '';

		if (password.length < 8) {
			error = 'Password must be at least 8 characters.';
			return;
		}

		if (password !== confirmPassword) {
			error = 'Passwords do not match.';
			return;
		}

		loading = true;

		try {
			const { error: authError } = await authClient.signUp.email({
				name,
				email,
				password
			});

			if (authError) {
				error = authError.message || 'Unable to create account. Please try again.';
				return;
			}

			await authClient.signOut();
			window.location.assign('/admin/login?reason=created');
		} catch (err) {
			console.error('Sign up failed:', err);
			error = 'Unable to create account right now. Please try again.';
		} finally {
			loading = false;
		}
	}
</script>

<div class="authContainer">
	<div class="authCard">
		<h1>Create Account</h1>
		<p class="subtitle">Set up your Westwoods Community Church account.</p>

		{#if error}
			<div class="message error">{error}</div>
		{/if}

		<form onsubmit={handleSignUp}>
			<div class="formGroup">
				<label for="name">Full name</label>
				<input
					type="text"
					id="name"
					bind:value={name}
					required
					autocomplete="name"
				/>
			</div>

			<div class="formGroup">
				<label for="email">Email</label>
				<input type="email" id="email" bind:value={email} required autocomplete="email" />
			</div>

			<div class="formGroup">
				<label for="password">Password</label>
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
				{loading ? 'Creating account...' : 'Create Account'}
			</button>
		</form>

		<p class="backLink">
			Already have an account? <a href="/admin/login">Sign in</a>
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
		max-width: 440px;
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
		background: #fff;
		color: #1a1a2e;
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

	.backLink {
		margin: 1.5rem 0 0;
		text-align: center;
		font-size: 0.9rem;
		color: #666;
	}

	.backLink a {
		color: #1a1a2e;
		font-weight: 600;
	}
</style>
