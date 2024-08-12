import Panel from "@/components/panels/panelMiddle";
import Spinner from "@/components/visual/spinner";

export default function Home() {
	return (
		<div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
			<Panel className="h-56 w-56">
				<Spinner>
					<span className="visually-hidden" />
				</Spinner>
			</Panel>
		</div>
	);
}
