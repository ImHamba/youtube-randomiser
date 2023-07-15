<script lang="ts">
	import { fade } from 'svelte/transition';
	export let videoList: IVideoData[];
</script>

<div class="playlist-display">
	<ul>
		{#each videoList as video}
			<li in:fade>
				<img src={video.thumbnailUrl} alt="video thumnail" />
				<div class="video-info">
					<div class="video-title">{video.title}</div>
					<div class="video-channel">
						{video.channelTitle}
					</div>
				</div>
			</li>
		{/each}
	</ul>
</div>

<style lang="scss">
	.playlist-display {
		ul {
			list-style-type: none;
			padding: 0;
			margin: 0;

			li {
				display: flex;
				padding: 10px;
				border-bottom: 1px black solid;
				// animation: fly-in 1s ease;

				// @keyframes fly-in {
				// 	0% {
				// 		transform: translateX(50px);
				// 	}

				// 	1000% {
				// 		transform: translateX(0px);
				// 	}
				// }

				img {
					height: 80px;
				}

				.video-info {
					display: flex;
					flex-direction: column;
					justify-content: center;
					margin-left: 20px;

					.video-channel {
						color: grey;
					}
				}
			}

			li:nth-last-child(1) {
				border-bottom: none;
			}
		}
	}
</style>
