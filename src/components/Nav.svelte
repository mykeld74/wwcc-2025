<script>
	import { onMount } from 'svelte';
	import { Image } from '$components';

	let triggers = $state([]);
	let background = $state(null);
	let nav = $state(null);
	let isMobileMenuOpen = $state(false);

	const navItems = [
		{
			label: 'Our Groups',
			links: [
				{ label: 'Westwoods Kids', href: '/westwoods-kids', icon: 'icon' },
				{ label: 'Westwoods Students', href: '/westwoods-students', icon: 'icon' },
				{ label: 'Women of Westwoods', href: '/women-of-westwoods', icon: 'icon' },
				{ label: 'Missional Communities', href: '/missional-communities', icon: 'icon' }
			]
		},
		{
			label: 'About Us',
			links: [
				{ label: 'Values', href: '/about-us/values', icon: 'icon' },
				{ label: 'Mission', href: '/about-us/mission', icon: 'icon' },
				{ label: 'Vision', href: '/about-us/vision', icon: 'icon' },
				{ label: 'What We Believe', href: '/about-us/what-we-believe', icon: 'icon' },
				{
					label: 'Volunteer Opportunities',
					href: '/about-us/volunteer-opportunities',
					icon: 'icon'
				},
				{ label: 'Leadership', href: '/about-us/leadership', icon: 'icon' },
				{ label: 'Plan a Visit', href: '/about-us/plan-a-visit', icon: 'icon' }
			]
		},
		{
			label: 'Building Usage',
			links: [
				{ label: 'Facility Rentals', href: '/facility-rentals', icon: 'icon' },
				{ label: 'Weddings', href: 'facility-rentals/weddings', icon: 'icon' }
			]
		}
	];
	const navItems2 = [
		{
			label: 'Have a Question',
			links: [{ label: 'Contact Us', href: '/contact-us', icon: 'icon' }]
		},
		{
			label: 'Prayer',
			links: [
				{
					label: 'Submit a Prayer Request',
					href: '/prayer-request',
					icon: 'wwLogo'
				}
			]
		},
		{
			label: 'Donate',
			links: [
				{
					label: 'Give Online',
					href: 'https://westwoods.churchcenter.com/giving?open-in-church-center-modal=true',
					icon: 'wwLogo'
				}
			]
		}
	];

	let isFirstHover = true;
	let hoverTimer;
	let innerWidth = $state(window.innerWidth);
	let isMobile = $state(false);

	let checkIsMobile = () => {
		if (innerWidth < 1110) {
			isMobile = true;
		} else {
			isMobile = false;
			findNavItems();
		}
	};

	function findNavItems() {
		triggers = document.querySelectorAll('.navItem');
		background = document.querySelector('.navBackground');
		nav = document.querySelector('.nav');
		triggers.forEach((trigger) => {
			trigger.addEventListener('mouseenter', handleMouseenter);
			trigger.addEventListener('mouseleave', handleMouseleave);
			const dropdownContainer = trigger.querySelector('.dropdownContainer');
			dropdownContainer.addEventListener('mouseleave', (e) => {
				if (!trigger.contains(e.relatedTarget)) {
					trigger.classList.remove('trigger-enter', 'trigger-enter-active');
					background.classList.remove('open');
				}
			});
		});
	}
	function handleMouseenter(e) {
		clearTimeout(hoverTimer);

		const trigger = this;
		const dropdown = trigger.querySelector('.dropdown');
		const dropdownContainer = trigger.querySelector('.dropdownContainer');

		trigger.classList.add('trigger-enter');
		setTimeout(() => {
			if (trigger.classList.contains('trigger-enter')) {
				trigger.classList.add('trigger-enter-active');
			}
		}, 150);
		background.classList.add('open');

		const dropdownCoords = dropdown.getBoundingClientRect();
		const navCoords = nav.getBoundingClientRect();

		const coords = {
			height: dropdownCoords.height,
			width: dropdownCoords.width,
			top: dropdownCoords.top - navCoords.top,
			left: dropdownCoords.left - navCoords.left
		};

		if (isFirstHover) {
			background.style.transition = 'opacity 0.1s ease-in-out';
			isFirstHover = false;
		} else {
			background.style.transition = 'all 0.3s ease-in-out';
		}

		background.style.setProperty('width', `${coords.width}px`);
		background.style.setProperty('height', `${coords.height}px`);
		background.style.setProperty('transform', `translate(${coords.left}px, ${coords.top}px)`);

		setTimeout(() => {
			background.style.transition = 'all 0.3s ease-in-out';
		}, 50);
	}

	function handleMouseleave(e) {
		const dropdown = this.querySelector('.dropdownContainer');
		const toElement = e.relatedTarget;

		if (dropdown && (dropdown === toElement || dropdown.contains(toElement))) {
			return;
		}

		this.classList.remove('trigger-enter', 'trigger-enter-active');
		background.classList.remove('open');

		clearTimeout(hoverTimer);
		hoverTimer = setTimeout(() => {
			isFirstHover = true;
		}, 1250);
	}

	onMount(() => {
		findNavItems();

		checkIsMobile();

		triggers.forEach((trigger) => {
			trigger.addEventListener('mouseenter', handleMouseenter);
			trigger.addEventListener('mouseleave', handleMouseleave);

			const dropdownContainer = trigger.querySelector('.dropdownContainer');
			dropdownContainer.addEventListener('mouseleave', (e) => {
				if (!trigger.contains(e.relatedTarget)) {
					trigger.classList.remove('trigger-enter', 'trigger-enter-active');
					background.classList.remove('open');
				}
			});
		});
	});

	function handleItemClick(e) {
		const trigger = e.target.closest('.navItem');
		const background = document.querySelector('.navBackground');

		trigger.classList.remove('trigger-enter', 'trigger-enter-active');
		background.classList.remove('open');
		isFirstHover = true;
	}

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
		document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
	}

	function closeMobileMenu() {
		isMobileMenuOpen = false;
		document.body.style.overflow = '';
	}
