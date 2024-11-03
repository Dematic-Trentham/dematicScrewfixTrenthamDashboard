import { useRouter } from "next/navigation";

export async function updateUrlParams(
	searchParams: URLSearchParams,
	router: ReturnType<typeof useRouter>,
	paramToUpdate: string,
	newValue: string
) {
	const params = new URLSearchParams(searchParams.toString());

	params.set(paramToUpdate, newValue);
	router.replace(`?${params.toString()}`);
}
