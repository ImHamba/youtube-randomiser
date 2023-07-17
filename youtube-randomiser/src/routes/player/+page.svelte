<script lang="ts">
	import PlaylistDisplay from '$lib/components/playlistDisplay/mixDisplay.svelte';
	import Youtube from '$lib/components/youtube.svelte';
	import { groupedVideoStore } from '$lib/store';
	import { onMount } from 'svelte';

	let videoList: IVideoData[] = [];
	let videoListInitialised = false;
	let videoIndex: number = 0;
	let currentVideoID: string = '';

	let player: any = null;

	// shuffle list randomly
	const shuffleArray = <T>(array: Array<T>) => {
		let newArr = [...array];
		newArr.sort(() => Math.random() - 0.5);
		return newArr;
	};

	const extractFromGroupedVideoData = (someGroupedVideoData: IGroupedVideoData) => {
		let videoList: IVideoData[];
		videoList = someGroupedVideoData
			.map((videoData) => {
				if (videoData.isPlayList) {
					return videoData.data.videos;
				} else {
					return [videoData.data];
				}
			})
			.reduce((a, e) => {
				return [...a, ...e];
			}, []);

		return videoList;
	};

	let groupedVideoData: IGroupedVideoData = [];
	groupedVideoStore.subscribe((storeData) => {
		groupedVideoData = storeData;
		videoList = extractFromGroupedVideoData(storeData);

		// initialise
		if (!videoListInitialised) {
			videoListInitialised = true;
			videoList = shuffleArray(videoList);
			currentVideoID = videoList[0]?.videoID;

			if (videoList.length == 0) {
				window.location.href = './';
			}
		}
	});

	// $: currentVideoID = videoList[videoIndex]?.videoID || '';
	let swapToIndex: number = -1;
	$: {
		if (swapToIndex >= 0) {
			videoIndex = swapToIndex;
			loadVideo();
		}
	}

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
		player.seekTo(0);
		player.playVideo();
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
		videoList = shuffleArray(videoList);
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
			<PlaylistDisplay {videoList} bind:activeVideoIndex={videoIndex} bind:swapToIndex />
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
		@import './src/app.scss';
		@include glass-background;

		min-height: 80px;
		width: 100%;
		// overflow: hidden;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		border-radius: 25px 25px 5px 5px;
		// border: 1px red solid;
		margin-bottom: 5px;
	}

	.controls-container button {
		// min-width: 0;
		height: 50%;
		aspect-ratio: 1;
		border-radius: 50%;
		// border: 1px red solid;
		font-size: 23px;
		margin: 0px clamp(1px, 5px, 10px);
		padding: 0px;
	}

	.playlist-display-wrapper {
		min-height: 0;
		height: 100%;
		width: 100%;
		border-radius: 5px 5px 25px 25px;
		// border: 1px red solid;
		overflow: hidden;
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
