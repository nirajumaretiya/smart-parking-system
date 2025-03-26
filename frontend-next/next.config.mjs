/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
      {
        source: '/login',
        destination: 'http://localhost:5000/login',
      },
      {
        source: '/logout',
        destination: 'http://localhost:5000/logout',
      },
    ];
  },
};

export default nextConfig; 