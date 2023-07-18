<script lang="ts">
	import { getVideoDuration, getCurrentVideoTime } from '$lib/misc/playerUtil';
	import { onMount } from 'svelte';

	export let player: any;

	let videoTime: number = 0;
	let videoDuration: number = 1;

	let videoTimeMin: string;
	let videoDurationMin: string;

	$: videoTimeMin = secToMin(videoTime);
	$: videoDurationMin = secToMin(videoDuration);

	$: console.log(videoTime);

	const secToMin = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const extraSeconds = seconds % 60;
		return `${minutes}:${Math.round(extraSeconds) < 10 ? '0' : ''}${Math.round(extraSeconds)}`;
	};

	onMount(() => {
		const playerTimeInterval = setInterval(() => {
			videoTime = getCurrentVideoTime(player) || videoTime;
			videoDuration = getVideoDuration(player) || videoDuration;
		}, 100);

		return () => {
			clearInterval(playerTimeInterval);
		};
	});
</script>

<div class="slider-wrapper">
	<div class="time">{videoTimeMin}</div>
	<input
		type="range"
		min="0"
		max={videoDuration}
		bind:value={videoTime}
		class="slider"
		id="myRange"
		step="0.01"
	/>
	<div class="time">{videoDurationMin}</div>
</div>

<style lang="scss">
	.slider-wrapper {
		width: 100%;
		// height: 50px;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.time {
			width: 4em;
			text-align: center;
			// border: 1px red solid;
		}

		.slider {
			width: 100%;
			-webkit-appearance: none;
			cursor: pointer;
			appearance: none;
			height: 5px;
			border: none;
			outline: none;
			margin: 0px 10px;
			border-radius: 50px;

			background: linear-gradient(to right, #ffffff30, #ffffff50, #ffffff30);
		}

		.slider::-webkit-slider-thumb {
			-webkit-appearance: none;
			appearance: none;
			height: 15px;
			aspect-ratio: 1;
			background-color: white;
			border-radius: 50px;
			margin: 0px;

			box-shadow: 0px 0px 5px #ffffff40;
		}
	}
</style>
