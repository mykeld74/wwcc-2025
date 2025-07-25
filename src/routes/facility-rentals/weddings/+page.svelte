<svelte:head>
	<meta
		name="description"
		content="Celebrate your wedding at Westwoods Community Church. View our wedding packages, venue details, and start your reservation process today."
	/>
</svelte:head>

<div class="contentWrapper">
	<h1 class="pageTitle">Weddings</h1>

	<div class="weddingContent">
		<div class="introSection">
			<p>
				Thank you for considering Westwoods as your wedding venue! We would love to be a part of
				your special day. Below you will find wedding packages and other information about our
				space. If you have any further questions, please email Joe at <a
					href="mailto:joe@westwoodscc.org">Joe@westwoodscc.org</a
				>
				and he'll be in touch! If you regularly attend Westwoods, we would love to give you a family
				discount. Please reach out to discuss prices. You can add a Westwoods' approved bartender to
				any reception package.
				<a
					href="https://drive.google.com/file/d/0B_maZVwX6vgjUGN2d2ZQRjlXRjQ/view"
					rel="noopener noreferrer"
					target="_blank">Please view our policy and fees here.</a
				>
			</p>
		</div>

		<div class="paymentSection">
			<h2 class="sectionTitle">Payment Terms</h2>
			<ul>
				<li>
					Each rental includes a damage deposit that will be returned to you in full after the event
					if there are no damages. If there are damages, we will be in contact with you.
				</li>
				<li>The date will be secured on our calendar after we receive your damage deposit.</li>
				<li>Payment in full is required 60 days prior to your wedding date.</li>
			</ul>
			<p>
				To start the reservation process for your wedding, <a
					href="/facility-rentals/weddings/rental-form">please use this link</a
				> .
			</p>
		</div>

		<div class="packagesSection">
			<div class="packageCard">
				<h3 class="packageTitle">Gold Auditorium Package</h3>
				<p class="packagePrice">$1,850.00 fee, $300 damage deposit</p>
				<p class="packageDescription">Auditorium for ceremony, Café for reception</p>

				<h4 class="packageSubtitle">Westwoods will provide:</h4>
				<ul>
					<li>Pastor to officiate</li>
					<li>
						Wedding Coordinator to host the building during ceremony and reception, as well as
						coordinate the wedding ceremony if desired
					</li>
					<li>Tech booth support for sound and lighting</li>
					<li>
						Building use on day of wedding up to 8 hours for set up, ceremony and reception, as well
						as 2 hours the night prior for the wedding rehearsal
					</li>
					<li>
						Our cleaning crew will take care of the deep cleaning after the reception, but you will
						still be responsible for general clean up of all trash, décor and food.
					</li>
				</ul>
			</div>

			<div class="packageCard">
				<h3 class="packageTitle">Silver Auditorium Package</h3>
				<p class="packagePrice">$1,125.00 fee, $150 damage deposit</p>
				<p class="packageDescription">
					Auditorium for ceremony only, reception at a different venue
				</p>

				<h4 class="packageSubtitle">Westwoods will provide:</h4>
				<ul>
					<li>Pastor to officiate</li>
					<li>
						Wedding Coordinator to host the building as well as coordinate the wedding ceremony if
						desired
					</li>
					<li>Tech booth support for sound and lighting</li>
					<li>
						Building use on day of wedding up to 5 hours for set up and ceremony as well as 2 hours
						the night prior for the wedding rehearsal
					</li>
				</ul>
			</div>

			<div class="packageCard">
				<h3 class="packageTitle">Gold Workshop Package</h3>
				<p class="packagePrice">$1,550.00 fee, $300 damage deposit</p>
				<p class="packageDescription">
					The Workshop for ceremony, Café for reception or lawn for reception depending on time of
					year
				</p>

				<h4 class="packageSubtitle">Westwoods will provide:</h4>
				<ul>
					<li>Pastor to officiate</li>
					<li>
						Wedding Coordinator to host the building during the ceremony and reception as well as
						coordinate the wedding ceremony if desired
					</li>
					<li>Tech support for sound</li>
					<li>
						Building use on day of wedding up to 8 hours for set up, ceremony and reception, as well
						as 1 hour the night prior for the wedding rehearsal
					</li>
					<li>
						Our cleaning crew will take care of the deep cleaning after the reception, but you will
						still be responsible for general clean up of all trash, décor and food.
					</li>
				</ul>
			</div>

			<div class="packageCard">
				<h3 class="packageTitle">Silver Workshop Package</h3>
				<p class="packagePrice">$900.00 fee, $150 damage deposit</p>
				<p class="packageDescription">
					The Workshop for ceremony, reception in The Workshop or at a different venue
				</p>
				<p class="packageNote">
					*Only select this option if your wedding invite list is small enough to accommodate row
					seating and reception space with little to no table set up between ceremony and reception
				</p>

				<h4 class="packageSubtitle">Westwoods will provide:</h4>
				<ul>
					<li>Pastor to officiate</li>
					<li>
						Wedding Coordinator to host the building during the ceremony and reception as well as
						coordinate the wedding ceremony if desired
					</li>
					<li>Tech support for sound</li>
					<li>
						Building use on day of wedding up to 8 hours for set up, ceremony and reception, as well
						as 1 hour the night prior for the wedding rehearsal
					</li>
				</ul>
			</div>

			<div class="packageCard">
				<h3 class="packageTitle">Basic Workshop Package</h3>
				<p class="packagePrice">$525.00 fee, $100 damage deposit</p>
				<p class="packageDescription">The Workshop for ceremony, reception at a different venue</p>

				<h4 class="packageSubtitle">Westwoods will provide:</h4>
				<ul>
					<li>Pastor to officiate</li>
					<li>
						Wedding Coordinator to host the building during the ceremony as well as coordinate the
						wedding ceremony if desired
					</li>
					<li>
						Building use on day of wedding up to 4 hours for set up and ceremony as well as 1 hour
						the night prior for the wedding rehearsal
					</li>
					<li>*No sound with this option</li>
				</ul>
			</div>
		</div>

		<div class="contactSection">
			<p>
				Contact Joe at <a href="mailto:joe@westwoodscc.org">Joe@WestwoodsCC.org</a> if you have any questions!
			</p>
		</div>
	</div>
