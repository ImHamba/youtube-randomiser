<script lang="ts">
	import Navbar from '$lib/components/navbar.svelte';
	import '../app.css';
</script>

<div class="background1">
	<div class="background2">
		<Navbar />
		<slot />
	</div>
</div>

<style lang="scss">
	.background1 {
		width: 100%;
		height: 100%;

		background: #0f0f0f;
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
						circle 300px at percentage(calc(($i*2 + 1) / 10)) percentage(calc(($j*2 + 2) / 10)),
						rgba(random($range) + $start, random($range) + $start, random($range) + $start, 0.25),
						transparent
					),
					comma
				);
			}
		}
		// @debug $gradients;
		background: $gradients;

		// background: radial-gradient(circle 300px at 30% 30%, #18ea8c32, transparent),
		// 	radial-gradient(
		// 		circle 300px at 49% 75%,
		// 		#6aa8be70,
		// 		transparent
		// 	),
		// 	radial-gradient(
		// 		circle 300px at 72% 99%,
		// 		#f3775b70,
		// 		transparent
		// 	),
		// 	radial-gradient(
		// 		circle 300px at 81% 41%,
		// 		#9f153f70,
		// 		transparent
		// 	),
		// 	radial-gradient(
		// 		circle 300px at 27% 86%,
		// 		#61ac7870,
		// 		transparent
		// 	),
		// 	radial-gradient(
		// 		circle 300px at 64% 35%,
		// 		#a6f76170,
		// 		transparent
		// 	),
		// 	radial-gradient(
		// 		circle 300px at 17% 28%,
		// 		#b37fd570,
		// 		transparent
		// 	),
		// 	radial-gradient(
		// 		circle 300px at 10% 70%,
		// 		#f66d6870,
		// 		transparent
		// 	),
		// 	radial-gradient(
		// 		circle 300px at 94% 79%,
		// 		#62f6d970,
		// 		transparent
		// 	),
		// 	radial-gradient(
		// 		circle 300px at 46% 44%,
		// 		#06a01b70,
		// 		transparent
		// 	),
		// 	radial-gradient(
		// 		circle 300px at 97% 51%,
		// 		#195e5870,
		// 		transparent
		// 	);
	}
</style>
