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
		}
	];

	const elders = [
		{ name: 'Sue & Steve Saindon', image: 'Saindon' },
		{
			name: 'Tom and Jenni Blackman',
			image: 'Blackman'
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
		grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
		gap: 3rem;
		max-width: 1200px;
		margin: 0 auto;
	}
	.pageTitle {
		font-size: 2.5rem;
		margin-bottom: 2rem;
	}
</style>
