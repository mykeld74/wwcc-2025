<script>
	import { ScrollingHero } from '$components';
</script>

<svelte:head>
	<meta
		name="description"
		content="Join the Westwoods Men’s Group every Saturday at 7am. Build friendships, grow in God’s Word, and find support and encouragement in a welcoming community of men."
	/>
</svelte:head>

<div class="wwMenHero">
	<ScrollingHero currentPage="men" />
</div>

<div class="wwMen">
	<h1 class="pageTitle">Welcome to Westwoods Men</h1>
	<p class="pageDescription">
		Join us every Saturday morning at 7:00am for our Men’s Group, a welcoming space where men gather
		to grow together in God’s Word. Our purpose is to build up and encourage one another, providing
		a place for honest conversation, support, and spiritual growth. Whether you’re new to faith or
		have been walking with Jesus for years, you’ll find friendship, accountability, and practical
		wisdom for life’s challenges. Come as you are, grab a cup of coffee, and start your weekend with
		brothers who want to see you thrive!
	</p>
	<p class="pageDescription">
		If you have any questions, please contact us at <a href="mailto:westwoodsmen@gmail.com"
			>westwoodsmen@gmail.com</a
		>.
	</p>
	<hr />
	<ul class="dateAndTime">
		<li><strong>When:</strong> Saturday mornings at 7:00am</li>
		<li><strong>Where:</strong> Westwoods Community Church - Coffee Shop</li>
		<li><strong>Who:</strong> All men are welcome!</li>
	</ul>
</div>

<style>
	.wwMenHero {
		grid-area: header / full;
	}
	.wwMen {
		width: calc(100% - 3rem);
		max-width: 1200px;
		margin: 0 auto;
		grid-area: content;
	}
</style>
