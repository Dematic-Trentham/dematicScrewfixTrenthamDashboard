/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "standalone",
	experimental: {
		serverActions: {
			allowedForwardedHosts: ["*"],
			allowedOrigins: ["*"],
		},
	},
	reactStrictMode: false,
};

export default nextConfig;
