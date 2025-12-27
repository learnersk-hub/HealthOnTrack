#!/usr/bin/env node

// Netlify build script to handle environment-specific setup

console.log('🚀 Starting Netlify build process...')
console.log('📋 Node.js version:', process.version)
console.log('📋 Required: Node.js >= 20.9.0 for Next.js 16')

// Verify Node version
const nodeVersion = process.version.slice(1) // Remove 'v' prefix
const [major, minor, patch] = nodeVersion.split('.').map(Number)
const requiredMajor = 20
const requiredMinor = 9

if (major < requiredMajor || (major === requiredMajor && minor < requiredMinor)) {
  console.error('❌ Node.js version too old!')
  console.error(`   Current: ${process.version}`)
  console.error(`   Required: >= v20.9.0`)
  console.error('   Please update Node.js version in .nvmrc or Netlify settings')
  process.exit(1)
}

// Set environment variables for Netlify
process.env.NETLIFY = 'true'
process.env.NODE_ENV = 'production'

console.log('✅ Node.js version check passed')
console.log('✅ Environment configured for Netlify')
console.log('📦 Building Next.js application...')

// The actual build will be handled by Next.js
console.log('🎉 Netlify build configuration complete!')