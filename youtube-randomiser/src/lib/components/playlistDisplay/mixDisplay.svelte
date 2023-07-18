<script lang="ts">
	import { getCurrentVideoId, loadVideo } from '$lib/misc/playerUtil';
	import { arrayMoveElement, sleep } from '$lib/misc/util';
	import PlaylistWrapper from './playlistWrapper.svelte';
	export let videoList: IVideoData[];
	export let videoIndex: number;
	export let player: any;

	export const scrollToListIndex = (scrollToIndex: number) => {
		const liElement = document
			.getElementById('li-wrapper')
			?.children.item(scrollToIndex) as HTMLElement;
		liElement.scrollIntoView(true);
		liElement.scrollIntoView(true);
	};

	export let searchTerm = '';
	const containsSubstring = (fullString: string, substr: string) => {
		return fullString.toLowerCase().includes(substr.toLowerCase());
	};

	let listElement: HTMLElement[] = [];
	let transitionAnimTime = 300; // time in ms
	let directionDown = false;
	const handleSwapVideo = (swapToIndex: number) => async () => {
		// no swapping if clicking on current video
		if (swapToIndex == videoIndex) {
			return;
		}

		// no animation out of clicked video required if the video is the next one, since it is already in the correct place
		// always animate out if there user was searching though
		if (swapToIndex != videoIndex + 1 || searchTerm) {
			if (searchTerm) {
				directionDown = true;
			}

			console.log(swapToIndex);
			let target = listElement[swapToIndex];
			target.classList.remove('fade');
			target.classList.add('fade');
			await sleep(transitionAnimTime * (2 / 3));
			target.classList.remove('fade');
		}

		directionDown = false;

		if (searchTerm) {
			searchTerm = '';

			// sleep is required to scroll to newly selected video properly
			await sleep(1);
		}

		videoList = arrayMoveElement(videoList, swapToIndex, videoIndex + 1);
		if (swapToIndex > videoIndex) {
			videoIndex += 1;
		}
		loadVideo(player, getCurrentVideoId(videoList, videoIndex));
		scrollToListIndex(videoIndex);
	};
</script>

<PlaylistWrapper permanentScrollTrack={false} --scrollbar-margin-btm="18px">
	<div id="li-wrapper">
		{#each videoList as video, index}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
			<li
				class:active={index == videoIndex}
				class:hidden={!(
					containsSubstring(video.title, searchTerm) ||
					containsSubstring(video.channelTitle, searchTerm)
				)}
				on:click={handleSwapVideo(index)}
				bind:this={listElement[index]}
				class:fade={false}
				style="--anim-time:{transitionAnimTime}ms; --direction:{directionDown || index < videoIndex
					? 1
					: -1}"
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

	.hidden {
		display: none;
	}

	.fade {
		animation: fade var(--anim-time) linear forwards;
	}

	@keyframes fade {
		0% {
			opacity: 1;
		}

		100% {
			opacity: 0;
			transform: translateY(calc(var(--direction) * 50px));
		}
	}
</style>
