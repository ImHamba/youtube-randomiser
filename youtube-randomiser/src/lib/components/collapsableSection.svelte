<script lang="ts">
	import { fade } from "svelte/transition";

	export let expanded: boolean;
</script>

<div class="header">
	<slot name="header" />
	<button
		on:click={() => {
			expanded = !expanded;
		}}>collapse</button
	>
</div>

<div class:hidden={!expanded}>
	<slot name="items" />
</div>

<style lang="scss">
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-right: 10px;
	}

	.hidden {
		display: none;
	}

	button {
		height: 50%;
		width: 100px;
	}
</style>
