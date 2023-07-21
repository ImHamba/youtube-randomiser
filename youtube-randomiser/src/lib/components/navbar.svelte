<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import type { SubmitFunction } from '@sveltejs/kit';
	import RegisterLoginModal from './userAccess/registerLoginModal.svelte';
	import { groupedVideoStore } from '$lib/store';

	export let loginData: ILoginData;

	let signUpModalVisible = false;
	let signInModalVisible = false;

	const handleOpenSignUp = () => {
		signUpModalVisible = true;
	};
	const handleOpenSignIn = () => {
		signInModalVisible = true;
	};

	const handleSignUpRequest: SubmitFunction = () => {
		return async () => {
			// reload page to validate token cookie
			invalidateAll();

			signUpModalVisible = false;
		};
	};

	const handleSignInByEmailPasswordRequest: SubmitFunction = () => {
		return async ({ result }) => {
			// early return if any response errors
			if (result.type !== 'success' || result.data == null) {
				return;
			}

			// invalid login credentials
			if (result.data.status == 401) {
				return;
			}

			// invalid sign in request (missing data)
			else if (result.data.status == 400) {
				return;
			}

			// valid login, save the token
			else if (result.data.status == 201) {
				// reload page data to validate token cookie
				invalidateAll();

				// close the modal
				signInModalVisible = false;
			}

			// any other status code
			else {
				return;
			}
		};
	};

	const handleSignOut = async () => {
		// console.log('Deleting cookie');
		await fetch('/api/userAuth/signOut', { method: 'POST', credentials: 'include' });

		// clear the current mix for user privacy upon logout
		groupedVideoStore.set([]);

		// reload page data to update login state
		invalidateAll();
	};
</script>

<nav class="navbar">
	<h2><a href="./">Youtube Randomiser</a></h2>
	<i class="fa-solid fa-shuffle" />
	{#if !loginData.valid}
		<div class="auth">
			<span><button on:click={handleOpenSignUp}>Sign up</button></span>
			<span><button on:click={handleOpenSignIn}>Sign in</button></span>
		</div>

		<RegisterLoginModal
			bind:visible={signUpModalVisible}
			title="Sign Up"
			subtitle="to save your mixes"
			buttonText="Register"
			bottomMethodText="Or sign up with a different method"
			formAction="/api/userAuth?/createNewUser"
			handleRequest={handleSignUpRequest}
		/>

		<RegisterLoginModal
			bind:visible={signInModalVisible}
			title="Sign In"
			subtitle="to access your saved mixes"
			buttonText="Sign In"
			bottomMethodText="Or sign in with a different method"
			formAction="/api/userAuth?/signInUserByEmailPassword"
			handleRequest={handleSignInByEmailPasswordRequest}
		/>
	{:else}
		<div class="auth">
			<span class="auth-item">
				<i class="fa-regular fa-circle-user" />
				Welcome {loginData.userData.email}
			</span>
			<span class="auth-item">
				<button on:click={handleSignOut}>Sign out</button>
			</span>
		</div>
	{/if}
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

		.auth {
			position: absolute;
			right: 40px;
			display: flex;
			align-items: center;
			gap: 20px;

			span button {
				padding: 0px;
				margin: 0px;
			}

			.auth-item {
				display: flex;
				align-items: center;
				i {
					font-size: 25px;
					margin-right: 10px;
				}
			}
		}
	}
</style>
