<script lang="ts">
	import PlaylistWrapper from './playlistWrapper.svelte';
	export let videoList: IVideoData[];
	export let activeVideoIndex = -1;
	export let swapToIndex;
</script>

<PlaylistWrapper overflowScroll={false}>
	{#each videoList as video, index}
		<li
			class:active={index == activeVideoIndex}
			on:click={() => {
				swapToIndex = index;
			}}
		>
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
		// cursor: pointer;
	}

	.active {
		background-color: #ffffff1d;
	}
</style>