</script>

<svelte:window bind:innerWidth on:resize={checkIsMobile} />

{#if isMobile}
	<button class="mobileMenuButton" onclick={toggleMobileMenu} aria-label="Toggle mobile menu">
		<div class="hamburger" class:active={isMobileMenuOpen}>
			<span></span>
			<span></span>
			<span></span>
		</div>
	</button>

	{#if isMobileMenuOpen}
		<div class="mobileNavOverlay">
			<div class="mobileNav" role="dialog" aria-modal="true" tabindex="0">
				<div class="mobileNavHeader">
					<a href="/" onclick={closeMobileMenu}>
						<Image source="wwLogo" altTag="Westwoods Community Church Logo" />
					</a>
				</div>

				<div class="mobileNavContent">
					{#each [...navItems, ...navItems2] as item}
						<div class="mobileNavSection">
							<h3 class="mobileNavLabel">{item.label}</h3>
							<ul class="mobileNavLinks">
								{#each item.links as link}
									<li>
										<a href={link.href} onclick={closeMobileMenu}>
											{link.label}
										</a>
									</li>
								{/each}
							</ul>
						</div>
					{/each}
				</div>
			</div>
		</div>
	{/if}
{:else}
	<nav class="nav">
		<div class="navBackground">
			<span class="navArrow"></span>
		</div>
		<ul class="navContainer">
			{#each navItems as item}
				<li class="navItem">
					<div class="navTrigger">
						<p class="navBlockLabel">{item.label}</p>
					</div>
					<div class="dropdownContainer">
						<ul class={`navLinks dropdown ${item.label.toLowerCase().replace(/\s+/g, '_')}`}>
							{#each item.links as link}
								<li class="navLink">
									<a href={link.href} onclick={handleItemClick}>
										<p class="navLabel">{link.label}</p>
									</a>
								</li>
							{/each}
						</ul>
					</div>
				</li>
			{/each}
			<li class="logo">
				<a href="/"><Image source="wwLogo" altTag="Westwoods Community Church Logo" /></a>
			</li>
			{#each navItems2 as item}
				<li class="navItem">
					<div class="navTrigger">
						<p class="navBlockLabel">{item.label}</p>
					</div>
					<div class="dropdownContainer">
						<ul class={`navLinks dropdown ${item.label.toLowerCase().replace(/\s+/g, '_')}`}>
							{#each item.links as link}
								<li class="navLink">
									<a href={link.href} onclick={handleItemClick}>
										<p class="navLabel">{link.label}</p>
									</a>
								</li>
							{/each}
						</ul>
					</div>
				</li>
			{/each}
		</ul>
	</nav>
{/if}

<style>
	.logo {
		width: 80px;
	}
	.navArrow {
		position: absolute;
		width: 20px;
		height: 20px;
		display: block;
		background: var(--navBackground);
		transform: translateY(-50%) rotate(45deg);
	}

	.navBackground {
		opacity: 0;
		display: flex;
		position: absolute;
		background-color: var(--navBackground);
		border-radius: 20px;
		width: 100px;
		height: 100px;
		transform-origin: 50% 0;
		justify-content: center;
		pointer-events: none;
		will-change: transform, width, height, opacity;

		:global(&.open) {
			opacity: 1;
		}
	}
	ul {
		list-style: none;
	}
	.navLinks {
		display: none;
	}
	.navContainer {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		justify-items: center;
		align-items: center;
		gap: 2rem;
		padding: 0.2rem 1rem;
		p {
			font-size: clamp(0.85rem, 1.25vw, 1.5rem);
		}
	}
	.navItem {
		position: relative;
		display: flex;
		align-items: center;
		height: 100%;
	}
	.navTrigger {
		text-decoration: none;
		color: var(--textColor);
	}
	.dropdownContainer {
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		z-index: 1000;
		padding-top: 0.5rem;
		transition: all 0.3s ease-in-out;
	}
	.dropdown {
		opacity: 0;
		position: relative;
		overflow: hidden;
		padding: 1rem;
		box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.3);
		transform: translateY(0);
		will-change: opacity;
		display: none;
		transition: all 0.3s ease-in-out;
		border-radius: 20px;
	}
	.navLink {
		white-space: nowrap;
		padding: 0.5rem 0;

		a {
			color: var(--textColor);
			text-decoration: none;
			transition: color 0.3s ease-in-out;
			cursor: pointer;
			&:hover {
				color: var(--accentColor);
			}
		}
	}

	/* Update trigger styles */
	:global(.trigger-enter) .dropdown {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.25rem;
		&.have_a_question,
		&.prayer,
		&.donate {
			grid-template-columns: repeat(1, 1fr);
		}
	}

	:global(.trigger-enter-active) .dropdown {
		opacity: 1;
	}

	.navLabel {
		margin: 0;
		padding: 0;
	}
	.nav {
		margin: 0 auto;
		grid-area: nav;
		font-size: 1.25rem;
	}

	.mobileMenuButton {
		position: fixed;
		top: 1rem;
		right: 1.5rem;
		z-index: 1000;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.5rem;
	}

	.hamburger {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 24px;
		height: 18px;
	}

	.hamburger span {
		display: block;
		width: 100%;
		height: 2px;
		background-color: var(--textColor);
		transition: all 0.3s ease-in-out;
	}

	.hamburger.active span:nth-child(1) {
		transform: translateY(8px) rotate(45deg);
	}

	.hamburger.active span:nth-child(2) {
		opacity: 0;
	}

	.hamburger.active span:nth-child(3) {
		transform: translateY(-8px) rotate(-45deg);
	}

	.mobileNavOverlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 999;
	}

	.mobileNav {
		position: fixed;
		top: 0;
		right: 0;
		width: 80%;
		max-width: 400px;
		height: 100vh;
		background-color: var(--navBackground);
		padding: 1rem;
		overflow-y: auto;
		animation: slideIn 0.3s ease-out;
	}

	@keyframes slideIn {
		from {
			transform: translateX(100%);
		}
		to {
			transform: translateX(0);
		}
	}

	.mobileNavHeader {
		max-width: 100px;
		margin: 0 auto;
		margin-bottom: 2rem;
	}

	.mobileNavContent {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.mobileNavSection {
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		padding-bottom: 1rem;
	}

	.mobileNavLabel {
		font-size: 1.25rem;
		margin-bottom: 1rem;
		color: var(--textColor);
	}

	.mobileNavLinks {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.mobileNavLinks li {
		margin-bottom: 0.75rem;
	}

	.mobileNavLinks a {
		color: var(--textColor);
		text-decoration: none;
		font-size: 1rem;
		display: block;
		padding: 0.5rem 0;
		transition: color 0.3s ease;
	}

	.mobileNavLinks a:hover {
		color: var(--accentColor);
	}
</style>
