import createNextIntlMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';

const intlMiddleware = createNextIntlMiddleware({
  locales: ['hi-IN', 'kn-IN', 'ta-IN', 'te-IN', 'mr-IN', 'en-IN'],
  defaultLocale: 'en-IN'
});

export function proxy(request: NextRequest) {
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|test|.*\\..*).*)',]
};
