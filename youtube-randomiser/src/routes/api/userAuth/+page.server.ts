import { tokenCookieName } from '$lib/misc/localKeys';
import { prisma } from '$lib/server/prisma';
import { authError, generateToken, verifyTokenSignature } from '$lib/server/userAuthentication';
import { fail, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	createNewUser: async ({ cookies, request }) => {
		const data = await request.formData();
		const email = data.get('email');
		const passwordHash = data.get('password');

		// console.log(email);

		if (!(email && passwordHash)) {
			return fail(400, { message: 'Invalid sign in request.' });
		}

		try {
			await prisma.user.create({
				data: {
					email: email as string,
					passwordHash: passwordHash as string
				}
			});
		} catch (err) {
			console.error(err);
			return fail(500, { message: 'Could not create new user.' });
		}

		const userToken = await generateToken({ email: email as string });
		cookies.set(tokenCookieName, userToken, { path: '/' });

		return {
			status: 201
		};
	},

	signInUserByEmailPassword: async ({ request, cookies }) => {
		const data = await request.formData();
		const submittedEmail = data.get('email') as string;
		const submittedPasswordHash = data.get('password') as string;

		// if a email/password combination wasnt provided, invalid request
		if (!(submittedEmail && submittedPasswordHash)) {
			return fail(400, { message: 'Invalid sign in request.' });
		}

		// if user submitted an email/password, check against db
		const userByEmail = await prisma.user.findUnique({
			where: {
				email: submittedEmail
			}
		});

		// if the email doesnt exist, return auth error
		if (!userByEmail) {
			return authError;
		}

		// if the email exists and password hashes match, generate a token and return it to the user
		if (userByEmail.passwordHash === submittedPasswordHash) {
			const userToken = await generateToken({ email: userByEmail.email });
			cookies.set(tokenCookieName, userToken, { path: '/' });
			return { status: 201 };
		}

		// if passwords dont match, return auth error
		else {
			return authError;
		}
	}
};