export async function TimePromise<T>(
	promise: Promise<T>,
	functionName?: string
): Promise<{ time: number; result: T; functionName?: string }> {
	const start = performance.now();
	const result = await promise;
	const end = performance.now();

	console.log(functionName, "took", end - start, "ms");

	return { time: end - start, result, functionName };
}
