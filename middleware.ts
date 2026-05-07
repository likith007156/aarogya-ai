import createMiddleware from 'next-intl/middleware';
 
export default createMiddleware({
  locales: ['hi-IN', 'kn-IN', 'ta-IN', 'te-IN', 'mr-IN', 'en-IN'],
  defaultLocale: 'en-IN'
});
 
export const config = {
  matcher: ['/', '/(hi-IN|kn-IN|ta-IN|te-IN|mr-IN|en-IN)/:path*']
};
