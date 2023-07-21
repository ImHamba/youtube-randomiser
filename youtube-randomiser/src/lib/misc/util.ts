export const restringify = (obj: any) => {
	return JSON.parse(JSON.stringify(obj));
};

export const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

// shuffle list randomly
export const shuffleArray = <T>(array: Array<T>) => {
	let newArr = [...array];
	newArr.sort(() => Math.random() - 0.5);
	return newArr;
};

// move an element in an array from one index to another
export const arrayMoveElement = <T>(arr: Array<T>, fromIndex: number, toIndex: number) => {
	let newArr: Array<T> = [];
	if (fromIndex < toIndex) {
		newArr = newArr.concat(
			arr.slice(0, fromIndex),
			arr.slice(fromIndex + 1, toIndex),
			[arr[fromIndex]],
			arr.slice(toIndex)
		);
	} else {
		newArr = newArr.concat(
			arr.slice(0, toIndex),
			[arr[fromIndex]],
			arr.slice(toIndex, fromIndex),
			arr.slice(fromIndex + 1)
		);
	}
	return newArr;
};

export const checkUnorderedEquality = <T>(arr1: Array<T>, arr2: Array<T>) => {
	// check if lengths are equal
	if (arr1.length != arr2.length) {
		return false;
	}

	// given lengths are equal, then check if each element of array 1 is in array 2
	return arr1.every((e1) => {
		//note: this cannot handle differently ordered nested arrays even if arrays have the same elements
		return arr2.some((e2) => JSON.stringify(e2) == JSON.stringify(e1));
	});
};
