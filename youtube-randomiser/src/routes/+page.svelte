<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionResult, SubmitFunction } from '@sveltejs/kit';

	import { fade, fly } from 'svelte/transition';
	import { videoIDStore } from '$lib/store';
	import PlaylistDisplay from '$lib/components/playlistDisplay/playlistDisplay.svelte';
	import Layout from './+layout.svelte';
	import GroupedPlaylistDisplay from '$lib/components/playlistDisplay/groupedPlaylistDisplay.svelte';

	// return from form POST request is accessible through this special form prop
	export let form: IPlaylistDataResponse;

	let originalIDs: string[] = [];

	let videoList: IVideoData[] = [];
	videoIDStore.subscribe((videoIDs) => {
		videoList = videoIDs;
	});

	let groupedVideoData: IGroupedVideoData = [];

	const handleAddID: SubmitFunction = ({ formElement, formData, cancel, action }) => {
		const ytMediaID = formData.get('ytMediaID')?.toString();

		// TODO: add cache fetching for previously fetched media id's. Only accept cached playlist id's that are less than 5 or 10 min old, incase playlist is updated
		// TODO: remove old playlist id's from cache if it is old enough

		// if the id has already been included, dont include it again
		// if the id is invalid youtube video or playlist id, cancel request
		if (ytMediaID == null || originalIDs.includes(ytMediaID) || inputInvalid) {
			console.log('request cancelled');
			cancel();
			formElement.reset();
			return;
		}

		// function to execute on returned response
		return async ({ result }) => {
			console.log(result);
			if (result.type === 'success' && result.data != null) {
				if (result.data.success === true) {
					// valid playlist or video id was found, update the video list

					if (action.search == '?/getVideo') {
						const data: IVideoData = result.data?.message;
						processVideoData(data);
					} else if (action.search == '?/getPlaylist') {
						const data: IPlaylistData = result.data?.message;
						processPlaylistData(data);
					}

					formElement.reset();
					originalIDs.push(ytMediaID);
				} else {
					// playlist or video id was invalid, prompt user to correct their input
				}
			} else {
				// connection to the backend went wrong somewhere?
			}
		};
	};

	const processVideoData = (videoData: IVideoData) => {
		videoIDStore.update((currentData) => {
			return [videoData, ...currentData];
		});

		// append video to start of grouped video data
		groupedVideoData = [
			{
				isPlayList: false,
				data: videoData
			},
			...groupedVideoData
		];
	};

	const processPlaylistData = (playlistData: IPlaylistData) => {
		//update video id store with videos from playlist
		videoIDStore.update((currentData) => {
			return [...currentData, ...playlistData.videos];
		});

		// append playlist to start of grouped video data
		groupedVideoData = [
			{
				isPlayList: true,
				data: playlistData
			},
			...groupedVideoData
		];
	};

	const validateVideoId = (ytMediaID: string) => {
		const videoIDRegex = /^([a-zA-Z0-9_-]{11})$/;

		if (videoIDRegex.test(ytMediaID)) {
			return true;
		}
		return false;
	};

	const validatePlaylistId = (ytMediaID: string) => {
		const playlistIDRegex = /^([a-zA-Z0-9_-]{34})$/;

		if (playlistIDRegex.test(ytMediaID)) {
			return true;
		}
		return false;
	};

	const handleClearVideos = () => {
		videoIDStore.set([]);
	};

	let input = '';
	let inputIsPlaylist: boolean = false;
	let inputIsVideo: boolean = false;
	let inputInvalid: boolean = true;
	$: inputIsPlaylist = validatePlaylistId(input);
	$: inputIsVideo = validateVideoId(input);
	$: inputInvalid = !(inputIsPlaylist || inputIsVideo);
</script>

<div class="wrapper">
	<h3>Playlist</h3>
	<div class="video-list">
		<div class="playlist-input">
			<form use:enhance={handleAddID} method="POST" action="?/getVideo">
				<button class="add-btn" formaction="?/getPlaylist" class:hidden={!inputIsPlaylist}>
					playlist
				</button>
				<button class="add-btn" formaction="?/getVideo" class:hidden={!inputIsVideo}>video</button>
				<button class="add-btn" class:hidden={!inputInvalid}>invalid</button>

				<input
					name="ytMediaID"
					type="text"
					placeholder="Enter a playlist or video ID or URL"
					bind:value={input}
				/>
			</form>
		</div>
		<div class="playlist-display-wrapper">
			<GroupedPlaylistDisplay {groupedVideoData} />
		</div>
	</div>
	<div class="btn-wrapper">
		<button class="shuffle-btn" class:disabled={videoList.length == 0}>
			<a href="/player" class:disabled={videoList.length == 0}>Shuffle</a>
		</button>
		<button class="clear-btn" on:click={handleClearVideos}>Clear</button>
	</div>
</div>

<style lang="scss">
	* {
		box-sizing: border-box;
	}
	.wrapper {
		height: calc(100% - var(--navbar-height));
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 3% 0px 5%;
		margin: 0;
	}

	h3 {
		margin-right: 20px;
	}

	.video-list {
		display: flex;
		flex-direction: column;
		padding: 20px;
		width: 50%;
		height: 100%;

		min-height: 0;
	}

	.playlist-display-wrapper {
		// min-height: 50px;
		// max-height: 300px;
		padding: 0;
		height: 100%;
		width: 100%;

		min-height: 0;
	}

	.playlist-input {
		margin: 20px 0px;

		form {
			display: flex;
		}

		input {
			width: 100%;
		}

		.add-btn {
			margin-right: 10px;
		}
	}

	.shuffle-btn a {
		text-decoration: none;
	}

	.disabled {
		pointer-events: none;
		cursor: default;
	}

	.hidden {
		display: none;
	}
</style>
