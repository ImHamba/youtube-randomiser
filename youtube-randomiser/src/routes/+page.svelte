<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	import GroupedPlaylistDisplay from '$lib/components/playlistDisplay/groupedPlaylistDisplay.svelte';
	import SavedMixesDisplay from '$lib/components/playlistDisplay/savedMixesDisplay.svelte';
	import { clickOutside } from '$lib/misc/clickOutside';
	import { currentMixLSKey, savedPlaylistLSKey } from '$lib/misc/localKeys.js';
	import { checkForIdenticalMix, maximumSavedMixesLimit } from '$lib/misc/mixesUtil.js';
	import { appendDemoParam, restringify } from '$lib/misc/util';
	import {
		groupedVideoStore,
		toastAlertStore,
		savedLocalMixesStore,
		savedUserMixesStore
	} from '$lib/store';
	import { get } from 'svelte/store';
	import { browser } from '$app/environment';
	import { invalidateAll } from '$app/navigation';

	// page load data
	export let data;
	const showDemo = data.showDemo;
	let loginData: ILoginData;
	$: {
		loginData = data.loginData;
		savedUserMixesStore.set(data.savedUserMixes);
	}

	let groupedVideoData: IGroupedVideoData = [];
	groupedVideoStore.subscribe((storeData) => {
		groupedVideoData = storeData;

		if (browser) {
			localStorage.setItem(currentMixLSKey, JSON.stringify(groupedVideoData));
		}
	});

	let awaitingResponse = false;

	const handleAddID: SubmitFunction = ({ formData, cancel, action }) => {
		const ytMediaID = formData.get('ytMediaID') as string;

		if (action.search == '?/getPlaylist') {
			// check if playlist id has already been saved on this device
			const savedPlaylistDataJson = localStorage.getItem(savedPlaylistLSKey);

			if (savedPlaylistDataJson != null) {
				const savedPlaylistData: IPlaylistData | null =
					JSON.parse(savedPlaylistDataJson)[ytMediaID];

				if (savedPlaylistData) {
					console.log('Found in localstorage:', ytMediaID);

					// add playlist etag to playlist request
					formData.set('etag', savedPlaylistData.playlistEtag);
				}
			}
		}

		// if the id has already been included, dont include it again
		// if the id is invalid youtube video or playlist id, cancel request
		if (
			ytMediaID == null ||
			// || originalIDs.includes(ytMediaID)
			inputInvalid
		) {
			console.log('request cancelled');
			cancel();
			// formElement.reset();
			input = ''; // trigger input validation reactive value
			return;
		}

		awaitingResponse = true;

		// function to execute on returned response
		return async ({ result }) => {
			awaitingResponse = false;
			if (result.type === 'success' && result.data != null) {
				if (result.data.success === true) {
					// valid playlist or video id was found, update the video list
					console.log('Valid media found');

					if (action.search == '?/getVideo') {
						const data: IVideoData = result.data?.message;
						processVideoData(data);
					} else if (action.search == '?/getPlaylist') {
						const response = result.data as IPlaylistDataResponse;
						let data: IPlaylistData;

						console.log('Playlist found, status:', response.status);

						if (response.status == 304) {
							const savedPlaylistDataJson = localStorage.getItem(savedPlaylistLSKey) as string;
							data = JSON.parse(savedPlaylistDataJson)[ytMediaID];

							console.log('Found in localstorage and unchanged on yt:', data.playlistId);

							// set up playlist data in store
							processPlaylistData(data);
						} else if (response.status == 200) {
							data = response.message;

							// save playlist data to local storage
							// localStorage.setItem(data.playlistId, JSON.stringify(data));
							const currentLS = JSON.parse(localStorage.getItem(savedPlaylistLSKey) || '{}');
							const newLS = { ...currentLS, [data.playlistId]: data };
							localStorage.setItem(savedPlaylistLSKey, JSON.stringify(newLS));

							console.log('Saving to localstorage:', data.playlistId);

							// set up playlist data in store
							processPlaylistData(data);
						} else if (response.status == 404) {
							return;
						}
					}

					// formElement.reset();
					input = ''; // trigger input validation reactive value
					// originalIDs.push(ytMediaID);
				} else {
					// playlist or video id was invalid, prompt user to correct their input
				}
			} else {
				// connection to the backend went wrong somewhere?
			}
		};
	};

	const processVideoData = (videoData: IVideoData) => {
		groupedVideoStore.update((currentData) => {
			return [{ isPlayList: false, data: videoData }, ...currentData];
		});
	};

	const processPlaylistData = (playlistData: IPlaylistData) => {
		//update video id store with videos from playlist
		groupedVideoStore.update((currentData) => {
			return [{ isPlayList: true, data: playlistData }, ...currentData];
		});
	};

	const validateVideoId = (ytMediaID: string) => {
		const videoIDRegex = /^([a-zA-Z0-9_-]{11})$/;

		if (videoIDRegex.test(ytMediaID)) {
			return true;
		}
		return false;
	};

	const validatePlaylistId = (ytMediaID: string) => {
		const playlistIDRegex = /^([a-zA-Z0-9_-]{34})$/;

		if (playlistIDRegex.test(ytMediaID)) {
			return true;
		}
		return false;
	};

	const handleClearVideos = () => {
		groupedVideoStore.set([]);
	};

	// playlist/video id input validation checks
	let input = '';
	let inputIsPlaylist: boolean = false;
	let inputIsVideo: boolean = false;
	let inputInvalid: boolean = true;
	$: inputIsPlaylist = validatePlaylistId(input);
	$: inputIsVideo = validateVideoId(input);
	$: inputInvalid = !(inputIsPlaylist || inputIsVideo);

	// saved mixes functionality
	let showPopupInput = false;
	let mixNameInput: string;
	const handleSaveMix = (newMixName: string, saveLocally: boolean) => async () => {
		// do not save empty mix name
		if (!newMixName) {
			toastAlertStore.set({
				title: 'Error',
				content: 'Enter a mix name.',
				colorMode: 0
			});
			return;
		}

		const newMix: IMix = {
			mixName: newMixName,
			mixData: groupedVideoData
		};

		if (saveLocally) {
			saveMixLocally(newMix);
		} else {
			await saveMixToAccount(newMix);
		}
	};

	const saveMixLocally = (newMix: IMix) => {
		// check that an identical mix doesnt already exist
		const identicalMixExists = checkForIdenticalMix(newMix, get(savedLocalMixesStore));

		if (identicalMixExists) {
			toastAlertStore.set({
				title: 'Error',
				content: 'Identical mix already exists.',
				colorMode: 0
			});
			return;
		}

		// if there is no identical mix, update saved mixes and reset mix name input
		console.log('Saving mix locally');
		savedLocalMixesStore.update((currentData) => {
			return [restringify(newMix), ...currentData];
		});
		showPopupInput = false;
		mixNameInput = '';

		toastAlertStore.set({
			title: 'Mix Saved',
			content: '',
			colorMode: 1
		});
	};

	const saveMixToAccount = async (newMix: IMix) => {
		// check that an identical mix doesnt already exist
		const identicalMixExists = checkForIdenticalMix(newMix, get(savedUserMixesStore));
		if (identicalMixExists) {
			toastAlertStore.set({
				title: 'Error',
				content: 'Identical mix already exists.',
				colorMode: 0
			});
			return;
		}

		// check saved mix limit hasnt been reached
		if (get(savedUserMixesStore).length >= maximumSavedMixesLimit) {
			toastAlertStore.set({
				title: 'Error',
				content: `Maximum ${maximumSavedMixesLimit} saved mixes limit reached.`,
				colorMode: 0
			});
			return;
		}
		// if there is no identical mix, update saved mixes and reset mix name input
		console.log('Sending save mix to account request');
		const res = await fetch('/api/mixes', { method: 'POST', body: JSON.stringify(newMix) });

		switch (res.status) {
			case 400:
			case 401:

			case 403:
				// maximum mix limit reached
				return;

			case 409:
				// identical mix exists
				return;

			case 201:
				// mix saved successfully, reload mixes
				invalidateAll();

				toastAlertStore.set({
					title: 'Mix Saved',
					content: '',
					colorMode: 1
				});

			case 500:
				return;
		}
	};

	const handleFillDemo = () => {
		input = 'PL0vfts4VzfNjnYhJMfTulea5McZbQLM7G';
	};
