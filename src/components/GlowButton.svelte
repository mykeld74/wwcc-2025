<script>
	let { text } = $props();
</script>

<button class="glowButton">
	<p class="buttonText">{text}</p>
</button>

<style>
	.glowButton {
		width: 100%;
		padding: 15px 40px;
		border: none;
		outline: none;
		color: var(--glowButtonTextColor);
		border: 4px solid var(--contrastColor);
		cursor: pointer;
		position: relative;
		z-index: 0;
		border-radius: 14px;
	}
	p {
		margin: 0;
	}
	.glowButton::after {
		content: '';
		z-index: -1;
		position: absolute;
		width: 100%;
		height: 100%;
		background-color: var(--glowButtonBackground);
		left: 0;
		top: 0;
		border-radius: 10px;
	}
	/* glow */
	.glowButton::before {
		content: '';
		background: linear-gradient(
			45deg,
			#ff0000,
			#ff7300,
			#fffb00,
			#48ff00,
			#00ffd5,
			#002bff,
			#ff00c8,
			#ff0000
		);
		position: absolute;
		top: -2px;
		left: -2px;
		background-size: 600%;
		z-index: -1;
		width: calc(100% + 4px);
		height: calc(100% + 4px);
		filter: blur(8px);
		animation: glowing 20s linear infinite;
		transition: opacity 0.3s ease-in-out;
		border-radius: 10px;
		opacity: 0;
	}

	@keyframes glowing {
		0% {
			background-position: 0 0;
		}
		50% {
			background-position: 400% 0;
		}
		100% {
			background-position: 0 0;
		}
	}

	/* hover */
	.glowButton:hover::before {
		opacity: 1;
	}

	/* .glowButton:active:after {
		background: transparent;
	} */

	/* .glowButton:active {
		color: #000;
		font-weight: bold;
	} */
</style>
