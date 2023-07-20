<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import Modal from '../modal.svelte';

	export let visible: boolean;

	export let title = '';
	export let subtitle = '';
	export let buttonText = '';
	export let bottomMethodText = '';
	export let formAction: string;

	export let handleRequest: SubmitFunction;
</script>

<div class="modal-wrapper" class:hidden={!visible}>
	<Modal bind:visible>
		<div class="modal-contents">
			<div>
				<h2>{title}</h2>
				<h4>{subtitle}</h4>
			</div>
			<form
				class="account-input-section"
				method="POST"
				action={formAction}
				use:enhance={handleRequest}
			>
				<div class="account-input-row">
					<span class="account-input-label">Email Address</span>
					<span class="account-input">
						<i class="fa-regular fa-envelope" />
						<input name="email" />
					</span>
				</div>
				<!-- <div class="account-input-row">
					<span class="account-input-label">Username</span>
					<span class="account-input">
						<i class="fa-regular fa-user" />
						<input />
					</span>
				</div> -->
				<div class="account-input-row">
					<span class="account-input-label">Password</span>
					<span class="account-input">
						<i class="fa-solid fa-lock" />
						<input name="password" type="password" />
					</span>
				</div>
				<button class="register-btn hover-highlight">
					<h4>{buttonText}</h4>
				</button>
			</form>

			<div class="other-methods">
				<span class="divider" />
				<span>{bottomMethodText}</span>
				<div class="other-method-btn-wrapper">
					<button class="other-method-btn hover-highlight">
						<i class="fa-brands fa-google" />
					</button>
					<!-- <button class=" other-method-btn hover-highlight">
						<i class="fa-brands fa-google" />
					</button>
					<button class="other-method-btn hover-highlight">
						<i class="fa-brands fa-google" />
					</button> -->
				</div>
			</div>
		</div>
	</Modal>
</div>

<style lang="scss">
	@import './src/app.scss';
	* {
		box-sizing: border-box;
	}
	.modal-wrapper {
		width: min(500px, 90%);
		height: min(700px, 90%);

		position: fixed;
		float: left;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		z-index: 1;
	}

	.modal-contents {
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-around;
		// gap: 15px;

		h2 {
			margin-bottom: 10px;
		}

		h4 {
			margin-top: 0px;
		}

		.account-input-section {
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 10px;

			.account-input-row {
				width: 100%;
				display: flex;
				flex-direction: column;
				align-items: start;
				justify-content: center;
				padding: 10px 40px;
				gap: 10px;

				.account-input-label {
					margin-left: 5px;
				}

				.account-input {
					display: flex;
					align-items: center;
					width: 100%;
					border-radius: 8px;
					background: #00000030;

					i {
						vertical-align: middle;
						font-size: 20px;
						margin-left: 15px;
						margin-top: 2px;
						opacity: 0.6;
					}

					input {
						border: none;
						padding-left: 15px;
						padding-right: 10px;
						width: 100%;
						height: 40px;
						font-size: 0.9em;
						// color: var(--txt-light);
						background: none;
						outline: none;
					}

					input:-webkit-autofill,
					input:-webkit-autofill:focus {
						transition: background-color 600000s 0s, color 600000s 0s;
					}
				}
			}
		}

		.register-btn {
			width: 150px;
			height: 50px;
			// border: 1px red solid;
			border-radius: 15px;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 20px;
			// margin-bottom: 10px;

			// @include glass-background;
			border: 2px var(--grey-dark) solid;
			// background: #ffffff10;

			h4 {
				font-size: medium;
				margin: 0px;
			}
		}

		.other-methods {
			width: 100%;
			// height: 100%;

			// border-top: 1px black solid;
			padding-top: 20px;
			display: flex;
			flex-direction: column;
			align-items: center;
			// gap: 20px;

			.divider {
				width: 80%;
				height: 2px;
				border-radius: 50px;
				margin-bottom: 20px;
				// border: 1px red solid;
				background: linear-gradient(to right, #22222210, #22222230, #22222210);
			}

			.other-method-btn-wrapper {
				margin: 10px 0px;
				.other-method-btn {
					width: 50px;
					aspect-ratio: 1;
					margin: 0px 10px;
					border-radius: 100px;

					i {
						font-size: 25px;
					}
				}
			}
		}
	}

	.hidden {
		display: none;
	}
</style>
