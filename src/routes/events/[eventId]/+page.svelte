<script lang="ts">
	import { CalendarEventDetail } from '$components/calendar-events';

	let { data } = $props();
</script>

<CalendarEventDetail
	detail={data.detail}
	backHref="/events"
	backLabel="← Back to Events"
	titleSuffix="Westwoods Events"
/>
