import { checkUnorderedEquality } from './util';

export const checkForIdenticalMix = (newMix: IMix, existingMixes: IMix[]) => {
	// check that an identical mix doesnt already exist
	const existingMix = existingMixes.find((e) => {
		return checkUnorderedEquality(e.mixData, newMix.mixData);
	});

	if (existingMix) return true;
	else return false;
};

export const maximumSavedMixesLimit = 10;
