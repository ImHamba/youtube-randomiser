<script lang="ts">
	import { sleep } from '$lib/misc/util';
	import { toastAlertStore } from '$lib/store';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	let title = '';
	let content = '';
	let color = '';
	let popup: HTMLElement;

	let colorMode = ['#db32329f', '#61d93cad', '#ede9e97c'];

	let initialised = false;
	let active = false;

	onMount(() => {
		toastAlertStore.subscribe(async (storeData) => {
			if (!initialised) initialised = true;
			else {
				active = true;
			}

			title = storeData.title;
			content = storeData.content;
			color = colorMode[storeData.colorMode];

			await sleep(3000);
			active = false;
		});
	});
</script>

{#if active}
	<div
		class="popup-alert-wrapper"
		bind:this={popup}
		style="--highlight-color: {color};"
		transition:fly={{ x: -300 }}
	>
		<span class="title text"><h4>{title}</h4></span>
		<span class="content text">{content}</span>
	</div>
{/if}

<style lang="scss">
	$width: clamp(15%, 250px, 80%);

	.popup-alert-wrapper {
		box-sizing: border-box;
		z-index: 2;

		position: fixed;
		width: $width;
		padding: 20px 30px;
		left: 10px;
		top: 20px;

		display: flex;
		flex-direction: column;

		background-color: var(--bgr-color);
		border-radius: 15px;
		border: 2px var(--highlight-color) solid;

		.title h4 {
			margin: 0px;
			margin-bottom: 10px;
			padding: 0px 5px;
			width: fit-content;
			border-bottom: 3px var(--highlight-color) solid;
		}

		.content {
			font-size: 0.9em;
		}
	}
</style>
