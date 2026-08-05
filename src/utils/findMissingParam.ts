export function findMissingParam(
	requiredParams: any[],
	providedParams: string | any[]
) {
	const missingParams = requiredParams.filter(
		(param: any) => !providedParams.includes(param)
	);

	return missingParams.length > 0 ? missingParams : null;
}

export function checkTypeOnObject(
	obj: { [x: string]: any },
	expectedTypes: { [x: string]: any }
) {
	const typeErrors = [];

	for (const key in expectedTypes) {
		if (typeof obj[key] !== expectedTypes[key]) {
			typeErrors.push(
				`Expected type of ${key} to be ${expectedTypes[key]} but received ${typeof obj[key]}`
			);
		}
	}

	return typeErrors.length > 0 ? typeErrors : null;
}

export function checkOjectForMissingKeys(obj: any, requiredKeys: any[]) {
	const missingKeys = requiredKeys.filter((key: string) => !(key in obj));

	return missingKeys.length > 0 ? missingKeys : null;
}

export function checkObjectForKeysAndTypes(
	obj: { [x: string]: any },
	requiredKeysAndTypes: {
		[x: string]: any;
		date?: DateConstructor;
		cellNumber?: NumberConstructor;
		ulType?: StringConstructor;
		xPosition?: NumberConstructor;
		yPosition?: NumberConstructor;
		rotation?: NumberConstructor;
		width?: NumberConstructor;
		height?: NumberConstructor;
		confidence?: NumberConstructor;
	}
) {
	const missingKeys = [];
	const typeErrors = [];

	for (const key in requiredKeysAndTypes) {
		if (!(key in obj)) {
			missingKeys.push(key);
		} else if (typeof obj[key] !== requiredKeysAndTypes[key]) {
			typeErrors.push(
				`Expected type of ${key} to be ${requiredKeysAndTypes[key]} but received ${typeof obj[key]}`
			);
		}
	}

	return {
		failed: missingKeys.length > 0 || typeErrors.length > 0,
		missingKeys: missingKeys.length > 0 ? missingKeys : null,
		typeErrors: typeErrors.length > 0 ? typeErrors : null,
	};
}
