import { tokenCookieName } from '$lib/misc/localKeys.js';
import { decodeToken, verifyTokenSignature } from '$lib/server/userAuthentication';
import { json } from '@sveltejs/kit';
import { decodeJwt } from 'jose';

export const POST = async ({ cookies }) => {
	const token = cookies.get(tokenCookieName);

	if (!token) {
		return json({ message: 'Invalid request, no token provided.' }, { status: 400 });
	}

	const tokenIsValid = await verifyTokenSignature(token);

	if (!tokenIsValid) {
		return json({ message: 'Invalid token, unauthorised.' }, { status: 401 });
	}

	const tokenData = decodeToken(token);
	return json({ message: tokenData }, { status: 201 });
};
