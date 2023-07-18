<script lang="ts">
	import { fly } from 'svelte/transition';

	export let expanded: boolean;
</script>

<div class="header">
	<slot name="header" />
	<button
		on:click={() => {
			expanded = !expanded;
		}}
	>
		<i class="fa-solid fa-angle-down" class:rotated={expanded} />
	</button>
</div>
{#if expanded}
	<div transition:fly={{ y: -20 }}>
		<slot name="items" />
	</div>
{/if}

<style lang="scss">
	.header {
		display: flex;
		// justify-content: space-between;
		align-items: center;
		padding-right: 10px;
	}

	button {
		height: 50%;
		// width: 100px;
	}

	i {
		transition: transform 500ms ease;
		font-size: 1.7em;
	}
	.rotated {
		transform: rotateX(180deg) translateY(3px);
	}
</style>
