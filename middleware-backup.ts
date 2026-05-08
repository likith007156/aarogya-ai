import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en-IN', 'hi-IN', 'kn-IN', 'ta-IN', 'te-IN', 'mr-IN'],
  defaultLocale: 'en-IN',
  localePrefix: 'always'
});

export const config = {
  matcher: ['/', '/(en-IN|hi-IN|kn-IN|ta-IN|te-IN|mr-IN)/:path*']
};
