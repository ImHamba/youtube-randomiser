<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionResult, SubmitFunction } from '@sveltejs/kit';

	import { fade, fly } from 'svelte/transition';
	import { videoIDStore } from '$lib/store';
	import PlaylistDisplay from '$lib/components/playlistDisplay.svelte';
	import Layout from './+layout.svelte';

	// return from form POST request is accessible through this special form prop
	export let form: IPlaylistData;

	let originalIDs: string[] = [];

	let videoList: IVideoData[] = [];
	videoIDStore.subscribe((videoIDs) => {
		videoList = videoIDs;
	});

	const handleAddID: SubmitFunction = ({ formElement, formData, cancel }) => {
		const ytMediaID = formData.get('ytMediaID')?.toString();

		// TODO: add cache fetching for previously fetched media id's. Only accept cached playlist id's that are less than 5 or 10 min old, incase playlist is updated
		// TODO: remove old playlist id's from cache if it is old enough

		// if the id has already been included, dont include it again
		// if the id is invalid youtube video or playlist id, cancel request
		if (
			ytMediaID == null ||
			originalIDs.includes(ytMediaID) ||
			validateYtMediaId(ytMediaID) == false
		) {
			console.log('request cancelled');
			cancel();
			formElement.reset();
			return;
		}

		return async ({ result }) => {
			if (result.type === 'success' && result.data != null) {
				if (result.data.success === true) {
					// valid playlist or video id was found, update the video list

					//update video id store
					videoIDStore.update((currentData) => {
						return [...(result.data?.message || []), ...currentData];
					});
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

	const validateYtMediaId = (ytMediaID: string) => {
		const playlistIDRegex = /^([a-zA-Z0-9_-]{34})$/;
		const videoIDRegex = /^([a-zA-Z0-9_-]{11})$/;

		if (playlistIDRegex.test(ytMediaID) || videoIDRegex.test(ytMediaID)) {
			return true;
		}
		return false;
	};

	const handleClearVideos = () => {
		videoIDStore.set([]);
	};
</script>

<div class="wrapper">
	<div class="" />
	<h3>Playlist</h3>
	<div class="video-list">
		<div class="playlist-input">
			<form use:enhance={handleAddID} method="POST" action="?/getVideoList">
				<button class="add-btn">Add</button>
				<input name="ytMediaID" type="text" placeholder="Enter a playlist or video ID or URL" />
			</form>
		</div>
		<div class="playlist-display-wrapper">
			<PlaylistDisplay {videoList} />
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
	.wrapper {
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	h3 {
		margin-right: 20px;
	}

	.video-list {
		display: flex;
		flex-direction: column;
		margin: 20px;
		width: 50%;
	}

	.playlist-display-wrapper {
		border: 1px black solid;
		min-height: 50px;
		max-height: 300px;
		overflow-y: auto;
		overflow-x: hidden;
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
</style>
