<script lang="ts">
	export let overflowScroll = true;
</script>

<div class="playlist-display" style:overflow-y={overflowScroll ? 'scroll' : 'auto'}>
	<ul>
		<slot />
	</ul>
</div>

<style lang="scss">
	* {
		box-sizing: border-box;
	}

	.playlist-display {
		@import './src/app.scss';
		@include glass-background;

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
		margin-top: var(--margin-top);
		margin-bottom: var(--margin-btm);
	}

	.playlist-display::-webkit-scrollbar-thumb {
		border-radius: 10px;
		background: #ffffff3d;
	}
</style>
