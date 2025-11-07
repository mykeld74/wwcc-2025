<div class="alcoholPolicyWrapper">
	<h2>Westwoods Alcohol Policy</h2>

	<p>
		Since many people like to have adult beverages for their guests, we are happy to provide this
		option in addition to your rental package. We do, however, reserve the right to regulate the
		alcohol served at your event as part of our duty to protect both the church Westwoods and your
		guests. We currently only allow beer and wine to be served. Please familiarize yourself with
		these additional standards for your reception, and understand that there are to be no
		exceptions.
	</p>

	<p>
		To serve beer and wine at your event you must have a Westwoods' approved bartender. Your event
		coordinator will secure someone to work your reception for the times you specify.
	</p>

	<div class="feeTable">
		<h3>Bartender Fees</h3>
		<ul>
			<li>$30/hour for cash bar</li>
			<li>$55/hour for open bar</li>
			<li>$75/hour for open bar without a tip jar</li>
		</ul>
		<p class="feeNote">There is a two hour minimum for the bartender.</p>
	</div>

	<p>
		You are responsible to acquire all alcohol, mixers, garnish, ice and cups. The bartender that is
		scheduled to work the event can help you with suggestions for the bar options.
	</p>

	<p>
		Your bartender will ensure that no minors are served at your event and no one is over served to
		drunkenness.
	</p>
</div>

<style>
	.alcoholPolicyWrapper {
		display: grid;
		gap: 1.5rem;
	}

	h2 {
		font-size: clamp(2rem, 3vw, 2.75rem);
		font-weight: 700;
		text-decoration: underline;
		margin: 0;
	}

	h3 {
		font-size: clamp(1.5rem, 2.5vw, 2rem);
		font-weight: 600;
		margin: 0 0 0.5rem;
	}

	p {
		margin: 0;
		line-height: 1.6;
	}

	.feeTable {
		background: color-mix(in oklch, var(--cardBackground) 85%, transparent);
		border-radius: 0.75rem;
		padding: 1.5rem;
		border: 1px solid var(--pageCardBorder);
	}

	.feeTable ul {
		margin: 0 0 1rem;
		padding-left: 1.25rem;
	}

	.feeTable li {
		margin-bottom: 0.5rem;
	}

	.feeTable li:last-child {
		margin-bottom: 0;
	}

	.feeNote {
		font-style: italic;
		color: var(--accentColor);
	}

	@media (max-width: 600px) {
		.alcoholPolicyWrapper {
			gap: 1rem;
		}

		.feeTable {
			padding: 1.25rem;
		}
	}
</style>

