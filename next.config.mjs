/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "standalone",
	experimental: {
		serverActions: {
			allowedForwardedHosts: ["*"],
			allowedOrigins: ["*"],
		},
	},
};

export default nextConfig;
