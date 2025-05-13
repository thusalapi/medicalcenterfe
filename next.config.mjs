/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Removed static export to enable API proxy
  images: {
    domains: ['localhost'],
  },
  // Enable CSS processing
  webpack: (config) => {
    return config;
  },
  // API proxy to Spring Boot backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
    ];
  },
};

export default nextConfig;
