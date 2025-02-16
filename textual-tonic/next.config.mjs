/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'https://textualtonic-acb67657f3a6.herokuapp.com/:path*' // Proxy to Backend
        }
      ]
    }
  }
  

export default nextConfig;
