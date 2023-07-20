import { verifyTokenSignature } from '$lib/server/userAuthentication';
import { json, type RequestEvent } from '@sveltejs/kit';

export const POST = async (RequestEvent: RequestEvent) => {
	const data = await RequestEvent.request.json();
	const token: string | null = data.token || null;
	console.log(token);

	if (!token) {
		return json('Invalid request, no token provided.', { status: 400 });
	}

	const tokenIsValid = verifyTokenSignature(token);

	if (tokenIsValid) {
		return json('Token valid.', { status: 201 });
	}

	return json('Invalid token, unauthorised.', { status: 401 });
};
