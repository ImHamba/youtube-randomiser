export const restringify = (obj: any) => {
	return JSON.parse(JSON.stringify(obj));
};

export const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));
