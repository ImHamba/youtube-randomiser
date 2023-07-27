<script lang="ts">
	import Modal from './../lib/components/modal.svelte';
	import ToastAlert from '../lib/components/toastAlert.svelte';
	import Navbar from '$lib/components/navbar.svelte';
	import '../app.css';

	export let data;
	let loginData: ILoginData;
	const showDemo = data.showDemo;
	$: {
		loginData = data.loginData;
	}

	let modalVisible = showDemo;
</script>

<div class="background1">
	<div class="background2">
		<Navbar {loginData} {showDemo} />
		<ToastAlert />
		<slot />
		<div class="demo-modal-wrapper" class:hidden={!modalVisible}>
			<Modal bind:visible={modalVisible}>
				<div class="content-wrapper">
					<h2>Youtube Randomiser Demo</h2>
					<div class="demo-text">
						<p>Welcome! It looks like you've come from my portfolio site.</p>
						<p>
							This website lets users create shuffled mixes of Youtube playlists and videos since
							Youtube's native shuffle feature often breaks. Users can save their mixes locally, or
							create an account to access them from other devices.
						</p>
						<p>Demo features:</p>
						<ul>
							<li>
								Autofill an example Youtube playlist ID by clicking the
								<span class="highlight">Demo fill</span>
								button next to the input bar.
							</li>
							<li>
								Load a playlist/video by pressing the <i class="fa-solid fa-plus" /> Add button left
								of the input
							</li>
							<li>
								Play your mix by pressing the <i class="fa-solid fa-play" /> Play button at the bottom
								of the mix panel.
							</li>
							<li>
								Access a demo account by clicking the
								<span class="highlight">Demo sign in</span>
								button at the top right.
							</li>
						</ul>
					</div>
				</div>
			</Modal>
		</div>
	</div>
</div>

<style lang="scss">
	.background1 {
		width: 100%;
		height: 100%;

		background: var(--bgr-color);
	}

	.background2 {
		width: 100%;
		height: 100%;

		$gradients: ();
		$start: 0;
		$range: 255;
		@for $i from 0 through 4 {
			@for $j from 0 through 4 {
				$gradients: append(
					$gradients,
					radial-gradient(
						circle 300px at percentage(calc(($i * 2 + 1) / 10)) percentage(calc(($j * 2 + 2) / 10)),
						rgba(random($range) + $start, random($range) + $start, random($range) + $start, 0.25),
						transparent
					),
					comma
				);
			}
		}
		background: $gradients;
	}

	.demo-modal-wrapper {
		width: min(600px, calc(100% - 20px));
		height: min(700px, calc(100% - 20px));

		position: fixed;
		float: left;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		z-index: 1;
	}

	.content-wrapper {
		padding: 50px 80px;
	}

	@media screen and (max-width: 900px) {
		.content-wrapper {
			padding: 10px 40px;
		}
	}

	.demo-text {
		text-align: start;
	}

	.highlight {
		background-image: linear-gradient(to right, #ff512f 0%, #f5569d 100%);
		white-space: nowrap;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		font-weight: bold;
	}

	.hidden {
		display: none;
	}
</style>
