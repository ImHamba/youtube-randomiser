<script lang="ts">
	import PlaylistDisplay from '$lib/components/playlistDisplay.svelte';
	import Youtube from '$lib/components/youtube.svelte';
	import { videoIDStore } from '$lib/store';
	import { createEventDispatcher, onMount } from 'svelte';

	let videoList: IVideoData[] = [];
	let videoIndex: number = 0;
	let currentVideoID: string = 'xhYaV6iXWU0';

	let player = null;

	videoIDStore.subscribe((videoIDs) => {
		videoList = videoIDs;
	});

	// shuffle list randomly
	const shuffleArray = <T>(array: Array<T>) => {
		array.sort(() => Math.random() - 0.5);
	};
	shuffleArray(videoList);

	currentVideoID = videoList[videoIndex]?.videoID || '';

	const startNextVideo = () => {
		videoIndex += 1;
		currentVideoID = videoList[videoIndex]?.videoID || '';
		player.loadVideoById(currentVideoID);
	};

	onMount(() => {
		const endedInterval = setInterval(() => {
			// if the player exists (i.e. has loaded), check if the state is 0 for video has ended.
			// if so, load the next video
			console.log('Checking if video ended');
			if (player && player.getPlayerState() == 0) {
				console.log('Going to next video');
				startNextVideo();
			}
		}, 1000);

		return () => {
			clearInterval(endedInterval);
		};
	});
</script>

<div class="wrapper">
	<div class="playlist-display-wrapper">
		<PlaylistDisplay {videoList} />
	</div>

	<div class="player-wrapper">
		<Youtube initialVideoId={currentVideoID} bind:player />
	</div>

	<button on:click={startNextVideo}> Next! </button>
</div>

<style lang="scss">
	.wrapper {
		height: 100%;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.playlist-display-wrapper {
		border: 1px black solid;
		height: 60%;
		width: 30%;
		overflow-y: auto;
		overflow-x: hidden;
	}

	.player-wrapper {
		border: 1px black solid;
		width: 60%;
		height: 60%;
		display: flex;
		align-items: center;
		justify-content: center;

		background-color: grey;
	}
	.player-frame {
		aspect-ratio: 16 / 9;
	}
	.fill-width {
		width: 100%;
	}

	.fill-height {
		height: 100%;
	}
</style>
