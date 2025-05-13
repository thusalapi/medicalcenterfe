/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // Enable static exports
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true, // Better for static hosting
  // Enable CSS processing
  webpack: (config) => {
    return config;
  },
  // Note: Cannot use rewrites with 'output: export'
  // API proxy is commented out since we're using static export
  /* 
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
    ];
  },
  */
};

export default nextConfig;
