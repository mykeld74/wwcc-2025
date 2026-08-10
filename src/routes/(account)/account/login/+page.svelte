<script>
	import { authClient } from '$lib/auth-client';

	let { data } = $props();
	let email = $state('');
	let password = $state('');
	let loginError = $state('');
	let loading = $state(false);

	async function handleLogin(e) {
		e.preventDefault();
		loginError = '';
		loading = true;
		try {
			const { error: authError } = await authClient.signIn.email({
				email,
				password
			});

			if (authError) {
				loginError =
					authError.code === 'EMAIL_NOT_VERIFIED'
						? 'Your email is not verified yet. We just sent a new verification link — check your inbox.'
						: authError.message || 'Invalid email or password';
				return;
			}

			// Force a full reload so the freshly-set auth cookie is definitely included.
			window.location.assign(data.redirectTo);
			return;
		} catch (err) {
			console.error('Admin login failed:', err);
			loginError = 'Unable to sign in right now. Please try again.';
		} finally {
			loading = false;
		}
	}
</script>

<div class="loginContainer">
	<div class="loginCard">
		<h1>Sign In</h1>
		<p class="subtitle">Westwoods Community Church</p>

		{#if data.successMessage}
			<div class="successMessage">{data.successMessage}</div>
		{/if}

		{#if loginError}
			<div class="errorMessage">{loginError}</div>
		{:else if data.reasonMessage}
			<div class="errorMessage">{data.reasonMessage}</div>
		{/if}

		<form onsubmit={handleLogin}>
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
					autocomplete="current-password"
				/>
			</div>

			<button type="submit" class="loginButton" disabled={loading}>
				{loading ? 'Signing in...' : 'Sign In'}
			</button>
		</form>

		<p class="forgotPassword">
			<a href="/account/forgot-password">Forgot your password?</a>
		</p>

		<p class="signUpLink">
			Don't have an account? <a href="/account/sign-up">Create an account</a>
		</p>
	</div>
</div>

<style>
	.loginContainer {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		background: #f5f5f5;
		font-family: 'Open Sans', sans-serif;
	}

	.loginCard {
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

	.loginButton {
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

	.loginButton:hover:not(:disabled) {
		background: #2a2a4e;
	}

	.loginButton:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.successMessage {
		background: #f0fdf4;
		color: #16a34a;
		padding: 0.75rem;
		border-radius: 0.375rem;
		margin-bottom: 1rem;
		font-size: 0.9rem;
		border: 1px solid #bbf7d0;
	}

	.errorMessage {
		background: #fef2f2;
		color: #dc2626;
		padding: 0.75rem;
		border-radius: 0.375rem;
		margin-bottom: 1rem;
		font-size: 0.9rem;
		border: 1px solid #fecaca;
	}

	.forgotPassword {
		margin: 1.25rem 0 0;
		text-align: center;
		font-size: 0.9rem;
	}

	.forgotPassword a {
		color: #1a1a2e;
	}

	.signUpLink {
		margin: 0.75rem 0 0;
		text-align: center;
		font-size: 0.85rem;
		color: #666;
	}

	.signUpLink a {
		color: #1a1a2e;
		font-weight: 600;
	}
</style>
