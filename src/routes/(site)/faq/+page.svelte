<svelte:head>
	<title>FAQ | Westwoods Community Church</title>
	<meta
		name="description"
		content="Frequently asked questions about Westwoods Community Church: service times, location, kids programs, what to wear, volunteering, and how to contact us."
	/>
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "FAQPage",
			"mainEntity": [
				{
					"@type": "Question",
					"name": "What time are your Sunday services?",
					"acceptedAnswer": {
						"@type": "Answer",
						"text": "Our Sunday services start at 9:00 & 10:30am. We recommend arriving a few minutes early to grab a cup of coffee or water and get settled."
					 in}
				},
				{
					"@type": "Question",
					"name": "Where is Westwoods Community Church located?",
					"acceptedAnswer": {
						"@type": "Answer",
						"text": "We are located at 7700 W Woodard Dr., Lakewood, CO 80227, near Wadsworth and Morrison Road."
					}
				},
				{
					"@type": "Question",
					"name": "Do you have programs for children and students?",
					"acceptedAnswer": {
						"@type": "Answer",
						"text": "Yes! We offer Westwoods Kids for children through elementary age and Westwoods Students for 6th-12th graders."
					}
				},
				{
					"@type": "Question",
					"name": "What should I wear to church?",
					"acceptedAnswer": {
						"@type": "Answer",
						"text": "Come as you are! Most people dress casually, but you are welcome to dress up if you prefer."
					}
				},
				{
					"@type": "Question",
					"name": "How can I get involved or volunteer?",
					"acceptedAnswer": {
						"@type": "Answer",
						"text": "We have many opportunities to serve! Visit our Volunteer page or contact us to learn more about getting involved."
					}
				},
				{
					"@type": "Question",
					"name": "How do I contact the church?",
					"acceptedAnswer": {
						"@type": "Answer",
						"text": "You can reach us through our Contact page, by email at info@westwoodscc.org, or by phone at 303-279-1616."
					}
				}
			]
		}
	</script>
</svelte:head>

<h1 class="pageTitle">Frequently Asked Questions</h1>
<div class="faqContainer">
	<div class="faqItem">
		<h2>What time are your Sunday services?</h2>
		<p>
			Our Sunday services start at 9:00 & 10:30am. We recommend arriving a few minutes early to grab
			a cup of coffee or water and get settled in.
		</p>
	</div>
	<div class="faqItem">
		<h2>Where is Westwoods Community Church located?</h2>
		<p>
			We are located at 7700 W Woodard Dr., Lakewood, CO 80227, near Wadsworth and Morrison Road.
		</p>
	</div>
	<div class="faqItem">
		<h2>Do you have programs for children and students?</h2>
		<p>
			Yes! We offer <a href="/westwoods-kids">Westwoods Kids</a> for children through elementary age
			and <a href="/westwoods-students">Westwoods Students</a> for 6th-12th graders.
		</p>
	</div>
	<div class="faqItem">
		<h2>What should I wear to church?</h2>
		<p>
			Come as you are! Most people dress casually, but you are welcome to dress up if you prefer.
		</p>
	</div>
	<div class="faqItem">
		<h2>How can I get involved or volunteer?</h2>
		<p>
			We have many opportunities to serve! Visit our <a href="/about-us/volunteer-opportunities"
				>Volunteer page</a
			>
			or <a href="/contact-us">contact us</a> to learn more about getting involved.
		</p>
	</div>
	<div class="faqItem">
		<h2>How do I contact the church?</h2>
		<p>
			You can reach us through our <a href="/contact-us">Contact page</a>, by email at
			<a href="mailto:info@westwoodscc.org">info@westwoodscc.org</a>, or by phone at
			<a href="tel:303-279-1616">303-279-1616</a>.
		</p>
	</div>
</div>

<style>
	.faqContainer {
		max-width: 1100px;
		margin: 3rem auto 6rem;
		padding: 2rem 1rem;
		grid-area: content;
	}
	.faqItem + .faqItem {
		margin-top: 2rem;
		border-top: 1px solid var(--cardBorder);
		padding-top: 2rem;
	}
	.faqItem {
		h2 {
			color: var(--titleColor);
		}
	}
</style>
