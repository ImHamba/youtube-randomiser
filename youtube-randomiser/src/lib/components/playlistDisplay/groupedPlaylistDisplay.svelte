<script lang="ts">
	import { fade } from 'svelte/transition';
	import PlaylistWrapper from './playlistWrapper.svelte';
	import CollapsableSection from '../collapsableSection.svelte';
	export let groupedVideoData: IGroupedVideoData;
</script>

<PlaylistWrapper>
	{#each groupedVideoData as videoGroup}
		{#if videoGroup.isPlayList}
			<CollapsableSection expanded={true}>
				<li class="list-header" slot="header">
					<div
						class="thumbnail"
						style:background-image={`url(${videoGroup.data.playlistThumbnail}`}
					/>
					<div class="list-info">
						<div class="list-title">
							{videoGroup.data.playlistName}
						</div>
						<div class="list-subtitle">Playlist</div>
					</div>
					<button class="delete-btn">X</button>
				</li>
				<div class="list-wrapper" slot="items">
					{#each videoGroup.data.videos as video}
						<li class="list-item" in:fade>
							<div class="thumbnail" style:background-image={`url(${video.thumbnailUrl}`} />
							<div class="list-info">
								<div class="list-title">{video.title}</div>
								<div class="list-subtitle">
									{video.channelTitle}
								</div>
							</div>
							<button class="delete-btn">X</button>
						</li>
					{/each}
				</div>
			</CollapsableSection>
		{:else}
			<li in:fade>
				<div class="thumbnail" style:background-image={`url(${videoGroup.data.thumbnailUrl}`} />
				<div class="list-info">
					<div class="list-title">{videoGroup.data.title}</div>
					<div class="list-subtitle">
						{videoGroup.data.channelTitle}
					</div>
				</div>
			</li>
		{/if}
	{/each}
</PlaylistWrapper>

<style lang="scss">
	* {
		box-sizing: border-box;
	}
	.thumbnail {
		height: 80px;
		aspect-ratio: 1;
		border-radius: 50%;
		background-position: center center;
	}

	.list-info {
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin-left: 20px;

		.list-subtitle {
			color: var(--grey-dark);
		}
	}

	li {
		display: flex;
		padding: 10px;
		align-items: center;
		width: 100%;
	}

	li:nth-last-child(1) {
		border-bottom: none;
	}

	.list-item {
		padding-left: 30px;
	}

	.delete-btn {
		margin-left: auto;
		height: fit-content;
	}

	.collapsed {
		max-height: 0;
	}
</style>
