<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionResult, SubmitFunction } from '@sveltejs/kit';

	interface IVideoData {
		success: boolean;
		channelTitle: string;
		title: string;
		videoID: string;
		thumbnailUrl: string;
	}

	interface IPlaylistData {
		success: boolean;
		message: IVideoData[];
	}

	// return from form POST request is accessible through this special form prop
	export let form: IPlaylistData;

	let originalIDs: string[] = [];
	let videoList: IVideoData[] = [];

	const handleAddID: SubmitFunction = ({ formElement, formData, cancel }) => {
		const ytMediaID = formData.get('ytMediaID')?.toString();

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
					formElement.reset();
					videoList = [...result.data.message, ...videoList];
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

	let playlistDisplay: HTMLElement;
	// $: if (videoList && playlistDisplay) {
	// 	console.log('tick');
	// 	scrollToBottom(playlistDisplay);
	// }
	// const scrollToBottom = async (node: HTMLElement) => {
	// 	node.scroll({ top: node.scrollHeight, behavior: 'smooth' });
	// };
</script>

<div class="wrapper">
	<div class="" />
	<h3>Playlist</h3>
	<div class="video-list">
		<div class="playlist-input">
			<form use:enhance={handleAddID} method="POST" action="?/getVideoList">
				<input name="ytMediaID" type="text" placeholder="Enter a playlist or video ID or URL" />
				<button class="add-btn">Add</button>
			</form>
		</div>
		<div class="playlist-display" bind:this={playlistDisplay}>
			<ul>
				{#each videoList as video}
					<li>
						<img src={video.thumbnailUrl} />
						<div class="video-info">
							<div class="video-title">{video.title}</div>
							<div class="video-channel">
								{video.channelTitle}
							</div>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	</div>
	<button>Shuffle</button>
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

	.playlist-input {
		margin: 20px 0px;

		form {
			display: flex;
		}

		input {
			width: 100%;
		}

		.add-btn {
			margin-left: 20px;
		}
	}

	.playlist-display {
		border: 1px black solid;
		min-height: 50px;
		max-height: 300px;
		overflow: auto;

		ul {
			list-style-type: none;
			padding: 0;
			margin: 0;

			li {
				display: flex;
				padding: 10px;
				border-bottom: 1px black solid;

				img {
					height: 80px;
				}

				.video-info {
					display: flex;
					flex-direction: column;
					justify-content: center;
					margin-left: 20px;

					.video-channel {
						color: grey;
					}
				}
			}

			li:nth-last-child(1) {
				border-bottom: none;
			}
		}
	}
</style>
