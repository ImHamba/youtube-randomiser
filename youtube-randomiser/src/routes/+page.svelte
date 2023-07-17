<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	import GroupedPlaylistDisplay from '$lib/components/playlistDisplay/groupedPlaylistDisplay.svelte';
	import { groupedVideoStore } from '$lib/store';

	// return from form POST request is accessible through this special form prop
	export let form: IPlaylistDataResponse;

	let originalIDs: string[] = [];

	let groupedVideoData: IGroupedVideoData = [];
	groupedVideoStore.subscribe((storeData) => {
		groupedVideoData = storeData;
	});

	const handleAddID: SubmitFunction = ({ formElement, formData, cancel, action }) => {
		const ytMediaID = formData.get('ytMediaID')?.toString();

		// TODO: add cache fetching for previously fetched media id's. Only accept cached playlist id's that are less than 5 or 10 min old, incase playlist is updated
		// TODO: remove old playlist id's from cache if it is old enough

		// if the id has already been included, dont include it again
		// if the id is invalid youtube video or playlist id, cancel request
		if (ytMediaID == null || originalIDs.includes(ytMediaID) || inputInvalid) {
			console.log('request cancelled');
			cancel();
			// formElement.reset();
			input = ''; // trigger input validation reactive value
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

					// formElement.reset();
					input = ''; // trigger input validation reactive value
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
		groupedVideoStore.update((currentData) => {
			return [{ isPlayList: false, data: videoData }, ...currentData];
		});
	};

	const processPlaylistData = (playlistData: IPlaylistData) => {
		//update video id store with videos from playlist
		groupedVideoStore.update((currentData) => {
			return [{ isPlayList: true, data: playlistData }, ...currentData];
		});
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
		groupedVideoStore.set([]);
	};

	let input = '';
	let inputIsPlaylist: boolean = false;
	let inputIsVideo: boolean = false;
	let inputInvalid: boolean = true;
	$: inputIsPlaylist = validatePlaylistId(input);
	$: inputIsVideo = validateVideoId(input);
	$: inputInvalid = !(inputIsPlaylist || inputIsVideo);
	$: console.log(input, inputInvalid, inputIsPlaylist, inputIsVideo);
</script>

<div class="wrapper">
	<h3>Playlist</h3>
	<div class="video-list">
		<div class="playlist-input">
			<form use:enhance={handleAddID} method="POST" action="?/getVideo">
				<!-- Buttons swap in and out depending on whether user input is invalid, video ID or playlist ID -->
				<button class="add-btn active" formaction="?/getPlaylist" class:hidden={!inputIsPlaylist}>
					<i class="fa-solid fa-plus" />
				</button>

				<button class="add-btn active" formaction="?/getVideo" class:hidden={!inputIsVideo}>
					<i class="fa-solid fa-plus" />
				</button>

				<button class="add-btn disabled" class:hidden={!inputInvalid}>
					<i class="fa-solid fa-plus" />
				</button>

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
		<button class="shuffle-btn bottom-btn" class:bottom-btn-disabled={groupedVideoData.length == 0}>
			<a href="/player">
				<i class="fa-solid fa-shuffle" />
				Shuffle
			</a>
		</button>
		<button
			class="clear-btn bottom-btn"
			on:click={handleClearVideos}
			class:bottom-btn-disabled={groupedVideoData.length == 0}
		>
			<i class="fa-solid fa-rotate-right" />
			Clear
		</button>
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
		@import './src/app.scss';
		@include glass-background;
		// min-height: 50px;
		// max-height: 300px;
		padding: 0;
		border-radius: 25px;
		overflow: hidden;
		height: 100%;
		width: 100%;

		min-height: 0;
	}

	.playlist-input {
		// height: 50px;
		margin: 20px 0px;

		form {
			display: flex;
			// height: 100%;
			align-items: center;
		}

		input {
			@import './src/app.scss';
			@include glass-background;

			border: none;
			border-radius: 50px;
			padding-left: 15px;
			width: 100%;
			height: 40px;
			font-size: 0.9em;
			// color: var(--txt-light);
			outline: none;
		}

		input:-webkit-autofill,
		input:-webkit-autofill:focus {
			transition: background-color 600000s 0s, color 600000s 0s;
		}

		input::placeholder {
			color: var(--grey-dark);
		}

		.add-btn {
			margin-right: 10px;
			aspect-ratio: 1;
			transition: all 0.1s ease;

			i {
				font-size: 30px;
			}
		}

		.active {
			opacity: 0.6;
		}

		.add-btn:hover {
			opacity: 0.9;
		}
	}

	.btn-wrapper {
		display: flex;

		.shuffle-btn a {
			text-decoration: none;
			display: flex;
			align-items: center;
		}

		.bottom-btn {
			margin: 0px 10px;
			font-size: 1.2em;
			display: flex;
			align-items: center;
			i {
				font-size: 1.3em;
				margin-right: 5px;
			}
		}

		.bottom-btn-disabled {
			pointer-events: none;
			cursor: default;
			opacity: 0.3;
		}
	}

	.disabled {
		pointer-events: none;
		cursor: default;
		opacity: 0.12;
	}

	.hidden {
		display: none;
	}
</style>
