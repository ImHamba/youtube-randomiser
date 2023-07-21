export const getUserByEmail = async (userEmail: string): Promise<IServerUserData | null> => {
	const userByEmail = await prisma.user.findUnique({
		where: {
			email: userEmail
		}
	});

	// if user doesnt exist, return empty array
	if (!userByEmail) {
		return null;
	}

	return userByEmail;
};
