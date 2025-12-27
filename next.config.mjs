/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Updated for Next.js 16 compatibility
  serverExternalPackages: ['better-sqlite3'],
  
  // Turbopack configuration for Next.js 16
  turbopack: {
    // Configure Turbopack to handle external packages
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
  },
}

export default nextConfig
