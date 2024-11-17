import * as React from "react";

interface ErrorBoundaryState {
	hasError: boolean;
}

interface ErrorBoundaryProps {
	children: React.ReactNode;
}

class ErrorBoundary extends React.Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	state: any;
	props: any;
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	render() {
		if (this.state.hasError) {
			return (
				<div>
					<h2>Oops, there is an error!</h2>
					<button
						type="button"
						onClick={() => this.setState({ hasError: false })}
					>
						Try again?
					</button>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
