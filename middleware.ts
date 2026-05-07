import createMiddleware from 'next-intl/middleware';
 
export default createMiddleware({
  locales: ['hi-IN', 'kn-IN', 'ta-IN', 'te-IN', 'mr-IN', 'en-IN'],
  defaultLocale: 'en-IN',
  localePrefix: 'always'
});
 
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|_vercel|favicon.ico).*)',
  ]
};
