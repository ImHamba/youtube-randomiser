import { validateTokenWithServer } from '$lib/misc/userAuthenticationPublic.js';
import type { RequestEvent } from './$types';

export const load = async (event: RequestEvent) => {
	const showDemo = event.url.searchParams.get('demo') == 'true';

	// console.log('abc');
	const loginData: ILoginData = await validateTokenWithServer(event.fetch);

	const savedUserMixesRes = await event.fetch('/api/mixes', { method: 'GET' });

	let savedUserMixes: IUserMix[] = [];
	if (savedUserMixesRes.status == 201) {
		({ message: savedUserMixes } = await savedUserMixesRes.json());
		console.log(savedUserMixes);
	}
	return { loginData: loginData, savedUserMixes: savedUserMixes, showDemo: showDemo };
};
