import "@/styles/globals.css";
import { Metadata, Viewport } from "next";

import { Providers } from "./providers";

import { ToastProvider as ToastContextProvider } from "@/context/ToastContext";
import ToastProvider from "@/components/ToastProvider";
import { siteConfig } from "@/config/site";
import Sidebar from "@/components/sidebar/sidebar";
import Topbar from "@/components/topbar/topbar";

export const metadata: Metadata = {
	title: {
		default: siteConfig.name,
		template: `%s - ${siteConfig.name}`,
	},
	description: siteConfig.description,
	icons: {
		icon: "/favicon.ico",
	},
};

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html suppressHydrationWarning lang="en">
			<head />

			<body className="antialiased">
				<Providers
					themeProps={{ attribute: "class", defaultTheme: "dark", children }}
				>
					<ToastContextProvider>
						<ToastProvider>
							<div className="duration-5000 flex h-screen bg-gray-200 text-black transition-all dark:bg-slate-500 dark:text-slate-100">
								<Sidebar />
								{/* Main content */}
								<div className="y-auto flex flex-1 flex-col overflow-auto">
									<Topbar />

									<div className="flex flex-1 flex-col p-4">{children}</div>
								</div>
							</div>
						</ToastProvider>
					</ToastContextProvider>
				</Providers>
			</body>
		</html>
	);
}
