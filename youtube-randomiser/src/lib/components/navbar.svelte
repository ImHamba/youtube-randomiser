<script lang="ts">
	import Modal from './modal.svelte';
	import SignUpModal from './userAccess/signUpModal.svelte';

	const handleOpenSignUp = () => {
		signUpModalVisible = true;
	};
	const handleOpenSignIn = () => {};

	let signUpModalVisible = false;
</script>

<nav class="navbar">
	<h2><a href="./">Youtube Randomiser</a></h2>
	<i class="fa-solid fa-shuffle" />
	<div class="sign-up-in">
		<span><button on:click={handleOpenSignUp}>Sign up</button></span>
		<span><button on:click={handleOpenSignIn}>Sign in</button></span>
	</div>
	<SignUpModal bind:visible={signUpModalVisible} />
</nav>

<style lang="scss">
	.navbar {
		position: relative;
		width: 100%;
		height: var(--navbar-height);

		display: flex;
		justify-content: center;
		align-items: center;
		// padding-top: 20px;
		box-sizing: border-box;

		// border: 1px red solid;

		h2 {
			margin: 0px;

			a {
				font-family: 'Montserrat', sans-serif;
				text-decoration: none;
			}
		}

		i {
			margin-left: 10px;
			font-size: 2em;
		}

		.sign-up-in {
			position: absolute;
			right: 40px;
			display: flex;
			gap: 20px;

			span button {
				padding: 0px;
				margin: 0px;
			}
		}
	}

	.logo {
		height: 100%;
	}
</style>
