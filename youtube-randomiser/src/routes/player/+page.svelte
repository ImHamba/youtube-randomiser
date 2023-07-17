<script lang="ts">
	import MixDisplay from '$lib/components/playlistDisplay/mixDisplay.svelte';
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

	const arrayMove = <T>(arr: Array<T>, fromIndex: number, toIndex: number) => {
		let newArr: Array<T> = [];
		if (fromIndex < toIndex) {
			newArr = newArr.concat(
				arr.slice(0, fromIndex),
				arr.slice(fromIndex + 1, toIndex),
				[arr[fromIndex]],
				arr.slice(toIndex)
			);
		} else {
			newArr = newArr.concat(
				arr.slice(0, toIndex),
				[arr[fromIndex]],
				arr.slice(toIndex, fromIndex),
				arr.slice(fromIndex + 1)
			);
		}
		return newArr;
	};

	let swapToIndex: number = -1;
	let mixDisplay: MixDisplay;
	$: {
		// bring the swapped to video to one after the current video and change to it
		if (swapToIndex >= 0 && swapToIndex != videoIndex) {
			videoList = arrayMove(videoList, swapToIndex, videoIndex + 1);
			videoList = videoList;
			if (swapToIndex > videoIndex) {
				videoIndex += 1;
			}
			loadVideo();
			mixDisplay.scrollToListIndex(videoIndex);

			swapToIndex = -1;
		}
	}

	let searchTerm = '';

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
		mixDisplay.scrollToListIndex(videoIndex);
	};

	const loadPreviousVideo = () => {
		videoIndex = Math.max(0, videoIndex - 1);
		loadVideo();
		mixDisplay.scrollToListIndex(videoIndex);
	};

	const shuffleVideos = () => {
		videoList = shuffleArray(videoList);
		videoIndex = 0;
		loadVideo();
		mixDisplay.scrollToListIndex(videoIndex);
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
			<button on:click={loadPreviousVideo}>
				<i class="fa-solid fa-backward-step" />
			</button>
			<button on:click={unpauseVideo} class:hidden={!videoPaused}>
				<i class="fa-solid fa-play" />
			</button>
			<button class="pause-btn" on:click={pauseVideo} class:hidden={videoPaused}>
				<i class="fa-solid fa-pause" />
			</button>
			<button on:click={loadNextVideo}>
				<i class="fa-solid fa-forward-step" />
			</button>
			<button on:click={shuffleVideos}>
				<i class="fa-solid fa-shuffle" />
			</button>
			<button on:click={toggleLoopVideo} class:inactive={!loopVideo}>
				<i class="fa-solid fa-repeat" />
			</button>
		</div>
		<div class="btm-panel">
			<div class="search-bar-wrapper">
				<div class="search-bar">
					<i class="fa-solid fa-magnifying-glass" />
					<input bind:value={searchTerm} />
				</div>
			</div>
			<div class="playlist-display-wrapper">
				<MixDisplay
					{videoList}
					bind:activeVideoIndex={videoIndex}
					bind:swapToIndex
					bind:this={mixDisplay}
					bind:searchTerm
				/>
			</div>
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

		button {
			// min-width: 0;
			height: 50%;
			aspect-ratio: 1;
			border-radius: 50%;
			// border: 1px red solid;
			font-size: 2em;
			margin: 0px clamp(1px, 5px, 10px);
			padding: 0px;

			// display: flex;
			// align-items: center;
		}

		.pause-btn {
			// font-size: 2.1em;
		}
	}

	.btm-panel {
		@import './src/app.scss';
		@include glass-background;
		overflow: hidden;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;

		border-radius: 5px 5px 25px 25px;
		height: 100%;
	}

	.search-bar-wrapper {
		padding: 15px;
		.search-bar {
			border-radius: 100px;
			width: 100%;
			// border: 1px red solid;
			padding: 5px 15px;
			display: flex;
			box-sizing: border-box;
			align-items: center;
			background: #00000010;

			i {
				margin-right: 5px;
				margin-top: 1px;
			}

			input {
				background: none;
				border: none;
				padding: 5px;
				outline: none;
				width: 100%;
				font-size: 0.9em;
			}
		}

		.search-bar:focus-within {
			background: #00000033;
		}
	}

	.playlist-display-wrapper {
		min-height: 0;
		height: 100%;
		width: 100%;

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
