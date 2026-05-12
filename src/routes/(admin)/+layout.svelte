<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	let { data, children } = $props();
	let adminTheme = $state(data.adminTheme ?? 'light');
	let isSidebarCollapsed = $state(false);

	const navItems = [
		{
			label: 'Dashboard',
			href: '/admin',
			icon: 'dashboard'
		},
		{
			label: 'Volunteers',
			href: '/admin/volunteer-opportunities',
			icon: 'volunteers'
		},
		{
			label: 'Prayer Requests',
			href: '/admin/prayer-requests',
			icon: 'prayer'
		}
	];

	const isLoginPage = $derived(
		typeof window !== 'undefined' && window.location.pathname === '/admin/login'
	);

	async function handleLogout() {
		await authClient.signOut();
		goto('/admin/login');
	}

	function toggleTheme() {
		adminTheme = adminTheme === 'dark' ? 'light' : 'dark';
		localStorage.setItem('adminTheme', adminTheme);
		document.cookie = `adminTheme=${adminTheme}; Path=/; Max-Age=31536000; SameSite=Lax`;
	}

	function toggleSidebar() {
		isSidebarCollapsed = !isSidebarCollapsed;
		localStorage.setItem('adminSidebarCollapsed', String(isSidebarCollapsed));
	}

	onMount(() => {
		const storedTheme = localStorage.getItem('adminTheme');
		const storedSidebarState = localStorage.getItem('adminSidebarCollapsed');

		if (storedSidebarState === 'true' || storedSidebarState === 'false') {
			isSidebarCollapsed = storedSidebarState === 'true';
		}

		if (storedTheme === 'light' || storedTheme === 'dark') {
			if (storedTheme !== adminTheme) {
				adminTheme = storedTheme;
			}
			document.cookie = `adminTheme=${storedTheme}; Path=/; Max-Age=31536000; SameSite=Lax`;
			return;
		}

		adminTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
		localStorage.setItem('adminTheme', adminTheme);
		document.cookie = `adminTheme=${adminTheme}; Path=/; Max-Age=31536000; SameSite=Lax`;
	});
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300..800&display=swap"
		rel="stylesheet"
	/>
	<title>Admin | Westwoods Community Church</title>
</svelte:head>

