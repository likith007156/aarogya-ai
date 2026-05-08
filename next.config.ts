import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Prevent heavy packages from being bundled into serverless functions.
  // They will be required at runtime from node_modules instead.
  serverExternalPackages: [
    'twilio',
    '@prisma/client',
    'prisma',
    '@google/generative-ai',
    'openai',
    'groq-sdk',
  ],
};

export default withNextIntl(nextConfig);
