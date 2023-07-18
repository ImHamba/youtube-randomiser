<script lang="ts">
	import PlayerControls from '$lib/components/player/playerControls.svelte';
	import Youtube from '$lib/components/player/youtube.svelte';
	import MixDisplay from '$lib/components/playlistDisplay/mixDisplay.svelte';
	import { shuffleArray } from '$lib/misc/util';
	import { groupedVideoStore } from '$lib/store';

	let videoList: IVideoData[] = [];
	let videoListInitialised = false;
	let videoIndex: number = 0;
	let initialVideoId: string;

	let player: any = null;

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
			initialVideoId = videoList[0]?.videoID || '';

			if (videoList.length == 0) {
				window.location.href = './';
			}
		}
	});

	let playerControls: PlayerControls;
	let mixDisplay: MixDisplay;

	let searchTerm = '';
</script>

<div class="wrapper">
	<div class="left-wrapper">
		<PlayerControls
			bind:this={playerControls}
			{player}
			bind:videoList
			bind:videoIndex
			bind:mixDisplay
		/>
		<div class="btm-panel">
			<div class="search-bar-wrapper">
				<div class="search-bar">
					<i class="fa-solid fa-magnifying-glass" />
					<input bind:value={searchTerm} />
				</div>
			</div>
			<div class="playlist-display-wrapper">
				<MixDisplay
					{player}
					bind:videoList
					bind:videoIndex
					bind:this={mixDisplay}
					bind:searchTerm
				/>
			</div>
		</div>
	</div>

	<div class="player-wrapper">
		<Youtube {initialVideoId} bind:player />
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
</style>
