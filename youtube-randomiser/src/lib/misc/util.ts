export const restringify = (obj: any) => {
	return JSON.parse(JSON.stringify(obj));
};
