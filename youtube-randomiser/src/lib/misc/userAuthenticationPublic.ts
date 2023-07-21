
export const validateTokenWithServer = async (fetchFn = fetch): Promise<ILoginData> => {
	// send request to server to validate token in cookie
	const res = await fetchFn('/api/userAuth/signInWithToken', { method: 'POST' });

	// if any status except 201 was returned, token is invalid
	if (res.status != 201) {
		return { valid: false, userData: null };
	}

	const resJson = await res.json();
	const userData: IPublicUserData = resJson.message;
	return { valid: true, userData: userData };
};
