<script lang="ts">
	import { fade } from 'svelte/transition';
	import PlaylistWrapper from './playlistWrapper.svelte';
	export let videoList: IVideoData[];
</script>

<PlaylistWrapper>
	{#each videoList as video}
		<li in:fade>
			<div class="thumbnail" style:background-image={`url(${video.thumbnailUrl}`} />
			<div class="video-info">
				<div class="video-title">{video.title}</div>
				<div class="video-channel">
					{video.channelTitle}
				</div>
			</div>
		</li>
	{/each}
</PlaylistWrapper>

<style lang="scss">
	.thumbnail {
		height: 80px;
		aspect-ratio: 1;
		border-radius: 50%;
		background-position: center center;
	}

	.video-info {
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin-left: 20px;

		.video-channel {
			color: var(--grey-dark);
		}
	}

	li {
		display: flex;
		padding: 10px;
		align-items: center;
	}
</style>
