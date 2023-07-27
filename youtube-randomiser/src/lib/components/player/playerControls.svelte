<script lang="ts">
	import { getCurrentVideoId, loadVideo } from '$lib/misc/playerUtil';
	import { appendDemoParam, shuffleArray } from '$lib/misc/util';
	import { onMount } from 'svelte';
	import type MixDisplay from '../playlistDisplay/mixDisplay.svelte';
	import ProgressSlider from './progressSlider.svelte';

	export let player: any;
	export let videoList: IVideoData[];
	export let videoIndex: number;
	export let mixDisplay: MixDisplay;

	export let showDemo: boolean;

	onMount(() => {
		const endedInterval = setInterval(() => {
			// if the player exists (i.e. has loaded), check if the state is 0 for video has ended.
			// if so, load the next video
			// console.log('Checking if video ended');
			if (player && player.getPlayerState() == 0) {
				if (loopVideo) {
					loadVideo(player, getCurrentVideoId(videoList, videoIndex));
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

	const loadNextVideo = () => {
		videoIndex = Math.min(videoList.length - 1, videoIndex + 1);
		loadVideo(player, getCurrentVideoId(videoList, videoIndex));
		mixDisplay.scrollToListIndex(videoIndex);
	};

	const loadPreviousVideo = () => {
		videoIndex = Math.max(0, videoIndex - 1);
		loadVideo(player, getCurrentVideoId(videoList, videoIndex));
		mixDisplay.scrollToListIndex(videoIndex);
	};

	const shuffleVideos = () => {
		videoList = shuffleArray(videoList);
		videoIndex = 0;
		loadVideo(player, getCurrentVideoId(videoList, videoIndex));
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

<div class="controls-container">
	<div class="btn-container">
		<div class="btn-container-row">
			<button class="hover-highlight" on:click={loadPreviousVideo} title="Previous video">
				<i class="fa-solid fa-backward-step" />
			</button>
			<button
				class="play-btn hover-highlight"
				on:click={unpauseVideo}
				class:hidden={!videoPaused}
				title="Play"
			>
				<i class="fa-solid fa-play" />
			</button>
			<button
				class="hover-highlight"
				on:click={pauseVideo}
				class:hidden={videoPaused}
				title="Pause"
			>
				<i class="fa-solid fa-pause" />
			</button>
			<button class="hover-highlight" on:click={loadNextVideo} title="Next video">
				<i class="fa-solid fa-forward-step" />
			</button>
		</div>

		<div class="btn-container-row">
			<button class="hover-highlight" on:click={shuffleVideos} title="Reshuffle">
				<i class="fa-solid fa-shuffle" />
			</button>
			<button
				class="hover-highlight"
				on:click={toggleLoopVideo}
				class:inactive={!loopVideo}
				title="Loop video"
			>
				<i class="fa-solid fa-repeat" />
			</button>
			<button class="hover-highlight" title="Edit mix">
				<a href={appendDemoParam('./', showDemo)}><i class="fa-solid fa-plus" /></a>
			</button>
		</div>
	</div>

	<div class="progress-slider-wrapper">
		<ProgressSlider {player} />
	</div>
</div>

<style lang="scss">
	.controls-container {
		@import './src/app.scss';
		@include glass-background;

		width: 100%;

		display: flex;
		flex-direction: column;
		// gap: 15px;
		justify-content: center;
		align-items: center;
		border-radius: 25px 25px 5px 5px;
		margin-bottom: 5px;

		padding: 10px 30px;
		box-sizing: border-box;

		.btn-container {
			width: 100%;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			align-items: center;
			justify-content: center;

			.btn-container-row {
				// width: 100%;
				display: flex;
				flex-wrap: wrap;
				justify-content: center;
				align-items: center;
				gap: 10px;

				button {
					// min-width: 0;
					height: 50px;
					aspect-ratio: 1;
					border-radius: 50%;
					// border: 1px red solid;
					font-size: 35px;
				}

				.play-btn {
					i {
						padding-left: 3px;
					}
				}
			}
		}

		.progress-slider-wrapper {
			margin-top: 15px;
			width: 100%;
		}
	}

	@media screen and (max-width: 900px) {
		.controls-container {
			padding: 10px 10px 0px;

			.btn-container {
				flex-wrap: nowrap;

				.btn-container-row {
					flex-wrap: nowrap;

					button {
						// min-width: 0;
						height: 30px;
						font-size: 25px;
					}
				}
			}
		}
	}

	.hidden {
		display: none;
	}

	.inactive {
		opacity: 0.3;
	}
</style>
