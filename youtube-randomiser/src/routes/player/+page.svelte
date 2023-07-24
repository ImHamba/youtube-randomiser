<script lang="ts">
	import { browser } from '$app/environment';
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

	let groupedVideoData: IGroupedVideoData;
	groupedVideoStore.subscribe((storeData) => {
		groupedVideoData = storeData;
		videoList = extractFromGroupedVideoData(storeData);

		// initialise
		if (!videoListInitialised) {
			videoListInitialised = true;
			videoList = shuffleArray(videoList);
			initialVideoId = videoList[0]?.videoID || '';

			if (videoList.length == 0 && browser) {
				window.location.href = './';
			}
		}
	});

	let mixDisplay: MixDisplay;

	let searchTerm = '';

	let width: number = 0;
	let collapsed: boolean;

	// initialise collapsed
	if (width < 900) collapsed = true;
	else collapsed = false;

	// updated collapsed if screen size changes
	$: if (width >= 900) {
		collapsed = false;
	}

	const hidePlaylist = () => {
		collapsed = !collapsed;
	};
</script>

<svelte:window bind:innerWidth={width} />

<div class="wrapper">
	<div class="left-wrapper" class:playlist-collapsed={collapsed}>
		<PlayerControls {player} bind:videoList bind:videoIndex {mixDisplay} />
		<div class="btm-panel">
			<div class="search-bar-wrapper" class:hidden={collapsed}>
				<div class="search-bar">
					<i class="fa-solid fa-magnifying-glass" />
					<input bind:value={searchTerm} />
				</div>
			</div>
			<div class="playlist-display-wrapper" class:hidden={collapsed}>
				<MixDisplay
					{player}
					bind:videoList
					bind:videoIndex
					bind:this={mixDisplay}
					bind:searchTerm
				/>
			</div>
			<button class="playlist-expand" on:click={hidePlaylist}>
				<i class="fa-solid fa-angle-down" class:rotated={!collapsed} />
			</button>
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

	@media screen and (max-width: 900px) {
		.wrapper {
			padding: 0px 10px 10px;
			flex-direction: column;
		}
	}

	.left-wrapper {
		display: flex;
		flex-direction: column;
		height: 80%;
		width: 30%;
		margin: 0px 20px;
		transition: height 100ms ease-out;
	}

	@media screen and (max-width: 900px) {
		.left-wrapper {
			box-sizing: border-box;
			padding: 0px 0px 5px;
			width: 100%;
			height: 75%;
		}
	}

	.btm-panel {
		@import './src/app.scss';
		@include glass-background;
		overflow: hidden;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		border-radius: 5px 5px 25px 25px;
		height: 100%;
	}

	.rotated {
		transform: rotateX(180deg);
	}

	.playlist-collapsed {
		height: 115px;
	}

	.hidden {
		visibility: hidden;
	}

	@media screen and (min-width: 900px) {
		.playlist-expand {
			display: none;
			padding: 0;
		}
	}

	@media screen and (max-width: 900px) {
		.playlist-expand {
			position: absolute;
			bottom: 0;
			padding: 0;
			width: 100%;
			background: linear-gradient(to top, #ededed60 0%, transparent 100%);
			height: 20px;

			display: flex;
			align-items: center;
			justify-content: center;
			i {
				font-size: 20px;
				transition: transform 100ms linear;
			}
		}
	}

	.search-bar-wrapper {
		width: 100%;
		padding: 15px;
		box-sizing: border-box;

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

	@media screen and (max-width: 900px) {
		.search-bar-wrapper {
			padding: 7px;
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

	@media screen and (max-width: 900px) {
		.player-wrapper {
			width: 100%;
		}
	}
</style>
