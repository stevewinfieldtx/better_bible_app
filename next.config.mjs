/** @type {import('next').NextConfig} */
const nextConfig = { 
  reactStrictMode: true,
  // Exclude mobile app folder from web build
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
};
export default nextConfig;
