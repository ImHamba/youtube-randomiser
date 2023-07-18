<script lang="ts">
	import { sleep } from '$lib/misc/util';
	import PlaylistWrapper from './playlistWrapper.svelte';
	export let videoList: IVideoData[];
	export let activeVideoIndex = -1;
	export let swapToIndex: number;

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
	const handleSwapVideo = (index: number) => async () => {
		// no swapping if clicking on current video
		if (index == activeVideoIndex) {
			return;
		}

		// no fade/fly animation required if the video is the next one, since it is already in the correct place
		if (index != activeVideoIndex + 1) {
			if (searchTerm) {
				directionDown = true
			}

			let target = listElement[index];
			target.classList.remove('fade');
			target.classList.add('fade');
			await sleep(transitionAnimTime * (2 / 3));
			target.classList.remove('fade');
		}

		directionDown = false

		if (searchTerm) {
			searchTerm = '';

			// sleep is required to scroll to newly selected video properly
			await sleep(1);
		}
		swapToIndex = index;
	};

	$: console.log(videoList[1]);
</script>

<PlaylistWrapper permanentScrollTrack={false} --scrollbar-margin-btm="18px">
	<div id="li-wrapper">
		{#each videoList as video, index}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
			<li
				class:active={index == activeVideoIndex}
				class:hidden={!(
					containsSubstring(video.title, searchTerm) ||
					containsSubstring(video.channelTitle, searchTerm)
				)}
				on:click={handleSwapVideo(index)}
				bind:this={listElement[index]}
				class:fade={false}
				style="--anim-time:{transitionAnimTime}ms; --direction:{directionDown ||
				index < activeVideoIndex
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
