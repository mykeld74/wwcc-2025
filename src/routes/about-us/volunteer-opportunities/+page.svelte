<script>
	import Opportunities from '$data/volunteerOpportunies.js';
	import { Card } from '$components';
</script>

<div class="contentWrapper">
	<h1>Volunteer Opportunities</h1>
	<div class="volunteerOpportunitiesWrapper">
		{#each Opportunities as opportunity}
			<Card cardContent={opportunity} />
		{/each}
	</div>
</div>

<style>
	.volunteerOpportunitiesWrapper {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
		gap: 20px;
	}
</style>
