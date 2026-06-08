import { useDraggable, useDroppable } from "@dnd-kit/core";

import { shuttleLocation, shuttleLocationEnum } from "../../_types/shuttle";

import Link from "next/link";
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
		<div className="col flex h-full w-full flex-col items-center rounded-xl rounded-t-2xl bg-gray-300 p-2 text-center lg:w-56">
			<div className="w-full pb-2 font-bold">{title}</div>

			<div
				ref={setNodeRef}
				className={`col flex min-h-32 w-full flex-wrap items-center justify-center gap-2 ${
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

export function DraggableItem({
	id,
	bg,
	highlight,
	shuttle,
	currentSearchTime,
}: {
	id: string;
	bg?: string;
	highlight?: string;
	shuttle: shuttleLocation;
	currentSearchTime?: string;
}) {
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id,
	});

	const colours: Record<string, string> = {
		unknown: "bg-red-500",
		[shuttleLocationEnum.GTG]: "bg-green-400",
		[shuttleLocationEnum.Service]: "bg-yellow-400",
		[shuttleLocationEnum.Parts]: "bg-blue-400",
		[shuttleLocationEnum.Investigation]: "bg-pink-400",
		[shuttleLocationEnum.AisleTestingRequired]: "bg-lime-600",
		highlightNot: "bg-violet-500",
		highlight: "bg-lime-500 animate-pulse speed-25",
	};
	const style = {
		transform: CSS.Translate.toString(transform),
	};

	let bgLocal = bg;

	if (highlight != "") {
		bgLocal = "highlightNot";
		if (id.toLowerCase().includes(highlight?.toLowerCase() || "")) {
			bgLocal = "highlight";
		}
	}

	return (
		<div
			ref={setNodeRef}
			className={`h-16 w-16 cursor-grab touch-none overflow-hidden rounded-2xl border border-black align-middle shadow ${bgLocal ? colours[bgLocal] : "bg-red-500"} flex items-center justify-center`}
			style={style}
			{...listeners}
			{...attributes}
		>
			<Link
				href={
					"/dashboard/shuttles/locations/" +
					shuttle.macAddress.replaceAll(" ", "") +
					"?currentSearchTime=" +
					(currentSearchTime || "1")
				}
			>
				{id}
			</Link>
		</div>
	);
}
