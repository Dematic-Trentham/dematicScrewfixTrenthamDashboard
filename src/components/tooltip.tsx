import React, { useState, useRef, useEffect } from "react";

interface TooltipProps {
	children: React.ReactNode;
	button: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ children, button }) => {
	const [visible, setVisible] = useState(false);
	const tooltipRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleResize = () => {
			if (tooltipRef.current) {
				const { right, bottom } = tooltipRef.current.getBoundingClientRect();

				if (right > window.innerWidth) {
					tooltipRef.current.style.left = `${window.innerWidth - right}px`;
				}
				if (bottom > window.innerHeight) {
					tooltipRef.current.style.top = `${window.innerHeight - bottom}px`;
				}
			}
		};

		if (visible) {
			window.addEventListener("resize", handleResize);
			handleResize();
		} else {
			window.removeEventListener("resize", handleResize);
		}

		return () => window.removeEventListener("resize", handleResize);
	}, [visible]);

	return (
		<div
			style={{ position: "relative", display: "inline-block" }}
			onBlur={() => setVisible(false)}
			onFocus={() => setVisible(true)}
			onMouseOut={() => setVisible(false)}
			onMouseOver={() => setVisible(true)}
		>
			<div>{button}</div>
			{visible && (
				<div
					ref={tooltipRef}
					style={{
						position: "absolute",
						zIndex: 1000,
						backgroundColor: "white",
						border: "1px solid black",
						padding: "10px",
						boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
					}}
				>
					{children}
				</div>
			)}
		</div>
	);
};

export default Tooltip;
