import React from "react";
import { render, screen } from "@testing-library/react";

import "@testing-library/jest-dom/jest-globals";
import "@testing-library/jest-dom";
import PanelMiddle from "@/components/panels/panelMiddle";

describe("PanelMiddle Component", () => {
	test("Renders without crashing", () => {
		render(
			<PanelMiddle>
				<h1>content</h1>
			</PanelMiddle>
		);
		const panelElement = screen.getByRole("heading", { name: /content/i });

		expect(panelElement).toBeInTheDocument();
	});

	test("Renders children", async () => {
		render(
			<PanelMiddle>
				<div data-testid="panel-middle-content">content</div>
			</PanelMiddle>
		);
		const panelElement = await screen.findByTestId("panel-middle-content");

		expect(panelElement).toBeInTheDocument();
	});

	test("Add custom class", async () => {
		render(
			<PanelMiddle className="custom-class">
				<div data-testid="panel-middle-content">content</div>
			</PanelMiddle>
		);
		const panelElement = await (
			await screen.findByTestId("panel-middle-content")
		).parentElement?.parentElement;

		expect(panelElement).toHaveClass("custom-class");
	});

	test("Add title", async () => {
		render(
			<PanelMiddle title="Title">
				<div data-testid="panel-middle-content">content</div>
			</PanelMiddle>
		);
		const panelElement = await screen.findByText("Title");

		expect(panelElement).toBeInTheDocument();
	});

	test("Add topRight", async () => {
		render(
			<PanelMiddle topRight={<div data-testid="top-right">top right</div>}>
				<div data-testid="panel-middle-content">content</div>
			</PanelMiddle>
		);
		const panelElement = await screen.findByTestId("top-right");

		expect(panelElement).toBeInTheDocument();
	});
});
