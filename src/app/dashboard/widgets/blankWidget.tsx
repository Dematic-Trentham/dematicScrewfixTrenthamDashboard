export class PanelWidget {
	title: string = "Panel Widget";
	content: React.ReactNode = (<p>Panel Widget Content</p>);
	h: number = 1;
	w: number = 1;
	x: number = 1;
	y: number = 1;
	updateContent: (this: PanelWidget) => Promise<PanelWidget>;

	// Optional: You can add a unique identifier if needed

	constructor(
		updateContent: (this: PanelWidget) => Promise<PanelWidget>,
		h?: number,
		w?: number
	) {
		this.updateContent = updateContent;
		if (h !== undefined) this.h = h;
		if (w !== undefined) this.w = w;
	}

	updateXY(x: number, y: number): PanelWidget {
		this.x = x;
		this.y = y;

		return this;
	}

	updateTitle(title: string): PanelWidget {
		this.title = title;

		return this;
	}
}
