import createNextIntlPlugin from 'next-intl/plugin'
import { type NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const config: NextConfig = {
  experimental: {
    // reactCompiler: true,
  },
  // Proxy API requests during development to avoid CORS issues.
  // Ensure you set API_URL in your .env.local, e.g. API_URL=http://localhost:5000/
  async rewrites() {
    const apiUrl = process.env.API_URL ? String(process.env.API_URL).replace(/\/$/, '') : undefined
    if (!apiUrl) {
      // No API_URL configured — do not add rewrites to avoid invalid destinations.
      return []
    }
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/:path*`,
      },
    ]
  },
  images: {
    domains: [
      'avatars.githubusercontent.com', // GitHub avatars
      'lh3.googleusercontent.com', // Google avatars
    ],
  },
}

export default withNextIntl(config)
