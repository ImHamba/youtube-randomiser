import { validateToken } from '$lib/misc/userAuthenticationPublic.js';

export const load = async () => {
	return { validLogin: await validateToken() };
};
