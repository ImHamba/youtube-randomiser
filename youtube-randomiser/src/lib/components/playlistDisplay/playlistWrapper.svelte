<script lang="ts">
</script>

<div class="playlist-display">
	<ul>
		<slot />
	</ul>
</div>

<style lang="scss">
	* {
		box-sizing: border-box;
	}
	.playlist-display {
		height: 100%;
		width: 100%;

		overflow-y: scroll;
		overflow-x: hidden;

		// border: 1px black solid;
		border-radius: 25px;
		background-color: #ffffff1a;
		box-shadow: 0px 2px 10px #70707021;
		backdrop-filter: blur(100px);

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
		margin: 23px 0px;
	}

	.playlist-display::-webkit-scrollbar-thumb {
		border-radius: 10px;
		background: #ffffff3d;
	}
</style>
