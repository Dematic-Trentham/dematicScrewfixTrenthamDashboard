import { useDraggable, useDroppable } from "@dnd-kit/core";

export function DropColumn({
	id,
	title,
	children,
}: {
	id: string;
	title: string;
	children?: ReactNode;
}) {
	const { setNodeRef, isOver } = useDroppable({
		id,
	});

	return (
		<div className="col flex h-full w-full flex-col items-center rounded bg-gray-300 lg:w-64">
			<div className="mb-2 w-full font-bold">{title}</div>

			<div
				ref={setNodeRef}
				className={`col flex w-full flex-wrap rounded p-2 ${
					isOver ? "bg-blue-100" : ""
				} items-center align-top`}
			>
				{children}
			</div>
		</div>
	);
}

import { CSS } from "@dnd-kit/utilities";
import { ReactNode } from "react";

export function DraggableItem({ id, bg }: { id: string; bg?: string }) {
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id,
	});

	const colours: Record<string, string> = {
		unknown: "bg-red-500",
		GTG: "bg-green-400",
		Service: "bg-yellow-400",
		Parts: "bg-blue-400",
	};
	const style = {
		transform: CSS.Translate.toString(transform),
	};

	return (
		<div
			ref={setNodeRef}
			className={`mb-2 h-16 w-16 cursor-grab touch-none rounded-2xl border p-2 align-middle shadow ${bg ? colours[bg] : "bg-red-500"} flex items-center justify-center`}
			style={style}
			{...listeners}
			{...attributes}
		>
			{id}
		</div>
	);
}
