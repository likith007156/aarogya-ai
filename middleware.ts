import createMiddleware from 'next-intl/middleware';
import {routing} from '@/i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',
    // Set a cookie to remember the previous locale for all requests that have a locale prefix
    '/(hi-IN|kn-IN|ta-IN|te-IN|mr-IN|en-IN)/:path*',
    // Enable redirects that add the locale prefix for all other non-API paths
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};
