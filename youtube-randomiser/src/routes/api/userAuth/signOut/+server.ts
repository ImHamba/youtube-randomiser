import { tokenCookieName } from '$lib/misc/localKeys.js';
import { json } from '@sveltejs/kit';

export const POST = async ({ cookies }) => {
	// console.log(cookies.get(tokenCookieName));
	cookies.delete(tokenCookieName, { path: '/' });
	// console.log(cookies.get(tokenCookieName));
	return json({ message: 'Signed out successfully.' }, { status: 201 });
};
