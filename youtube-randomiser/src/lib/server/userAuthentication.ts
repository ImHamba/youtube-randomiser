import { JWT_SECRET } from '$env/static/private';
import { tokenCookieName } from '$lib/misc/localKeys';
import { fail, type Cookies, json } from '@sveltejs/kit';
import bcryptjs from 'bcryptjs';
const { compare, hash } = bcryptjs;
import { SignJWT, decodeJwt, jwtVerify } from 'jose';

export const hashingSaltRounds = 13;

export const authError = fail(401, {
	message: 'Email/password combination does not exist or token is invalid.'
});

export const generateToken = async (userData: IPublicUserData) => {
	const secret = new TextEncoder().encode(JWT_SECRET);
	const validDuration = '7d';
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
		// console.log(protectedHeader);
		// console.log(payload);
		return true;
	} catch (err) {
		console.log(err);
		return false;
	}
};

export const decodeToken = (token: string) => {
	const tokenData = decodeJwt(token).userData as IPublicUserData;
	return tokenData;
};

export const validateToken = async (
	cookies: Cookies
): Promise<
	| {
			valid: false;
			response: Response;
	  }
	| {
			valid: true;
			response: string;
	  }
> => {
	const token = cookies.get(tokenCookieName);

	if (!token) {
		return {
			valid: false,
			response: json({ message: 'Invalid request, no token provided.' }, { status: 400 })
		};
	}

	const tokenIsValid = await verifyTokenSignature(token);

	if (!tokenIsValid) {
		return {
			valid: false,
			response: json({ message: 'Invalid token, unauthorised.' }, { status: 401 })
		};
	}

	return { valid: true, response: token };
};

export const hashPassword = async (password: string) => {
	const passwordHash = await hash(password, hashingSaltRounds);
	return passwordHash;
};

export const validatePassword = async (submittedPassword: string, storedPasswordhash: string) => {
	const passwordsMatch = await compare(submittedPassword, storedPasswordhash);
	return passwordsMatch;
};
