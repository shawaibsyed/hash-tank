/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images:{
    domains: ['172.16.29.7', 'hashtank-backend-urtjok3rza-wl.a.run.app', 'localhost']
  }
}

module.exports = nextConfig
