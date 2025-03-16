import * as React from "react";
import styled from "@emotion/styled";
import { css, Global } from "@emotion/react";

export interface DemoCanvasWidgetProps {
	color?: string;
	background?: string;
}

namespace S {
	export const Container = styled.div<{ color: string; background: string }>`
		height: 100%;

		background-size: 50px 50px;
		display: flex;

		> * {
			height: 100%;
			min-height: 100%;
			width: 100%;
		}
	`;

	export const Expand = css`
		html,
		body,
		#root {
			height: 100%;
		}
	`;
}

export class DemoCanvasWidget extends React.Component<
	React.PropsWithChildren<DemoCanvasWidgetProps>
> {
	render() {
		return (
			<>
				<Global styles={S.Expand} />
				<S.Container
					background={this.props.background || "rgb(60, 60, 60)"}
					color={this.props.color || "rgba(255,255,255, 0.05)"}
				>
					{this.props.children}
				</S.Container>
			</>
		);
	}
}
