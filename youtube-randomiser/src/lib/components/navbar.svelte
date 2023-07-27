<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import type { SubmitFunction } from '@sveltejs/kit';
	import RegisterLoginModal from './userAccess/registerLoginModal.svelte';
	import { groupedVideoStore, toastAlertStore } from '$lib/store';
	import { page } from '$app/stores';
	import { appendDemoParam } from '$lib/misc/util';

	export let loginData: ILoginData;
	export let showDemo: boolean;
	let signInDemo: boolean;

	let signUpModalVisible = false;
	let signInModalVisible = false;

	const handleOpenSignUp = () => {
		signUpModalVisible = true;
	};
	const handleOpenSignIn = () => {
		signInDemo = false;
		signInModalVisible = true;
	};

	const handleOpenDemoSignIn = () => {
		signInDemo = true;
		signInModalVisible = true;
	};

	const handleSignUpRequest: SubmitFunction = () => {
		return async ({ result }) => {
			if (result.status == 400) {
				toastAlertStore.set({
					title: 'Sign Up Error',
					content: 'Invalid account data provided.',
					colorMode: 0
				});
				return;
			} else if (result.status == 409) {
				toastAlertStore.set({
					title: 'Sign Up Error',
					content: 'Email already exists.',
					colorMode: 0
				});
				return;
			} else if (result.status == 200) {
				toastAlertStore.set({
					title: 'Sign Up Successful 🎉',
					content: 'Welcome!',
					colorMode: 1
				});

				// reload page to validate token cookie
				invalidateAll();

				signUpModalVisible = false;
			}
		};
	};

	const handleSignInByEmailPasswordRequest: SubmitFunction = () => {
		return async ({ result }) => {
			// invalid login credentials
			if (result.status == 401) {
				toastAlertStore.set({
					title: 'Login Error',
					content: 'Incorrect email or password.',
					colorMode: 0
				});
				return;
			}

			// invalid sign in request (missing data)
			else if (result.status == 400) {
				return;
			}

			// valid login, save the token
			else if (result.status == 200) {
				toastAlertStore.set({
					title: 'Login Successful',
					content: 'Welcome!',
					colorMode: 1
				});

				// reload page data to validate token cookie
				invalidateAll();

				// close the modal
				signInModalVisible = false;
			}

			// any other status code
			else {
				console.log('other code');
				return;
			}
		};
	};

	const handleSignOut = async () => {
		// console.log('Deleting cookie');
		await fetch('/api/userAuth/signOut', { method: 'POST', credentials: 'include' });

		// clear the current mix for user privacy upon logout
		groupedVideoStore.set([]);

		toastAlertStore.set({
			title: 'Signed out',
			content: '',
			colorMode: 2
		});

		// reload page data to update login state
		invalidateAll();
	};

	let width: number;
</script>

<svelte:window bind:innerWidth={width} />

<nav class="navbar">
	<h2>
		<a href={appendDemoParam('./', showDemo)}>{width >= 900 ? 'Youtube Randomiser' : 'YTR'}</a>
	</h2>
	<i class="fa-solid fa-shuffle" />
	{#if !loginData.valid}
		<div class="auth">
			{#if showDemo}
				<span><button class="demo-btn" on:click={handleOpenDemoSignIn}>Demo sign in</button></span>
			{/if}
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
			bind:showDemo={signInDemo}
		/>
	{:else}
		<div class="auth">
			<span class="auth-item">
				<i class="fa-regular fa-circle-user" />
				{loginData.userData.email.split('@')[0]}
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
			justify-content: center;
			gap: 20px;

			span button {
				padding: 0px;
				margin: 0px;
				height: 25px;
			}

			.auth-item {
				display: flex;
				align-items: center;
				justify-content: center;
				i {
					font-size: 25px;
					margin-right: 10px;
				}
			}

			.demo-btn {
				background-image: linear-gradient(to right, #ff512f 0%, #dd2476 100%);
				height: fit-content;
				padding: 10px 15px;
				box-shadow: 0 0 20px #ffffff60;
				border-radius: 100px;
				animation: bounce 10s 2s infinite linear;
			}

			@keyframes bounce {
				0% {
					transform: translateX(0px);
				}

				1% {
					transform: translateX(5px);
				}

				2% {
					transform: translateX(-5px);
				}

				3% {
					transform: translateX(5px);
				}

				4% {
					transform: translateX(-5px);
				}

				5%,
				100% {
					transform: translateX(0px);
				}
			}
		}

		@media screen and (max-width: 900px) {
			.auth {
				gap: 10px;
			}
		}
	}

	@media screen and (max-width: 900px) {
		.navbar {
			padding-left: 15px;
			justify-content: start;
			h2 {
				font-size: 1.2em;
			}
			i {
				font-size: 1.1em;
			}
		}
	}
</style>