{#snippet navIcon(iconName)}
	{#if iconName === 'dashboard'}
		<svg viewBox="0 0 24 24" aria-hidden="true">
			<rect x="3" y="3" width="8" height="8" rx="1.5"></rect>
			<rect x="13" y="3" width="8" height="5" rx="1.5"></rect>
			<rect x="13" y="10" width="8" height="11" rx="1.5"></rect>
			<rect x="3" y="13" width="8" height="8" rx="1.5"></rect>
		</svg>
	{:else if iconName === 'volunteers'}
		<svg viewBox="0 0 24 24" aria-hidden="true">
			<circle cx="9" cy="8" r="3"></circle>
			<circle cx="17" cy="9" r="2.5"></circle>
			<path d="M4.5 18.5C4.8 15.9 6.9 14 9.5 14H10.4C13 14 15.1 15.9 15.4 18.5"></path>
			<path d="M14 18.5C14.2 16.9 15.6 15.7 17.2 15.7H17.8C19.4 15.7 20.8 16.9 21 18.5"></path>
		</svg>
	{:else}
		<svg viewBox="0 0 24 24" aria-hidden="true">
			<path d="M9.5 4.5 8 10.2c-.2.8 0 1.6.6 2.2l2.1 2.1c.7.7 1.9.7 2.6 0l2.1-2.1c.6-.6.8-1.5.6-2.2l-1.5-5.7"></path>
			<path d="M11 3.8c.3-.9 1.7-.9 2 0l1.6 6.4c.2.7-.3 1.4-1 1.4h-3.2c-.7 0-1.2-.7-1-1.4L11 3.8Z"></path>
			<path d="M7.8 12.4 5.6 18c-.3.8.1 1.7.9 2 .8.3 1.7-.1 2-.9l1.8-4.2"></path>
			<path d="M16.2 12.4 18.4 18c.3.8-.1 1.7-.9 2-.8.3-1.7-.1-2-.9l-1.8-4.2"></path>
			<path d="M9.8 14.6 12 16.8l2.2-2.2"></path>
		</svg>
	{/if}
{/snippet}

{#if !data.user}
	{@render children?.()}
{:else}
	<div class="adminLayout" data-theme={adminTheme} data-collapsed={isSidebarCollapsed}>
		<aside class="sidebar">
			<div class="sidebarHeader">
				<h2>Admin</h2>
				<button
					class="collapseButton"
					type="button"
					onclick={toggleSidebar}
					aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
					title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
				>
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<path d={isSidebarCollapsed ? 'M9 6l6 6-6 6' : 'M15 6l-6 6 6 6'}></path>
					</svg>
				</button>
			</div>
			<nav class="sidebarNav">
				{#each navItems as item}
					<a
						href={item.href}
						class="navLink"
						class:active={page.url.pathname === item.href}
						aria-label={item.label}
						title={isSidebarCollapsed ? item.label : undefined}
					>
						<span class="navIcon">{@render navIcon(item.icon)}</span>
						<span class="navText">{item.label}</span>
					</a>
				{/each}
			</nav>
			<div class="sidebarFooter">
				<div class="userMeta">
					<p class="userInfo">{data.user.name}</p>
					<p class="userRole">{data.user.role}</p>
				</div>
				<button
					class="themeButton"
					type="button"
					onclick={toggleTheme}
					aria-label={adminTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
					title={isSidebarCollapsed
						? adminTheme === 'dark'
							? 'Switch to light mode'
							: 'Switch to dark mode'
						: undefined}
				>
					<span class="actionIcon" aria-hidden="true">
						{#if adminTheme === 'dark'}
							<svg viewBox="0 0 24 24">
								<circle cx="12" cy="12" r="4"></circle>
								<path d="M12 2.5v3M12 18.5v3M4.9 4.9l2.2 2.2M16.9 16.9l2.2 2.2M2.5 12h3M18.5 12h3M4.9 19.1l2.2-2.2M16.9 7.1l2.2-2.2"></path>
							</svg>
						{:else}
							<svg viewBox="0 0 24 24">
								<path d="M20.8 14.6A8.9 8.9 0 1 1 9.4 3.2a7.5 7.5 0 1 0 11.4 11.4Z"></path>
							</svg>
						{/if}
					</span>
					<span class="actionText">
						{adminTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
					</span>
				</button>
				<button
					class="logoutButton"
					type="button"
					onclick={handleLogout}
					aria-label="Log Out"
					title={isSidebarCollapsed ? 'Log Out' : undefined}
				>
					<span class="actionIcon" aria-hidden="true">
						<svg viewBox="0 0 24 24">
							<path d="M9 3.5H5.8A2.3 2.3 0 0 0 3.5 5.8v12.4a2.3 2.3 0 0 0 2.3 2.3H9"></path>
							<path d="M14 7.5 19 12l-5 4.5"></path>
							<path d="M10 12h9"></path>
						</svg>
					</span>
					<span class="actionText">Log Out</span>
				</button>
			</div>
		</aside>
		<main class="adminMain">
			{@render children?.()}
		</main>
	</div>
{/if}

<style>
	:global(body) {
		margin: 0;
		font-family: 'Open Sans', sans-serif;
	}

	.adminLayout {
		--adminSidebarBg: #ffffff;
		--adminSidebarText: #1f2433;
		--adminSidebarMuted: rgba(31, 36, 51, 0.65);
		--adminSidebarBorder: rgba(15, 23, 42, 0.08);
		--adminSidebarHoverBg: rgba(15, 23, 42, 0.06);
		--adminSidebarButtonBg: rgba(15, 23, 42, 0.04);
		--adminSidebarButtonBorder: rgba(15, 23, 42, 0.12);
		--adminSidebarButtonHoverBg: rgba(15, 23, 42, 0.08);
		--adminMainBg: #f5f5f5;
		--adminMainText: #1f2433;
		--adminSidebarWidth: 250px;
		display: grid;
		grid-template-columns: var(--adminSidebarWidth) 1fr;
		height: 100vh;
		color: var(--adminMainText);
		transition: grid-template-columns 0.28s cubic-bezier(0.22, 1, 0.36, 1);
		overflow: hidden;
	}

	.adminLayout[data-collapsed='true'] {
		--adminSidebarWidth: 84px;
	}

	.adminLayout[data-theme='dark'] {
		--adminSidebarBg: #111827;
		--adminSidebarText: #f8fafc;
		--adminSidebarMuted: rgba(248, 250, 252, 0.7);
		--adminSidebarBorder: rgba(248, 250, 252, 0.14);
		--adminSidebarHoverBg: rgba(248, 250, 252, 0.12);
		--adminSidebarButtonBg: rgba(248, 250, 252, 0.1);
		--adminSidebarButtonBorder: rgba(248, 250, 252, 0.24);
		--adminSidebarButtonHoverBg: rgba(248, 250, 252, 0.2);
		--adminMainBg: #0f172a;
		--adminMainText: #e2e8f0;
	}

	.sidebar {
		background: var(--adminSidebarBg);
		color: var(--adminSidebarText);
		display: flex;
		flex-direction: column;
		padding: 0;
		height: 100vh;
		overflow: hidden;
		border-right: 1px solid var(--adminSidebarBorder);
	}

	.sidebarHeader {
		padding: 1.5rem;
		border-bottom: 1px solid var(--adminSidebarBorder);
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		gap: 0.75rem;
	}

	.sidebarHeader h2 {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 600;
		white-space: nowrap;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.collapseButton {
		display: grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
		padding: 0;
		background: transparent;
		color: var(--adminSidebarText);
		border: 1px solid var(--adminSidebarBorder);
		border-radius: 0.5rem;
		cursor: pointer;
		transition: background 0.2s ease;
	}

	.collapseButton svg {
		width: 1rem;
		height: 1rem;
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.collapseButton:hover {
		background: var(--adminSidebarHoverBg);
	}

	.sidebarNav {
		flex: 1;
		display: grid;
		grid-auto-rows: min-content;
		padding: 1rem 0;
		gap: 0.25rem;
	}

	.navLink {
		color: var(--adminSidebarMuted);
		text-decoration: none;
		padding: 0.75rem 1.5rem;
		font-size: 0.95rem;
		display: grid;
		grid-template-columns: 1.25rem 1fr;
		align-items: center;
		gap: 0.75rem;
		transition: all 0.2s ease;
	}

	.navIcon {
		display: grid;
		place-items: center;
		width: 1.25rem;
		height: 1.25rem;
	}

	.navIcon svg {
		width: 1.1rem;
		height: 1.1rem;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.8;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.navText {
		white-space: nowrap;
	}

	.navLink:hover {
		background: var(--adminSidebarHoverBg);
		color: var(--adminSidebarText);
	}

	.navLink.active {
		background: var(--adminSidebarHoverBg);
		color: var(--adminSidebarText);
	}

	.sidebarFooter {
		padding: 1.5rem;
		border-top: 1px solid var(--adminSidebarBorder);
	}

	.userMeta {
		margin-bottom: 0.75rem;
	}

	.userInfo {
		margin: 0;
		font-weight: 600;
		font-size: 0.9rem;
	}

	.userRole {
		margin: 0.25rem 0 0.75rem;
		font-size: 0.8rem;
		color: var(--adminSidebarMuted);
		text-transform: capitalize;
	}

	.themeButton,
	.logoutButton {
		width: 100%;
		padding: 0.5rem 0.625rem;
		background: var(--adminSidebarButtonBg);
		color: var(--adminSidebarText);
		border: 1px solid var(--adminSidebarButtonBorder);
		border-radius: 0.375rem;
		cursor: pointer;
		font-size: 0.85rem;
		transition: background 0.2s;
		display: grid;
		grid-template-columns: 1rem 1fr;
		align-items: center;
		gap: 0.5rem;
		text-align: left;
	}

	.themeButton {
		margin-bottom: 0.5rem;
	}

	.themeButton:hover,
	.logoutButton:hover {
		background: var(--adminSidebarButtonHoverBg);
	}

	.actionIcon {
		display: grid;
		place-items: center;
		width: 1rem;
		height: 1rem;
	}

	.actionIcon svg {
		width: 1rem;
		height: 1rem;
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.actionText {
		white-space: nowrap;
	}

	.sidebarHeader h2,
	.navText,
	.userMeta,
	.actionText {
		opacity: 1;
		transform: translateX(0);
		max-width: 220px;
		overflow: hidden;
		transition:
			opacity 0.2s ease,
			transform 0.25s ease,
			max-width 0.28s ease,
			margin 0.2s ease;
	}

	.adminLayout[data-collapsed='true'] .sidebarHeader {
		padding: 1rem;
		grid-template-columns: 1fr;
		justify-items: center;
	}

	.adminLayout[data-collapsed='true'] .sidebarHeader h2,
	.adminLayout[data-collapsed='true'] .navText,
	.adminLayout[data-collapsed='true'] .userMeta,
	.adminLayout[data-collapsed='true'] .actionText {
		opacity: 0;
		transform: translateX(-12px);
		max-width: 0;
		margin: 0;
		pointer-events: none;
	}

	.adminLayout[data-collapsed='true'] .navLink {
		grid-template-columns: 1fr;
		justify-items: center;
		padding: 0.35rem;
		height: 2rem;
		min-height: 2rem;
		gap: 0;
	}

	.adminLayout[data-collapsed='true'] .sidebarFooter {
		padding: 1rem 0.75rem;
	}

	.adminLayout[data-collapsed='true'] .themeButton,
	.adminLayout[data-collapsed='true'] .logoutButton {
		grid-template-columns: 1fr;
		justify-items: center;
		padding: 0.35rem;
		height: 2rem;
		min-height: 2rem;
		gap: 0;
	}

	.adminMain {
		background: var(--adminMainBg);
		padding: 2rem;
		height: 100vh;
		overflow-y: auto;
	}

	:global(.adminLayout[data-theme='dark'] .page),
	:global(.adminLayout[data-theme='dark'] .page h1),
	:global(.adminLayout[data-theme='dark'] .scopeDescription),
	:global(.adminLayout[data-theme='dark'] .tableWrapper),
	:global(.adminLayout[data-theme='dark'] .opportunityCard),
	:global(.adminLayout[data-theme='dark'] .emptyState) {
		color: var(--adminMainText);
	}

	@media (max-width: 768px) {
		.adminLayout {
			grid-template-columns: 1fr;
		}

		.adminLayout[data-collapsed='true'] {
			grid-template-columns: 1fr;
		}

		.sidebar {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			z-index: 100;
			flex-direction: row;
			align-items: center;
			padding: 0;
			height: auto;
		}

		.sidebarHeader,
		.sidebarFooter {
			display: none;
		}

		.sidebarNav {
			flex-direction: row;
			justify-content: space-around;
			padding: 0;
			width: 100%;
			display: flex;
			gap: 0;
		}

		.navLink {
			padding: 0.75rem 0.5rem;
			text-align: center;
			font-size: 0.8rem;
			grid-template-columns: 1fr;
			justify-items: center;
			gap: 0.35rem;
		}

		.navIcon svg {
			width: 1rem;
			height: 1rem;
		}

		.adminMain {
			padding: 1rem;
			padding-bottom: 4rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.adminLayout,
		.sidebarHeader h2,
		.navText,
		.userMeta,
		.actionText {
			transition: none;
		}
	}
</style>
