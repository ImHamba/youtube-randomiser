<script lang="ts">
	import PlaylistDisplay from '$lib/components/playlistDisplay/playlistDisplay.svelte';
	import Youtube from '$lib/components/youtube.svelte';
	import { videoIDStore } from '$lib/store';
	import { createEventDispatcher, onMount } from 'svelte';

	let videoList: IVideoData[] = [];
	let videoIndex: number = 0;
	let currentVideoID: string = 'xhYaV6iXWU0';

	let player: any = null;

	videoIDStore.subscribe((videoIDs) => {
		videoList = [...videoIDs];
	});

	// shuffle list randomly
	const shuffleArray = <T>(array: Array<T>) => {
		let newArr = [...array];
		newArr.sort(() => Math.random() - 0.5);
		return newArr;
	};
	videoList = shuffleArray(videoList);

	currentVideoID = videoList[videoIndex]?.videoID || '';

	onMount(() => {
		const endedInterval = setInterval(() => {
			// if the player exists (i.e. has loaded), check if the state is 0 for video has ended.
			// if so, load the next video
			// console.log('Checking if video ended');
			if (player && player.getPlayerState() == 0) {
				if (loopVideo) {
					loadVideo();
				} else {
					// console.log('Going to next video');
					loadNextVideo();
				}
			}
		}, 500);

		const videoPausedInterval = setInterval(() => {
			videoPaused = isVideoPaused();
		}, 10);

		return () => {
			clearInterval(endedInterval);
			clearInterval(videoPausedInterval);
		};
	});

	const loadVideo = () => {
		currentVideoID = videoList[videoIndex]?.videoID || '';
		player.loadVideoById(currentVideoID);
	};

	const loadNextVideo = () => {
		videoIndex = Math.min(videoList.length - 1, videoIndex + 1);
		loadVideo();
	};

	const loadPreviousVideo = () => {
		videoIndex = Math.max(0, videoIndex - 1);
		loadVideo();
	};

	const shuffleVideos = () => {
		videoIDStore.set(shuffleArray(videoList));
		videoIndex = 0;
		loadVideo();
	};

	let videoPaused = false;

	const pauseVideo = () => {
		player.pauseVideo();
		videoPaused = isVideoPaused();
	};

	const unpauseVideo = () => {
		player.playVideo();
		videoPaused = isVideoPaused();
	};

	const isVideoPaused = () => {
		if (player && player.getPlayerState) {
			return player.getPlayerState() == 2;
		}
		return false;
	};

	let loopVideo = false;
	const toggleLoopVideo = () => {
		loopVideo = !loopVideo;
	};
</script>

<div class="wrapper">
	<div class="left-wrapper">
		<div class="controls-container">
			<button on:click={loadPreviousVideo}>⬅️</button>
			<button on:click={unpauseVideo} class:hidden={!videoPaused}>▶️</button>
			<button on:click={pauseVideo} class:hidden={videoPaused}>⏸️</button>
			<button on:click={loadNextVideo}>➡️</button>
			<button on:click={shuffleVideos}>🔀</button>
			<button on:click={toggleLoopVideo} class:inactive={!loopVideo}>🔁</button>
		</div>
		<div class="playlist-display-wrapper">
			<PlaylistDisplay {videoList} />
		</div>
	</div>

	<div class="player-wrapper">
		<Youtube initialVideoId={currentVideoID} bind:player />
	</div>
</div>

<style lang="scss">
	.wrapper {
		height: calc(100% - var(--navbar-height));
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
	}

	.left-wrapper {
		display: flex;
		flex-direction: column;
		height: 80%;
		width: 30%;
		margin: 0px 20px;
	}

	.controls-container {
		height: 80px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.controls-container button {
		height: 100%;
		aspect-ratio: 1;
		border-radius: 50%;
		// border: 1px red solid;
		margin: 5px;
		font-size: 23px;
	}

	.playlist-display-wrapper {
		min-height: 0;
		height: 100%;
		width: 100%;
	}

	.player-wrapper {
		// border: 1px black solid;
		width: 60%;
		height: 80%;
		display: flex;
		align-items: center;
		justify-content: center;

		border-radius: 25px;
		overflow: hidden;
	}

	.hidden {
		display: none;
	}

	.inactive {
		opacity: 0.3;
	}
</style>
