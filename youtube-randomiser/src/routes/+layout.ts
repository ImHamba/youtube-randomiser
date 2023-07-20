import { browser } from '$app/environment';
import { tokenLSKey, validateToken } from '$lib/misc/userAuthenticationPublic.js';

export function load() {
	return validateToken();
}
