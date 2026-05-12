<script>
	import { fade } from 'svelte/transition';
	import { getTheme } from '$lib/theme.svelte.js';
	let visitForm = $derived(
		`https://westwoods.churchcenter.com/people/forms/674179?theme=${getTheme()}`
	);
</script>

<svelte:head>
	<meta
		name="description"
		content="Plan your visit to Westwoods Community Church. Find service times, directions, what to expect, and information about our kids and student programs."
	/>
</svelte:head>

<h1 class="pageTitle">Plan a Visit</h1>

<div class="contentWrapper planVisit">
	<div class="cardWrapper wrapper1">
		<div class="contentCard">
			<h2 class="contentCardTitle">Welcome</h2>
			<div class="cardContentWrapper">
				<div class="cardContent">
					<p class="contentCardText">
						We are so excited and honored that you are considering spending your Sunday morning with
						us. We know that stepping into a new church can be intimidating. Here's a little bit
						about us, hopefully this can help ease some of that anxiety.
					</p>
				</div>
			</div>
		</div>
	</div>

	<div class="cardWrapper wrapper2">
		<div class="contentCard">
			<h2 class="contentCardTitle">Service Times & Location</h2>
			<div class="cardContentWrapper">
				<div class="cardContent">
					<p class="contentCardText">
						<span class="cardAccent">Service Times:</span> Our services are every Sunday, starting at
						9:00 & 10:30am. We recommend you come a couple of minutes early.
					</p>
					<p class="contentCardText">
						<span class="cardAccent">Location:</span> Our address is 7700 W Woodard Dr., Lakewood, CO,
						at approximately Wadsworth and Morrison Road.
					</p>
				</div>
			</div>
		</div>
	</div>

	<div class="cardWrapper wrapper3">
		<div class="contentCard">
			<h2 class="contentCardTitle">What to Wear</h2>
			<div class="cardContentWrapper">
				<div class="cardContent">
					<p class="contentCardText">
						We are a casual church, so feel free to come in casual attire, jeans and t-shirt is just
						fine. If you are more comfortable dressing up, that's great too!
					</p>
				</div>
			</div>
		</div>
	</div>

	<div class="cardWrapper wrapper4">
		<div class="contentCard">
			<h2 class="contentCardTitle">What to Expect</h2>
			<div class="cardContentWrapper">
				<div class="cardContent">
					<p class="contentCardText">
						When you arrive you can enter through the doors on either the north or south side of the
						building. There will be someone there to greet you. We have coffee available feel free
						to grab a cup and make your way to the auditorium. Our services are generally 60-75
						minutes, there will be worship and Bible based teaching, usually presented by our lead
						pastor Rick Schmitz, however, we have do have a number of members of our teaching team
						and one of them may be speaking.
					</p>
				</div>
			</div>
		</div>
	</div>

	<div class="cardWrapper wrapper1">
		<div class="contentCard">
			<h2 class="contentCardTitle">What About My Kids?</h2>
			<div class="cardContentWrapper">
				<div class="cardContent">
					<p class="contentCardText">
						If you have kids, we have classes available for kids through elementary school age. We
						would love to have your kids participate in our classes, however, if they are not
						comfortable, they may also stay with you during the service. If your kids are going to
						go to one of our classes, please check them in before the service starts. They will stay
						with you during worship, then they will be dismissed to go to their classrooms. They
						will meet their teachers and the back of the auditorium on go to the classroom from
						there. <a href="/westwoods-kids">Learn more about our kids classes here.</a>
					</p>
				</div>
			</div>
		</div>
	</div>

	<div class="cardWrapper wrapper2">
		<div class="contentCard">
			<h2 class="contentCardTitle">What About My Teens?</h2>
			<div class="cardContentWrapper">
				<div class="cardContent">
					<p class="contentCardText">
						On Sunday's our teens join us in our morning service. We also offer a great program for
						students, meeting Monday nights at 6:30pm. <a href="/westwoods-students"
							>Learn more about our Students program here.</a
						>
					</p>
				</div>
			</div>
		</div>
	</div>

	<div class="cardWrapper wrapper3">
		<div class="contentCard">
			<h2 class="contentCardTitle">Tell us your coming</h2>
			<div class="cardContentWrapper">
				<div class="cardContent">
					<p class="contentCardText">
						We would love to know your coming. Although it is not necessary, we would like to get
						some information from you. If you are willing, please click the link and fill out the
						form to let us know your coming or ask any questions you may still have.
					</p>
					<div class="buttonWrapper">
						<a href={visitForm} data-open-in-church-center-modal="true" class="button">
							Plan a Visit Form
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.buttonWrapper {
		margin-top: 1.5rem;
		text-align: center;
	}

	.button {
		display: inline-block;
		background: var(--accentColor);
		color: var(--textColor);
		padding: 0.75rem 1.5rem;
		border-radius: 0.25rem;
		font-size: 1.25rem;
		font-weight: 600;
		text-decoration: none;
		transition: all 0.3s ease-in-out;
	}

	.button:hover {
		background: var(--accentColor);
		color: var(--backgroundColor);
		text-decoration: none;
	}
</style>
