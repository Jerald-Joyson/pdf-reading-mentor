/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Configure any Next.js specific features here
    images: {
      domains: ['placeholder.com'], // Add any image domains you need
    },
    // Webpack configuration if needed
    webpack: (config, { isServer }) => {
      // Required for pdf.js to work properly
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
          path: false,
        };
      }
      return config;
    },
  };
  
  module.exports = nextConfig;