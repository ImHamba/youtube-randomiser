import { browser } from '$app/environment';

export const validateToken = async (): Promise<boolean> => {
	let token: string | null = null;

	// dont attempt to access local storage if not in browser
	if (!browser) {
		return false;
	}
	// check if there is a token stored
	token = getStoredToken();

	if (!token) {
		return false;
	}

	// if there is a stored token, try to sign in with it
	const tokenIsValid = await validateTokenWithServer(token);

	if (!tokenIsValid) {
		return false;
	}

	return true;
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

const tokenLSKey = 'jwtToken';
export const getStoredToken = () => {
	// check if there is a token stored
	return localStorage.getItem(tokenLSKey);
};

export const setStoredToken = (newToken: string) => {
	// check if there is a token stored
	return localStorage.setItem(tokenLSKey, newToken);
};

export const deleteStoredToken = () => {
	localStorage.removeItem(tokenLSKey);
};
