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

		background: radial-gradient(circle 300px at 30% 30%, #18ea8c32, transparent),
			radial-gradient(
				circle 300px at percentage(random(100) / 100) percentage(random(100) / 100),
				rgb(random(255), random(255), random(255), 0.5),
				transparent
			),
			radial-gradient(
				circle 300px at percentage(random(100) / 100) percentage(random(100) / 100),
				rgb(random(255), random(255), random(255), 0.5),
				transparent
			),
			radial-gradient(
				circle 300px at percentage(random(100) / 100) percentage(random(100) / 100),
				rgb(random(255), random(255), random(255), 0.5),
				transparent
			),
			radial-gradient(
				circle 300px at percentage(random(100) / 100) percentage(random(100) / 100),
				rgb(random(255), random(255), random(255), 0.5),
				transparent
			),
			radial-gradient(
				circle 300px at percentage(random(100) / 100) percentage(random(100) / 100),
				rgb(random(255), random(255), random(255), 0.5),
				transparent
			),
			radial-gradient(
				circle 300px at percentage(random(100) / 100) percentage(random(100) / 100),
				rgb(random(255), random(255), random(255), 0.5),
				transparent
			),
			radial-gradient(
				circle 300px at percentage(random(100) / 100) percentage(random(100) / 100),
				rgb(random(255), random(255), random(255), 0.5),
				transparent
			),
			radial-gradient(
				circle 300px at percentage(random(100) / 100) percentage(random(100) / 100),
				rgb(random(255), random(255), random(255), 0.5),
				transparent
			),
			radial-gradient(
				circle 300px at percentage(random(100) / 100) percentage(random(100) / 100),
				rgb(random(255), random(255), random(255), 0.5),
				transparent
			),
			radial-gradient(
				circle 300px at percentage(random(100) / 100) percentage(random(100) / 100),
				rgb(random(255), random(255), random(255), 0.5),
				transparent
			);
	}
</style>
