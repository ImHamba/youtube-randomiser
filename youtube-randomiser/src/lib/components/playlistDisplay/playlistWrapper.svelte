<script lang="ts">
	export let permanentScrollTrack = true;
	export let heading: string | null = null;
</script>

<div class="wrapper">
	{#if heading}
		<div class="heading"><h4>{heading}</h4></div>
	{/if}
	<div class="playlist-display" style:overflow-y={permanentScrollTrack ? 'scroll' : 'auto'}>
		<ul>
			<slot />
		</ul>
	</div>
	<div class="btm-bar">
		<slot name="bottomBar" />
	</div>
</div>

<style lang="scss">
	* {
		box-sizing: border-box;
	}

	.wrapper {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		height: 100%;
	}

	.heading {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 20px 0px 10px;
		text-align: center;

		h4 {
			font-size: 1.3em;
			margin: 0;
			// width: 80%;
			// padding-bottom: 10px;
			// border-bottom: 1px #00000020 solid;
		}
	}

	.playlist-display {
		height: 100%;
		width: 100%;

		overflow-x: hidden;
		scroll-behavior: smooth;

		// border: 1px black solid;
		// border-radius: 25px;

		ul {
			list-style-type: none;
			padding: 0;
			margin: 0;
		}
	}

	.playlist-display::-webkit-scrollbar {
		width: 8px;
	}

	.playlist-display::-webkit-scrollbar-track {
		// background: #dddddd;
		background: none;
		border-radius: 10px;
		margin-top: var(--scrollbar-margin-top);
		margin-bottom: var(--scrollbar-margin-btm);
	}

	.playlist-display::-webkit-scrollbar-thumb {
		border-radius: 10px;
		background: #ffffff3d;
	}

	.btm-bar {
		padding: 5px;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
