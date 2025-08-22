import createMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'
import { NextRequest } from 'next/server'

const intlMiddleware = createMiddleware(routing)

export default function combinedMiddleware(req: NextRequest) {
  // Apply internationalization middleware to all internationalized paths
  return intlMiddleware(req)
}

// Match only the specific paths for both middlewares
export const config = {
  matcher: [
    '/', // Root path for internationalization
    '/(ar|en)/:path*', // Match all paths under '/de' and '/en' for internationalization
  ],
  exclude: ['/campaign/form/:path*'],
}
