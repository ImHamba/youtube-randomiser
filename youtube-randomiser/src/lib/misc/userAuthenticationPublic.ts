import { browser } from '$app/environment';

export const tokenLSKey = 'jwtToken';

export const validateToken = () => {
	let token: string | null = null;

	const notLoggedIn = {
		loggedIn: false,
		userData: {}
	};

	// dont attempt to access local storage if not in browser
	if (!browser) {
		return notLoggedIn;
	}

	// check if there is a token stored
	token = localStorage.getItem(tokenLSKey);

	if (!token) {
		return notLoggedIn;
	}

	// if there is a stored token, try to sign in with it
	const tokenIsValid = validateTokenWithServer(token);

	if (!tokenIsValid) {
		return notLoggedIn;
	}

	return {
		loggedIn: true,
		userData: {
			username: token.slice(0, -5)
		}
	};
};

const validateTokenWithServer = async (token: string) => {
	// send token to server to validate
	const auth = await fetch('/userAuth/signInWithToken', {
		method: 'POST',
		body: JSON.stringify({ token: token })
	});

	// if any status except 201 was returned, token is invalid
	if (auth.status != 201) {
		return false;
	}

	return true;
};