</div>

<style>
	.weddingContent {
		width: calc(100% - 3rem);
		margin: 0 auto;
		max-width: 1000px;
		grid-area: content;
	}

	.introSection,
	.paymentSection,
	.packagesSection,
	.contactSection {
		margin-bottom: 3rem;
	}

	.sectionTitle {
		font-size: clamp(1.5rem, 3vw, 2.5rem);
		color: var(--titleColor);
		margin: 2rem 0 1rem;
		text-shadow: var(--textShadow);
	}

	.packageCard {
		background: var(--cardBackground);
		border: 2px solid var(--pageCardBorder);
		border-radius: 0.5rem;
		padding: 2rem;
		margin-bottom: 2rem;
		box-shadow: 3px 3px 7px 0 rgba(0, 0, 0, 0.2);
	}

	.packageTitle {
		font-size: clamp(1.5rem, 3vw, 2rem);
		color: var(--titleColor);
		margin: 0 0 0.5rem;
		text-shadow: var(--textShadow);
	}

	.packagePrice {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--accentColor);
		margin: 0 0 1rem;
	}

	.packageDescription {
		font-size: 1.1rem;
		margin: 0 0 1.5rem;
		font-style: italic;
	}

	.packageNote {
		font-size: 1rem;
		margin: 0 0 1.5rem;
		color: var(--accentColor);
		font-weight: 500;
	}

	.packageSubtitle {
		font-size: 1.25rem;
		color: var(--titleColor);
		margin: 1.5rem 0 1rem;
		text-shadow: var(--textShadow);
	}

	.packageCard ul {
		margin: 0;
		padding-left: 1.5rem;
	}

	.packageCard li {
		margin-bottom: 0.5rem;
	}

	.contactSection {
		text-align: center;
	}

	.contactSection p {
		font-size: 1.25rem;
		margin: 0;
	}

	@media (max-width: 768px) {
		.weddingContent {
			width: calc(100% - 2rem);
		}

		.packageCard {
			padding: 1.5rem;
		}
	}
</style>
