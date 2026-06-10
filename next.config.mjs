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
	//compress: false,
	productionBrowserSourceMaps: true,
	compiler: {
		removeConsole: false,
	},
	// ...
	/**
	 * @param {import('webpack').Configuration} webpackConfig
	 * @returns {import('webpack').Configuration}
	 */
	//webpack(webpackConfig) {
	//	return {
	//		...webpackConfig,
	//optimization: {
	//	minimize: false,
	//},
	//	};
	//},
};

const { randomUUID } = require("crypto");
const fs = require("fs");
const path = require("path");

const buildId = randomUUID();

fs.writeFileSync(
	path.join(__dirname, "build-info.json"),
	JSON.stringify({ buildId }, null, 2)
);

module.exports = {
	env: {
		NEXT_PUBLIC_BUILD_ID: buildId,
	},
};

export default nextConfig;
