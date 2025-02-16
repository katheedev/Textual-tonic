/** @type {import('next').NextConfig} */
const API_URL = process.env.API_URL
const nextConfig = {
  reactStrictMode: true,
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/:path*`, // Proxy to Backend
      },
    ]
  },
}

module.exports = nextConfig