<script lang="ts">
	import { browser } from '$app/environment';
	import { writable, type Writable } from 'svelte/store';
	import CollapsableSection from '../collapsableSection.svelte';
	import PlaylistWrapper from './playlistWrapper.svelte';
	import { groupedVideoStore } from '$lib/store';

	export let savedMixesStore: Writable<IMix[]> | null;
	export let savedMixesKey: string;

	let defaultMessage = 'No saved mixes.';

	let savedMixes: IMix[] = [];

	function localStorageStore(key: string, initial: IMix[]) {
		let value;

		// only access local storage in the browser
		if (browser) {
			value = localStorage.getItem(key);
			const store: Writable<IMix[]> = writable(value == null ? initial : JSON.parse(value));

			store.subscribe((storeData) => {
				// when store data is updated, write it to local storage
				localStorage.setItem(key, JSON.stringify(storeData));

				// also updated saved mixes variable
				savedMixes = storeData;
			});

			return store;
		} else {
			return null;
		}
	}

	// only access local storage in the browser
	if (browser) {
		savedMixesStore = localStorageStore(savedMixesKey, []);
	}

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

	const removeMix = (mixIndex: number) => () => {
		savedMixesStore?.update((currentData) => {
			return currentData.slice(0, mixIndex).concat(currentData.slice(mixIndex + 1));
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
	heading="Saved Mixes"
	permanentScrollTrack={savedMixes.length > 0}
>
	{#if savedMixes.length == 0}
		<div class="default-message">
			{defaultMessage}
		</div>
	{/if}
	{#each orderMixesAlphabetically(savedMixes) as savedMix, index}
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
					<button class="delete-btn" on:click|stopPropagation={removeMix(index)}>
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
