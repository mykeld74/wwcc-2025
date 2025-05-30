<script>
	import { ScrollingHero } from '$components';
</script>

<div class="wwStudentHero">
	<ScrollingHero currentPage="students" />
</div>

<div class="wwStudentsContainer">
	<h1 class="pageTitle">Welcome to Westwoods Students</h1>
	<p class="pageDescription">
		Westwoods Students is a gathering of 6th-12th grade students with the purpose of fostering space
		for students to be known, noticed and encouraged in the journey of life. You belong before you
		believe and we seek to offer the environment where students can be themselves by connecting
		amazing adult leaders to come alongside each student over these formative years. We have weekly
		gatherings during the school year on Monday Evenings at 6:30 pm for fun, connection, missional
		communities and to encourage the students in the way of Jesus in their lives with friends,
		family, at school, at home and ultimately who they are becoming.
	</p>

	<p class="pageDescription">
		We would love to get to know your students and have them join this community of fellow students
		and leaders.
	</p>

	<p class="pageDescription">
		<a href="mailto:drew@westwoodscc.org">drew@westwoodscc.org</a><br />
		<a href="tel:303-279-1616" class="phoneNumber">303-279-1616 ext. 2</a>
	</p>

	<iframe
		src="https://calendar.google.com/calendar/embed?src=studentswwcc%40gmail.com&amp;ctz=America%2FDenver"
		frameBorder="0"
		scrolling="no"
		class="studentCalendar"
		title="Student Calendar"
	></iframe>
</div>

<style>
	.wwStudentHero {
		grid-area: header / full;
	}
	.wwStudentsContainer {
		width: calc(100% - 3rem);
		max-width: 1200px;
		margin: 0 auto;
		grid-area: content;
	}
	.studentCalendar {
		width: 100%;
		aspect-ratio: 16 / 9;
	}
</style>
