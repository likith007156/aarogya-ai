export { default } from 'next-intl/middleware';

export const config = {
  locales: ['en-IN', 'hi-IN', 'kn-IN', 'ta-IN', 'te-IN', 'mr-IN'],
  defaultLocale: 'en-IN',
  matcher: ['/', '/(en-IN|hi-IN|kn-IN|ta-IN|te-IN|mr-IN)/:path*']
};
