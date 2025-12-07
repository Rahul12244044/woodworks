/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['res.cloudinary.com', 'localhost'],
    unoptimized: true,
  },
}

module.exports = nextConfig