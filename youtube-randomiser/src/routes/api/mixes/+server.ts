import { checkForIdenticalMix, maximumSavedMixesLimit } from '$lib/misc/mixesUtil.js';
import { getUserByEmail } from '$lib/server/dbUtils.js';
import { getMixesByUserId } from '$lib/server/mixesServerUtil.js';
import { decodeToken, validateToken } from '$lib/server/userAuthentication';
import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export const GET = async ({ cookies }) => {
	const tokenValidation = await validateToken(cookies);
	if (!tokenValidation.valid) return tokenValidation.response;

	const token = tokenValidation.response;

	// get all mixes previously saved by the user
	const tokenData = decodeToken(token);
	const user = await getUserByEmail(tokenData.email);
	const userId = user?.userId;

	if (!userId) {
		return json({ message: 'Invalid token, user does not exist.' }, { status: 401 });
	}

	const savedMixes = await getMixesByUserId(userId);

	return json({ message: savedMixes }, { status: 201 });
};

export const POST = async ({ cookies, request }) => {
	const newMix: IMix = await request.json();
	if (!newMix) {
		console.log(400);
		return json('Invalid request, no mix provided.', { status: 400 });
	}

	const tokenValidation = await validateToken(cookies);
	if (!tokenValidation.valid) return tokenValidation.response;

	const token = tokenValidation.response;

	// get all mixes previously saved by the user
	const tokenData = decodeToken(token);
	const user = await getUserByEmail(tokenData.email);
	const userId = user?.userId;

	if (!userId) {
		return json({ message: 'Invalid token, user does not exist.' }, { status: 401 });
	}

	const existingSavedMixes = await getMixesByUserId(userId);

	if (existingSavedMixes.length >= maximumSavedMixesLimit) {
		return json({ message: 'Maximum mix limit reached.' }, { status: 403 });
	}

	// check that an identical mix doesnt already exist
	const identicalMixExists = checkForIdenticalMix(newMix, existingSavedMixes);
	if (identicalMixExists) {
		console.log(409);
		return json({ message: 'Identical saved mix already exists.' }, { status: 409 });
	}

	try {
		await prisma.savedMixes.create({
			data: {
				userId: userId,
				mixData: JSON.stringify(newMix)
			}
		});
	} catch (err) {
		console.error(err);
		return json({ message: 'Could not save mix.' }, { status: 500 });
	}

	console.log(201);
	return json('Mix saved successfully.', { status: 201 });
};

export const DELETE = async ({ cookies, request }) => {
	const mixId: number = await request.json();
	if (!mixId) {
		console.log(400);
		return json('Invalid request, no mix id provided.', { status: 400 });
	}

	const tokenValidation = await validateToken(cookies);
	if (!tokenValidation.valid) return tokenValidation.response;

	const token = tokenValidation.response;

	// get all mixes previously saved by the user
	const tokenData = decodeToken(token);
	const user = await getUserByEmail(tokenData.email);
	const userId = user?.userId;

	if (!userId) {
		return json({ message: 'Invalid token, user does not exist.' }, { status: 401 });
	}

	await prisma.savedMixes.delete({
		where: {
			mixId: mixId,
			userId: userId
		}
	});

	return json({ message: 'Mix delete successfully.' }, { status: 201 });
};
