/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Development-specific configuration
  serverExternalPackages: ['better-sqlite3'],
  
  // Use Turbopack for development (Next.js 16 default)
  turbopack: {
    // Empty configuration to enable Turbopack without warnings
  },
}

export default nextConfig