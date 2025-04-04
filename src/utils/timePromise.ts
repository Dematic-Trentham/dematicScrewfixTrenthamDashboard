export async function TimePromise<T>(
	promise: Promise<T>
): Promise<{ time: number; result: T }> {
	const start = performance.now();
	const result = await promise;
	const end = performance.now();

	return { time: end - start, result };
}
