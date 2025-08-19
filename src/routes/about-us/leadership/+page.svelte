<script>
	import { LeaderCard } from '$components';

	const staff = [
		{
			name: 'Rick and Shanna Schmitz',
			title: 'Lead Pastor',
			image: 'Schmitz'
		},
		{
			name: 'Joe and Sarah Brooks',
			title: 'Executive Pastor',
			image: 'Brooks'
		},
		{
			name: 'Drew and Shelby Cole',
			title: 'Student Pastor',
			image: 'Cole'
		},
		{
			name: 'Chris and Alyssa Sanchez',
			title: 'Worship/Creative Arts Pastor',
			image: 'Sanchez'
		},
		{
			name: 'Kayla and Josh Brake',
			title: 'Kids Pastor',
			image: 'Brake'
		},
		{
			name: 'Sara and Justin Phelps',
			title: 'Church Administrator',
			image: 'Phelps'
		},
		{
			name: 'Emma and Chase Sprinkle',
			title: 'Youth Intern',
			image: 'Sprinkle'
		}
	];

	const elders = [
		{ name: 'Sue & Steve Saindon', image: 'Saindon' },
		{
			name: 'Tom and Jenni Blackman',
			image: 'Blackman'
		},
		{
			name: 'Bobby and Becky Rinehart',
			image: 'Reinhart'
		},
		{
			name: 'Ken and Courtney Maxwell',
			image: 'Maxwell'
		}
	];
</script>

<div class="contentWrapper leadership">
	<div class="pastorsWrapper">
		<h2 class="pageTitle">Our Staff</h2>
		<div class="pastors staffCardWrapper">
			{#each staff as leader}
				<LeaderCard name={leader.name} title={leader.title} image={leader.image} />
			{/each}
		</div>
	</div>
	<div class="eldersWrapper">
		<h2 class="pageTitle">Our Elders</h2>
		<div class="elders staffCardWrapper">
			{#each elders as leader}
				<LeaderCard name={leader.name} title={leader.title} image={leader.image} />
			{/each}
		</div>
	</div>
</div>

<style>
	.staffCardWrapper {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
		gap: 3rem;
		max-width: 1200px;
		margin: 0 auto;
		@media (max-width: 840px) {
			grid-template-columns: 1fr;
		}
	}
	.pageTitle {
		font-size: 2.5rem;
		margin-bottom: 2rem;
	}
</style>
