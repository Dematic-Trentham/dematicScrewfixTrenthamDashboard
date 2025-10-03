import Spinner from "@/components/visual/spinner";

export default function Home() {
	return (
		<div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
			<div className="rounded-sm shadow-lg">
				<div className="flex items-center justify-center pt-2">
					<div>Please Select From the side bar</div>
				</div>
				<div className="p-36">
					<Spinner />
				</div>
			</div>
		</div>
	);
}
