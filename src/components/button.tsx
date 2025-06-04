import React from "react";

type ButtonColor = "red" | "blue" | "black" | "yellow" | "orange" | "green";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	color?: ButtonColor;
	children: React.ReactNode;
}

const colorClasses: Record<ButtonColor, string> = {
	red: "bg-red-600 text-white hover:bg-red-700",
	blue: "bg-blue-600 text-white hover:bg-blue-700",
	black: "bg-black text-white hover:bg-gray-800",
	yellow: "bg-yellow-400 text-black hover:bg-yellow-500",
	orange: "bg-orange-500 text-white hover:bg-orange-600",
	green: "bg-green-600 text-white hover:bg-green-700",
};

export const Button: React.FC<ButtonProps> = ({
	color = "blue",
	children,
	className = "",
	...props
}) => (
	<div>
		<button
			className={`rounded px-4 py-2 font-semibold transition-colors focus:outline-none ${colorClasses[color]} ${className}`}
			{...props}
		>
			{children}
		</button>
	</div>
);

export default Button;
