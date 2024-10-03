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
	

	  // ...
  /**
   * @param {import('webpack').Configuration} webpackConfig
   * @returns {import('webpack').Configuration}
   */
  webpack(webpackConfig) {
    return {
      ...webpackConfig,
      optimization: {
        minimize: false,
      },
    };
  },}

export default nextConfig;
