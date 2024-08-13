import { FC, ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ToastProviderProps {
	children: ReactNode;
}

const ToastProvider: FC<ToastProviderProps> = ({ children }) => (
	<>
		<ToastContainer />
		{children}
	</>
);

export default ToastProvider;
