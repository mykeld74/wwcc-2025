<script lang="ts">
	import IMask from 'imask';
	import FieldError from './FieldError.svelte';

	const phoneMask = { mask: '(000) 000-0000' };
	const phonePattern = /^\(\d{3}\) \d{3}-\d{4}$/;

	interface Props {
		id: string;
		name?: string;
		value?: string;
		required?: boolean;
		autocomplete?: string;
		oninput?: () => void;
	}

	let {
		id,
		name = 'phone',
		value = $bindable(''),
		required = false,
		autocomplete = 'tel',
		oninput
	}: Props = $props();

	let error = $state('');

	export function validate() {
		const phone = value?.trim() ?? '';

		if (!phone) {
			error = required ? 'Please provide a valid phone number' : '';
			return !required;
		}

		const isValid = phonePattern.test(phone);
		error = isValid ? '' : 'Please provide a valid phone number';
		return isValid;
	}

	function handleBlur() {
		validate();
	}

	function handleInput() {
		if (error) {
			error = '';
		}
		oninput?.();
	}
</script>

<input
	use:IMask={phoneMask}
	type="tel"
	{id}
	{name}
	{required}
	inputmode="tel"
	{autocomplete}
	bind:value
	onblur={handleBlur}
	oninput={handleInput}
	aria-invalid={error ? 'true' : undefined}
	aria-describedby={error ? `${id}-error` : undefined}
/>
<FieldError id="{id}-error" message={error} />

<style>
	input {
		width: 100%;
		padding: 0.75rem 1rem;
		border: 1px solid var(--cardBorder);
		border-radius: 0.5rem;
		font-size: 1rem;
		font-family: inherit;
		background: var(--backgroundColor);
		color: var(--textColor);
		box-sizing: border-box;
		transition: border-color 0.3s ease;
	}

	input:focus {
		outline: none;
		border-color: var(--primaryColor);
	}
</style>
