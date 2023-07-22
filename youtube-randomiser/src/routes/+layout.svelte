<script lang="ts">
	import ToastAlert from '../lib/components/toastAlert.svelte';
	import Navbar from '$lib/components/navbar.svelte';
	import '../app.css';

	export let data;
	let loginData: ILoginData;
	$: {
		loginData = data.loginData;
	}
</script>

<div class="background1">
	<div class="background2">
		<Navbar {loginData} />
		<ToastAlert />
		<slot />
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
</style>
