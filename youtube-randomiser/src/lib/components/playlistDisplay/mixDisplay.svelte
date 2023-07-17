<script lang="ts">
	import PlaylistWrapper from './playlistWrapper.svelte';
	export let videoList: IVideoData[];
	export let activeVideoIndex = -1;
	export let swapToIndex;

	export const scrollToListIndex = (scrollToIndex: number) => {
		setTimeout(() => {
			const liElement = document
				.getElementById('li-wrapper')
				?.children.item(scrollToIndex) as HTMLElement;
			liElement.scrollIntoView(true);
			liElement.scrollIntoView(true);
		}, 500);
	};
</script>

<PlaylistWrapper overflowScroll={false} --margin-btm="18px">
	<div id="li-wrapper">
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
	</div>
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

	li:hover {
		background-color: #ffffff10;
	}

	.active,
	.active:hover {
		background-color: #ffffff1d;
	}
</style>
