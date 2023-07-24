<script lang="ts">
	import { groupedVideoStore } from '$lib/store';
	import CollapsableSection from '../collapsableSection.svelte';
	import PlaylistWrapper from './playlistWrapper.svelte';
	export let groupedVideoData: IGroupedVideoData;
	export let defaultMessage = '';

	const removeVideoGroup = (videoGroup: IVideoGroup) => () => {
		groupedVideoStore.set(groupedVideoData.filter((e) => e !== videoGroup));
	};

	const removeVideoFromPlaylist = (videoGroup: IVideoGroup, index: number) => () => {
		const videoGroupIndex = groupedVideoData.findIndex((e) => e === videoGroup);
		const thisGroup = groupedVideoData[videoGroupIndex];

		if (thisGroup.isPlayList) {
			thisGroup.data.videos.splice(index, 1);
			groupedVideoStore.set(groupedVideoData);
		}
	};
</script>

<PlaylistWrapper
	--scrollbar-margin-btm="15px"
	--scrollbar-margin-top="15px"
	heading="Your Mix"
	permanentScrollTrack={groupedVideoData.length > 0}
>
	{#if groupedVideoData.length == 0}
		<div class="default-message">
			{defaultMessage}
		</div>
	{/if}
	{#each groupedVideoData as videoGroup}
		{#if videoGroup.isPlayList}
			<CollapsableSection expanded={false}>
				<li class="list-header" slot="header">
					<div
						class="thumbnail"
						style:background-image={`url(${videoGroup.data.playlistThumbnail}`}
					/>
					<div class="list-info">
						<div class="list-title">
							{videoGroup.data.playlistName}
						</div>
						<div class="list-subtitle">Playlist • {videoGroup.data.videos.length} videos</div>
					</div>
					<button
						class="delete-btn"
						on:click={removeVideoGroup(videoGroup)}
						title="Delete playlist"
					>
						<i class="fa-solid fa-xmark" />
					</button>
				</li>
				<div class="list-wrapper" slot="items">
					{#each videoGroup.data.videos as video, index}
						<li class="list-item">
							<div class="thumbnail" style:background-image={`url(${video.thumbnailUrl}`} />
							<div class="list-info">
								<div class="list-title">{video.title}</div>
								<div class="list-subtitle">
									{video.channelTitle}
								</div>
							</div>
							<button
								class="delete-btn"
								on:click={removeVideoFromPlaylist(videoGroup, index)}
								title="Delete video"
							>
								<i class="fa-solid fa-xmark" />
							</button>
						</li>
					{/each}
				</div>
			</CollapsableSection>
		{:else}
			<li>
				<div class="thumbnail" style:background-image={`url(${videoGroup.data.thumbnailUrl}`} />
				<div class="list-info">
					<div class="list-title">{videoGroup.data.title}</div>
					<div class="list-subtitle">
						{videoGroup.data.channelTitle}
					</div>
				</div>
				<button class="delete-btn" on:click={removeVideoGroup(videoGroup)} title="Delete video">
					<i class="fa-solid fa-xmark" />
				</button>
			</li>
		{/if}
	{/each}

	<slot name="bottomBar" slot="bottomBar" />
</PlaylistWrapper>

<style lang="scss">
	* {
		box-sizing: border-box;
	}

	.default-message {
		padding-top: 20px;
		text-align: center;
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

	i {
		font-size: 1.7em;
	}
</style>
