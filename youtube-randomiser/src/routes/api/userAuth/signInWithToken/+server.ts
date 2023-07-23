import { tokenCookieName } from '$lib/misc/localKeys.js';
import { decodeToken, verifyTokenSignature } from '$lib/server/userAuthentication';
import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export const POST = async ({ cookies }) => {
	const token = cookies.get(tokenCookieName);

	// ensure token was sent
	if (!token) {
		return json({ message: 'Invalid request, no token provided.' }, { status: 400 });
	}

	// check signature of token
	const tokenIsValid = await verifyTokenSignature(token);
	if (!tokenIsValid) {
		return json({ message: 'Invalid token, unauthorised.' }, { status: 401 });
	}

	const tokenData = decodeToken(token);

	// ensure user exists
	const userExists = await prisma.user.findFirst({
		where: {
			email: tokenData.email
		}
	});

	if (!userExists) {
		return json({ message: 'Invalid token, unauthorised.' }, { status: 401 });
	}

	return json({ message: tokenData }, { status: 201 });
};
