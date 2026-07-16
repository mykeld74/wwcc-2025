<script lang="ts">
	import { CalendarEventDetail } from '$components/calendar-events';

	let { data } = $props();
</script>

<CalendarEventDetail
	detail={data.detail}
	backHref="/women-of-westwoods/wow-connect"
	backLabel="← Back to WOW Connect"
	titleSuffix="WOW Connect"
/>
