"use client";

import { FC } from "react";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { SwitchProps, useSwitch } from "@nextui-org/switch";
import { useTheme } from "next-themes";
import { useIsSSR } from "@react-aria/ssr";
import clsx from "clsx";
import { FiSun, FiMoon } from "react-icons/fi";

export interface ThemeSwitchProps {
	className?: string;
	classNames?: SwitchProps["classNames"];
}

export const ThemeSwitch: FC<ThemeSwitchProps> = ({
	className,
	classNames,
}) => {
	const { theme, setTheme } = useTheme();
	const isSSR = useIsSSR();

	const onChange = () => {
		theme === "light" ? setTheme("dark") : setTheme("light");
	};

	const {
		Component,
		slots,
		isSelected,
		getBaseProps,
		getInputProps,
		getWrapperProps,
	} = useSwitch({
		isSelected: theme === "light" || isSSR,
		"aria-label": `Switch to ${theme === "light" || isSSR ? "dark" : "light"} mode`,
		onChange,
	});

	return (
		<center>
			<Component
				{...getBaseProps({
					className: clsx(
						"px-px transition-opacity hover:opacity-80 cursor-pointer ",
						className,
						classNames?.base
					),
				})}
			>
				<VisuallyHidden>
					<input {...getInputProps()} />
				</VisuallyHidden>
				<div
					{...getWrapperProps()}
					className={slots.wrapper({
						class: clsx(
							[
								"h-auto w-auto",
								"bg-transparent",
								"rounded-lg",
								"flex items-center justify-center",
								"group-data-[selected=true]:bg-transparent",
								"!text-default-500",
								"pt-px",
								"px-0",
								"mx-0",
							],
							classNames?.wrapper
						),
					})}
				>
					{!isSelected || isSSR ? (
						<FiSun size={22} stroke="#e5de44" />
					) : (
						<FiMoon size={22} stroke="#1c375c" />
					)}
				</div>
			</Component>
		</center>
	);
};
