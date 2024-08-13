"use client";
import React, { createContext, useContext, ReactNode } from "react";
import { toast, ToastOptions } from "react-toastify";
import { useTheme } from "next-themes";

interface ToastContextProps {
	addToast: (message: string, options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const { theme } = useTheme();

	const addToast = (message: string, options: ToastOptions) => {
		const id = new Date().getTime();

		//add default options
		options = {
			...options,
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			position: "bottom-right",
			theme: theme === "dark" ? "dark " : "light",
		};

		//setToastList((prevList) => [...prevList, { id, message, options }]);

		toast(message, { ...options, toastId: id });
	};

	return (
		<ToastContext.Provider value={{ addToast }}>
			{children}
		</ToastContext.Provider>
	);
};

export const useToast = (): ToastContextProps => {
	const context = useContext(ToastContext);

	if (context === undefined) {
		throw new Error("useToast must be used within a ToastProvider");
	}

	return context;
};

export default ToastContext;
