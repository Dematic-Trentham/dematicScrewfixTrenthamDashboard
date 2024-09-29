import React from "react";
import { render, screen } from "@testing-library/react";

import "@testing-library/jest-dom/jest-globals";
import "@testing-library/jest-dom";
import PanelTop from "@/components/panels/panelTop";

describe("PanelTop Component", () => {
	test("Renders without crashing", () => {
		render(
			<PanelTop>
				<h1>content</h1>
			</PanelTop>
		);
		const panelElement = screen.getByRole("heading", { name: /content/i });

		expect(panelElement).toBeInTheDocument();
	});

	test("Renders children", async () => {
		render(
			<PanelTop>
				<div data-testid="panel-middle-content">content</div>
			</PanelTop>
		);
		const panelElement = await screen.findByTestId("panel-middle-content");

		expect(panelElement).toBeInTheDocument();
	});

	test("Add custom class", async () => {
		render(
			<PanelTop className="custom-class">
				<div data-testid="panel-middle-content">content</div>
			</PanelTop>
		);
		const panelElement = await (
			await screen.findByTestId("panel-middle-content")
		).parentElement?.parentElement;

		expect(panelElement).toHaveClass("custom-class");
	});

	test("Add title", async () => {
		render(
			<PanelTop title="Title">
				<div data-testid="panel-middle-content">content</div>
			</PanelTop>
		);
		const panelElement = await screen.findByText("Title");

		expect(panelElement).toBeInTheDocument();
	});

	test("Add topRight", async () => {
		render(
			<PanelTop
				title="Title"
				topRight={<div data-testid="top-right">Top Right</div>}
			>
				<div data-testid="panel-middle-content">content</div>
			</PanelTop>
		);
		const panelElement = await screen.findByTestId("top-right");

		expect(panelElement).toBeInTheDocument();
	});
});
