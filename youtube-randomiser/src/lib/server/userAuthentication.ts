import { JWT_SECRET } from '$env/static/private';
import { fail } from '@sveltejs/kit';
import { SignJWT, jwtVerify } from 'jose';

export const authError = fail(401, {
	message: 'Email/password combination does not exist or token is invalid.'
});

export const generateToken = async (userData: IUserData) => {
	const secret = new TextEncoder().encode(JWT_SECRET);
	const validDuration = '1h';
	const alg = 'HS256';

	const jwt = await new SignJWT({ userData: userData })
		.setProtectedHeader({ alg })
		.setIssuedAt()
		// .setIssuer('urn:example:issuer')
		// .setAudience('urn:example:audience')
		.setExpirationTime(validDuration)
		.sign(secret);

	// console.log(jwt);
	return jwt;
	// return userData.email + 'token';
};

export const verifyTokenSignature = async (token: string) => {
	const secret = new TextEncoder().encode(JWT_SECRET);

	try {
		const { payload, protectedHeader } = await jwtVerify(token, secret, {});
		console.log(protectedHeader);
		console.log(payload);
		return true;
	} catch (err) {
		console.log(err);
		return false;
	}
};
