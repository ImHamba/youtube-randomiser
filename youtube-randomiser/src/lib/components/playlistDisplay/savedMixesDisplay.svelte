<script lang="ts">
	import { browser } from '$app/environment';
	import { savedLocalMixesLSKey } from '$lib/misc/localKeys';
	import {
		groupedVideoStore,
		toastAlertStore,
		savedLocalMixesStore,
		savedUserMixesStore
	} from '$lib/store';
	import { get, type Writable } from 'svelte/store';
	import CollapsableSection from '../collapsableSection.svelte';
	import PlaylistWrapper from './playlistWrapper.svelte';
	import { invalidateAll } from '$app/navigation';

	let defaultMessage = 'No saved mixes.';

	export let loginData: ILoginData;
	let mixesToDisplay: IMix[];
	// update displayed mixes when login state changes
	$: {
		if (!loginData.valid) {
			mixesToDisplay = get(savedLocalMixesStore);
		} else {
			mixesToDisplay = get(savedUserMixesStore);
		}
	}

	// subscribe to any changes in the saved local mixes store
	savedLocalMixesStore.subscribe((storeData) => {
		if (browser) {
			// when store data is updated, write it to local storage
			localStorage.setItem(savedLocalMixesLSKey, JSON.stringify(storeData));
		}

		// update displayed mixes when store updates
		if (!loginData.valid) {
			mixesToDisplay = storeData;
		}
	});

	// subscribe to any changes in the saved user mixes store
	savedUserMixesStore.subscribe((storeData) => {
		// update displayed mixes when store updates
		if (loginData.valid) {
			mixesToDisplay = storeData;
		}
	});

	const getMixThumbnail = (mix: IMix) => {
		if (mix.mixData[0].isPlayList) {
			return mix.mixData[0].data.playlistThumbnail;
		} else {
			return mix.mixData[0].data.thumbnailUrl;
		}
	};

	const countMixVideos = (mix: IMix) => {
		let sum = 0;

		mix.mixData.forEach((videoGroup) => {
			if (videoGroup.isPlayList) {
				sum += videoGroup.data.videos.length;
			} else {
				sum += 1;
			}
		});

		return sum;
	};

	const videoGroupDetails = (videoGroup: IVideoGroup) => {
		if (videoGroup.isPlayList) {
			return {
				title: videoGroup.data.playlistName,
				subtitle: `Playlist • ${videoGroup.data.videos.length} videos`,
				thumbnail: videoGroup.data.playlistThumbnail
			};
		} else {
			return {
				title: videoGroup.data.title,
				subtitle: `Video • ${videoGroup.data.channelTitle}`,
				thumbnail: videoGroup.data.thumbnailUrl
			};
		}
	};

	const removeMix = (mixIndex: number) => async () => {
		// if no user logged in, remove local mix by index
		if (!loginData.valid) {
			savedLocalMixesStore.update((currentData) => {
				return currentData.slice(0, mixIndex).concat(currentData.slice(mixIndex + 1));
			});
		}

		// if user logged in, send request to server to delete from account by mix id
		else {
			const mixIdToDelete = get(savedUserMixesStore)[mixIndex].mixId;
			await fetch('/api/mixes', { method: 'DELETE', body: JSON.stringify(mixIdToDelete) });
			invalidateAll();
		}

		toastAlertStore.set({
			title: 'Mix Deleted',
			content: '',
			colorMode: 2
		});
	};

	const loadMix = (savedMix: IMix) => () => {
		groupedVideoStore.set(savedMix.mixData);
	};

	const orderMixesAlphabetically = (mixes: IMix[]) => {
		const newArr = [...mixes];
		newArr.sort((a, b) => {
			return a.mixName.localeCompare(b.mixName);
		});
		return newArr;
	};
</script>

<PlaylistWrapper
	--scrollbar-margin-btm="15px"
	--scrollbar-margin-top="15px"
	heading={`${loginData.valid ? 'Your' : 'Local'} Saved Mixes`}
	permanentScrollTrack={mixesToDisplay.length > 0}
>
	{#if mixesToDisplay.length == 0}
		<div class="default-message">
			{defaultMessage}
		</div>
	{/if}
	{#each orderMixesAlphabetically(mixesToDisplay) as savedMix, index}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="row-wrapper" on:click={loadMix(savedMix)}>
			<CollapsableSection expanded={false}>
				<li class="list-header" slot="header">
					<div class="thumbnail" style:background-image={`url(${getMixThumbnail(savedMix)}`} />
					<div class="list-info">
						<div class="list-title">
							{savedMix.mixName}
						</div>
						<div class="list-subtitle">
							Mix • {countMixVideos(savedMix)} video{countMixVideos(savedMix) > 1 ? 's' : ''}
						</div>
					</div>
					<button class="delete-btn" on:click|stopPropagation={removeMix(index)} title="Delete mix">
						<i class="fa-solid fa-xmark" />
					</button>
				</li>
				<div class="list-wrapper" slot="items">
					{#each savedMix.mixData as videoGroup}
						<li class="list-item">
							<div
								class="thumbnail"
								style:background-image={`url(${videoGroupDetails(videoGroup).thumbnail}`}
							/>
							<div class="list-info">
								<div class="list-title">{videoGroupDetails(videoGroup).title}</div>
								<div class="list-subtitle">
									{videoGroupDetails(videoGroup).subtitle}
								</div>
							</div>
						</li>
					{/each}
				</div>
			</CollapsableSection>
		</div>
	{/each}
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

	.row-wrapper:hover {
		background-color: #ffffff10;
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
