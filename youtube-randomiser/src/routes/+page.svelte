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
	let videoList: IVideoData[] = [];
	// $: playlistData = form.message;

	const handleAddID: SubmitFunction = () => {
		return async ({ result }: { result: ActionResult }) => {
			if (result.type === 'success' && result.data != null) {
				console.log(result.data.message);
				videoList = [...videoList, ...result.data.message];
			}
		};
	};
</script>

<div class="wrapper">
	<div class="" />
	<h3>Playlist</h3>
	<div class="video-list">
		<div class="playlist-input">
			<form use:enhance={handleAddID} method="POST" action="?/getPlaylist">
				<input name="playlistID" type="text" placeholder="Enter a playlist or video ID or URL" />
				<button class="add-btn">Add</button>
			</form>
		</div>
		<div class="playlist-display">
			{#each videoList as video}
				<ul>{video.title}</ul>
			{/each}
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
	}

	.playlist-input form {
		display: flex;
	}

	input {
		width: 100%;
	}

	.add-btn {
		margin-left: 20px;
	}

	.playlist-display {
		border: 1px black solid;
		min-height: 50px;
		max-height: 300px;
		overflow: auto;
	}
</style>
