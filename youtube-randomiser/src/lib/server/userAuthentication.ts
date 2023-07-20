import { fail } from '@sveltejs/kit';

export const authError = fail(401, {
	message: 'Email/password combination does not exist or token is invalid.'
});

export const generateToken = (user: string) => {
	// TODO: actually implement a proper token generator
	return user + 'token';
};

export const verifyTokenSignature = (token: string) => {
	// TODO: actually implement a proper token verifier

	if (token.slice(-5) == 'token') {
		return true;
	}
	return false;
};
