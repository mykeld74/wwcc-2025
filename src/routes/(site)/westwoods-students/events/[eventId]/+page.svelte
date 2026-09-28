<script lang="ts">
	import { CalendarEventDetail } from '$components/calendar-events';

	let { data } = $props();
</script>

<CalendarEventDetail
	detail={data.detail}
	backHref="/westwoods-students"
	backLabel="← Back to Westwoods Students"
	titleSuffix="Westwoods Students"
/>