</script>

<div class="wrapper">
	<h3>Mix Creator</h3>
	<div class="video-list">
		<div class="playlist-input">
			<form use:enhance={handleAddID} method="POST">
				<!-- Buttons swap in and out depending on whether user input is invalid, video ID or playlist ID -->
				{#if !awaitingResponse}
					<button
						class="add-btn active hover-highlight"
						formaction="?/getPlaylist"
						class:hidden={!inputIsPlaylist}
						title="Add playlist"
					>
						<i class="fa-solid fa-plus" />
					</button>

					<button
						class="add-btn active hover-highlight"
						formaction="?/getVideo"
						class:hidden={!inputIsVideo}
						title="Add video"
					>
						<i class="fa-solid fa-plus" />
					</button>

					<button class="add-btn disabled" class:hidden={!inputInvalid}>
						<i class="fa-solid fa-plus" />
					</button>
				{:else}
					<button class="add-btn waiting-spinner">
						<i class="fa-solid fa-circle-notch" />
					</button>
				{/if}

				<input
					name="ytMediaID"
					type="text"
					placeholder="Enter a Youtube playlist or video ID"
					bind:value={input}
				/>

				{#if showDemo}
					<button class="demo-fill-btn" on:click|preventDefault={handleFillDemo}>Demo fill</button>
				{/if}
			</form>
		</div>
		<div class="panel-container">
			<div class="panel">
				<div class="playlist-display-wrapper">
					<GroupedPlaylistDisplay
						{groupedVideoData}
						defaultMessage="Add playlists and videos above, or load a saved mix."
					>
						<div class="btm-bar-wrapper" slot="bottomBar">
							{#if showPopupInput}
								<div
									class="mix-name-input"
									use:clickOutside
									on:click_outside={() => {
										showPopupInput = false;
									}}
								>
									<input bind:value={mixNameInput} placeholder="Enter a name for your mix" />
									<button
										class="hover-highlight"
										on:click={handleSaveMix(mixNameInput, !loginData.valid)}
										title="Confirm save mix"
									>
										<i class="fa-solid fa-check" />
									</button>
								</div>
							{/if}
							<div class="btn-wrapper">
								<button
									class="shuffle-btn bottom-btn hover-highlight"
									class:bottom-btn-disabled={groupedVideoData.length == 0}
									title="Shuffle and play mix"
								>
									<a href={appendDemoParam('/player', showDemo)}>
										<i class="fa-solid fa-play" />
									</a>
								</button>
								<button
									class="bottom-btn hover-highlight"
									on:click={handleClearVideos}
									class:bottom-btn-disabled={groupedVideoData.length == 0}
									title="Clear mix"
								>
									<i class="fa-solid fa-trash-can" />
								</button>
								<button
									class="bottom-btn hover-highlight"
									on:click={() => {
										showPopupInput = !showPopupInput;
									}}
									class:bottom-btn-disabled={groupedVideoData.length == 0}
									title="Save mix"
								>
									<i class="fa-solid fa-bookmark" />
								</button>
							</div>
						</div>
					</GroupedPlaylistDisplay>
				</div>
			</div>
			<div class="panel">
				<div class="playlist-display-wrapper">
					<SavedMixesDisplay {loginData} />
				</div>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	* {
		box-sizing: border-box;
	}
	.wrapper {
		height: calc(100% - var(--navbar-height));
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 4% 0px 4%;
		margin: 0;
	}

	@media screen and (max-width: 900px) {
		.wrapper {
			padding: 0px;
		}
	}

	h3 {
		margin: 0px;
		font-family: 'Montserrat', sans-serif;
	}

	.video-list {
		display: flex;
		flex-direction: column;
		padding: 0px 20px 20px;
		width: 80%;
		height: 100%;

		min-height: 0;
	}

	@media screen and (max-width: 900px) {
		.video-list {
			width: 100%;
			padding: 0px 10px 10px;
		}
	}

	.panel-container {
		height: 100%;
		width: 100%;
		display: flex;
		gap: 20px;
		min-height: 0;
	}

	@media screen and (max-width: 900px) {
		.panel-container {
			flex-direction: column;
			gap: 5px;
		}
	}

	.panel {
		height: 100%;
		width: 100%;
		min-height: 0;
	}

	.playlist-display-wrapper {
		@import './src/app.scss';
		@include glass-background;
		padding: 0;
		border-radius: 25px;
		overflow: hidden;
		height: 100%;
		width: 100%;
	}

	.playlist-input {
		// height: 50px;
		margin: 20px 0px;

		form {
			display: flex;
			height: 100%;
			align-items: center;
		}

		input {
			@import './src/app.scss';
			@include glass-background;

			border: none;
			border-radius: 50px;
			padding: 0px;
			padding-left: 15px;
			width: 100%;
			height: 100%;
			font-size: 0.9em;
			// color: var(--txt-light);
			outline: none;
		}

		input:-webkit-autofill,
		input:-webkit-autofill:focus {
			transition: background-color 600000s 0s, color 600000s 0s;
		}

		input::placeholder {
			color: var(--grey-dark);
		}

		.add-btn {
			text-align: center;
			padding: 0px;
			height: 45px;
			aspect-ratio: 1;
			margin-right: 5px;
			transition: all 0.1s ease;

			border-radius: 100px;
			// padding: 5px

			i {
				font-size: 30px;
			}
		}

		@media screen and (max-width: 900px) {
			.add-btn {
				height: 35px;
				i {
					font-size: 25px;
				}
			}
		}

		.demo-fill-btn {
			background-image: linear-gradient(to right, #ff512f 0%, #dd2476 100%);
			white-space: nowrap;
			height: 100%;
			margin-left: 20px;
			padding: 10px 15px;
			box-shadow: 0 0 20px #ffffff60;
			border-radius: 100px;
			animation: bounce 10s 2s infinite linear;
		}

		.active {
			opacity: 0.6;
		}

		.add-btn:hover {
			opacity: 1;
		}

		.waiting-spinner {
			opacity: 0.6;
			animation: spin 2s linear infinite;

			i {
				font-size: 25px;
			}
		}

		@keyframes spin {
			from {
				transform: rotate(0deg);
			}
			to {
				transform: rotate(360deg);
			}
		}
	}

	@media screen and (max-width: 900px) {
		.playlist-input {
			margin: 5px 0px;
		}
	}

	.btm-bar-wrapper {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.mix-name-input {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 50%;
			margin-bottom: 10px;

			input {
				width: 100%;
				min-width: 200px;
				background: #00000020;
				border: none;
				border-radius: 50px;
				padding: 0px 15px;
				height: 40px;
				font-size: 0.9em;
				outline: none;
			}

			input::placeholder {
				color: var(--grey-dark);
			}

			button {
				width: 45px;
				aspect-ratio: 1;
				border-radius: 100px;
				margin-left: 5px;

				i {
					font-size: 20px;
				}
			}
		}

		.btn-wrapper {
			display: flex;
			padding: 5px;

			.shuffle-btn {
				padding: 0;
				a {
					width: 100%;
					height: 100%;
					margin-left: 2px;
					text-decoration: none;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}

			.bottom-btn {
				height: 45px;
				aspect-ratio: 1;
				text-align: center;
				margin: 0px 10px;
				display: flex;
				align-items: center;
				justify-content: center;
				opacity: 1;
				border-radius: 100px;

				i {
					width: 100%;
					font-size: 25px;
					vertical-align: middle;
					// margin-right: 5px;
				}
			}

			@media screen and (max-width: 900px) {
				.bottom-btn {
					height: 35px;
					i {
						font-size: 20px;
					}
				}
			}

			.bottom-btn-disabled {
				pointer-events: none;
				cursor: default;
				opacity: 0.3;
			}
		}
	}

	.disabled {
		pointer-events: none;
		cursor: default;
		opacity: 0.12;
	}

	.hidden {
		display: none;
	}
</style>
