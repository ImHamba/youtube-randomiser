<script lang="ts">
	import { clickOutside } from '$lib/misc/clickOutside';

	export let visible: boolean;

	const closeModal = () => {
		visible = false;
	};
</script>

{#if visible}
	<div class="backdrop" />
	<div class="modal" use:clickOutside on:click_outside={closeModal}>
		<button class="close-btn" on:click={closeModal} title="Close">
			<i class="fa-solid fa-xmark" />
		</button>
		<slot />
	</div>
{/if}

<style lang="scss">
	.backdrop {
		width: 200vw;
		height: 200vh;
		position: fixed;
		background: rgba(0, 0, 0, 0.2);

		top: -100vh;
		left: -100vw;
	}

	.modal {
		@import './src/app.scss';
		@include glass-background;
		position: absolute;
		border-radius: 25px;
		width: 100%;
		height: 100%;
		text-align: center;

		overflow: hidden;
	}

	.close-btn {
		position: absolute;
		width: 3.5vh;
		height: 3.5vh;
		top: 0;
		right: 0;
		margin: 10px;

		i {
			font-size: 25px;
			color: #00000050;
		}
	}
</style>
