import type { NextConfig } from "next";
import { loadEnvFromSSM } from './src/lib/loadEnv';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

export default async (): Promise<NextConfig> => {
  const ssmEnv = await loadEnvFromSSM();

  const nextConfig: NextConfig = {
    env: {
      PORT: '3001',
      ...ssmEnv,
    },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**',
        },
        {
          protocol: 'http',
          hostname: '**',
        },
      ],
      dangerouslyAllowSVG: true,
      contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
  };

  return withNextIntl(nextConfig);
};