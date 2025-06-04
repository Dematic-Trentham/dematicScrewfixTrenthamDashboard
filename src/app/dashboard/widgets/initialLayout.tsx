import React from "react";

import { PanelWidget } from "./blankWidget";

import Button from "@/components/button";

const GRID_COLS = 8;
const GRID_ROWS = 5;

type DragGridProps = {
	layout: PanelWidget[];
	setLayout: React.Dispatch<React.SetStateAction<PanelWidget[]>>;
};

const DragGrid: React.FC<DragGridProps> = ({ layout, setLayout }) => {
	const [draggedId, setDraggedId] = React.useState<string | null>(null);
	const [dragPos, setDragPos] = React.useState<{ x: number; y: number } | null>(
		null
	);

	React.useEffect(() => {
		const interval = setInterval(() => {
			// Loop through all widgets and update their content
			layout.forEach((widget) => {
				if (widget.updateContent) {
					widget.updateContent().catch((err) => {
						console.error(`Error updating widget ${widget.title}:`, err);
					});
				}
			});
		}, 5000);

		return () => clearInterval(interval);
	}, []);

	const handleDrop = (x: number, y: number, draggedId: string) => {
		const widget = layout.find((w) => w.title === draggedId);

		if (!widget) return;

		// Check if the drop position is within the grid bounds
		if (x < 0 || x >= GRID_COLS || y < 0 || y >= GRID_ROWS) return;

		// Check if the target cell is already occupied
		const existingWidget = getWidgetAt(x, y);

		if (existingWidget) return;

		// Check if the widget fits in the grid at the new position
		if (x + widget.w > GRID_COLS || y + widget.h > GRID_ROWS) return;

		// Update the widget's position
		// Move the widget using its updateXY method to preserve class instance

		console.log(widget);

		const newWidget = widget.updateXY(x, y);

		setLayout((prev) =>
			prev.map((w) => (w.title === draggedId ? newWidget : w))
		);

		setDraggedId(null);
		setDragPos(null);
	};

	const getWidgetAt = (x: number, y: number) =>
		layout.find((w) => x >= w.x && x < w.x + w.w && y >= w.y && y < w.y + w.h);

	const deleteWidget = (title: string) => {
		setLayout((prev) => prev.filter((w) => w.title !== title));
	};

	const gridCells = [];

	for (let y = 0; y < GRID_ROWS; y++) {
		for (let x = 0; x < GRID_COLS; x++) {
			const widget = getWidgetAt(x, y);

			if (widget && widget.x === x && widget.y === y) {
				gridCells.push(
					<div
						key={`widget-${widget.title}`}
						draggable
						style={{
							gridColumn: `${x + 1} / span ${widget.w}`,
							gridRow: `${y + 1} / span ${widget.h}`,
							border: "1px solid #ccc",
							borderRadius: "8px",
							padding: "12px",
							background: "#eeeeee",
							boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
							color: "#000",
							cursor: "grab",
							position: "relative",
							zIndex: 2,
							opacity: draggedId === widget.title ? 0.3 : 1,
						}}
						onDrag={(e) => {
							if (draggedId === widget.title && e.clientX && e.clientY) {
								setDragPos({ x: e.clientX, y: e.clientY });
							}
						}}
						onDragEnd={() => {
							setDraggedId(null);
							setDragPos(null);
						}}
						onDragStart={(e) => {
							setDraggedId(widget.title);
							setDragPos({ x: e.clientX, y: e.clientY });
							e.dataTransfer.setData("text/plain", widget.title);
							// Hide default drag image
							const img = document.createElement("div");

							img.style.display = "none";
							document.body.appendChild(img);
							e.dataTransfer.setDragImage(img, 0, 0);
						}}
					>
						<div style={{ position: "relative" }}>
							<strong>{widget.title}</strong>
							<button
								aria-label="Clear widget"
								style={{
									position: "absolute",
									top: 0,
									right: 0,
									width: 24,
									height: 24,
									background: "transparent",
									border: "none",
									cursor: "pointer",
									color: "#888",
									fontWeight: "bold",
									fontSize: 18,
									lineHeight: "24px",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									transition: "color 0.2s",
								}}
								type="button"
								onBlur={(e) => (e.currentTarget.style.color = "#888")}
								onClick={() => deleteWidget(widget.title)}
								onFocus={(e) => (e.currentTarget.style.color = "#e00")}
								onMouseOut={(e) => (e.currentTarget.style.color = "#888")}
								onMouseOver={(e) => (e.currentTarget.style.color = "#e00")}
							>
								&#10005;
							</button>
							<div>{widget.content}</div>
						</div>
					</div>
				);
			} else if (!widget) {
				gridCells.push(
					<div
						key={`cell-${x}-${y}`}
						style={{
							gridColumn: x + 1,
							gridRow: y + 1,
							border: "1px dashed #bbbbbb05",
							borderRadius: "8px",
							minHeight: "40px",
							background: "#fafafa10",
							zIndex: 1,
						}}
						onDragOver={(e) => e.preventDefault()}
						onDrop={(e) => {
							const draggedId = e.dataTransfer.getData("text/plain");

							handleDrop(x, y, draggedId);
						}}
					/>
				);
			}
		}
	}

	const draggedWidget = layout.find((w) => w.title === draggedId);

	return (
		<div>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
					gridTemplateRows: `repeat(${GRID_ROWS}, 150px)`,
					gap: "16px",
					marginTop: "2px",
					position: "relative",
				}}
			>
				{gridCells}
			</div>
			{draggedWidget && dragPos && (
				<div
					style={{
						position: "fixed",
						pointerEvents: "none",
						left: dragPos.x + 8,
						top: dragPos.y + 8,
						width: `calc(${draggedWidget.w} * (100vw / ${GRID_COLS}) - 16px)`,
						minWidth: 120,
						background: "#eeeeee",
						border: "2px solid #888",
						borderRadius: "8px",
						padding: "12px",
						boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
						zIndex: 9999,
						opacity: 0.85,
						color: "#000",
					}}
				>
					<strong>{draggedWidget.title}</strong>
					<div>{draggedWidget.content}</div>
				</div>
			)}

			<div
				style={{
					position: "absolute",
					right: 24,
					bottom: 4,
					display: "flex",
					flexDirection: "row",
					gap: "8px",
				}}
			>
				<Button
					onClick={() => {
						console.log("layout", layout);

						// Only save serializable properties (exclude 'content')
						const serializableLayout = layout.map(({ title, x, y, w, h }) => ({
							title,
							x,
							y,
							w,
							h,
						}));

						localStorage.setItem(
							"dashboardLayout",
							JSON.stringify(serializableLayout)
						);
					}}
				>
					Save Layout
				</Button>
				<Button
					onClick={() => {
						//setLayout(initialLayout);
					}}
				>
					Reset Layout
				</Button>
			</div>
		</div>
	);
};

export default DragGrid;
