<script>
	import { authClient } from '$lib/auth-client';

	let { data } = $props();
	let email = $state('');
	let password = $state('');
	let error = $state(data.reasonMessage ?? '');
	let loading = $state(false);

	async function handleLogin(e) {
		e.preventDefault();
		error = '';
		loading = true;
		try {
			const { error: authError } = await authClient.signIn.email({
				email,
				password
			});

			if (authError) {
				error = authError.message || 'Invalid email or password';
				return;
			}

			// Force a full reload so the freshly-set auth cookie is definitely included.
			window.location.assign('/admin');
			return;
		} catch (err) {
			console.error('Admin login failed:', err);
			error = 'Unable to sign in right now. Please try again.';
		} finally {
			loading = false;
		}
	}
</script>

<div class="loginContainer">
	<div class="loginCard">
		<h1>Staff Login</h1>
		<p class="subtitle">Westwoods Community Church</p>

		{#if error}
			<div class="errorMessage">{error}</div>
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

	.errorMessage {
		background: #fef2f2;
		color: #dc2626;
		padding: 0.75rem;
		border-radius: 0.375rem;
		margin-bottom: 1rem;
		font-size: 0.9rem;
		border: 1px solid #fecaca;
	}
</style>
