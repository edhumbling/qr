/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Confirms static export
  images: {
    unoptimized: true, // Required for static export
  },
}

module.exports = nextConfig 