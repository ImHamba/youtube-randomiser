export const getMixesByUserId = async (userId: number): Promise<IUserMix[]> => {
	const dbMixes = await prisma.savedMixes.findMany({
		where: {
			userId: userId
		}
	});

	// map database results into an array of user mixes
	const userMixes: IUserMix[] = dbMixes.map((mixDbResult) => {
		{
			const mixData: IMix = JSON.parse(mixDbResult.mixData);
			return {
				mixId: mixDbResult.mixId,
				...mixData
			};
		}
	});

	return userMixes;
};

