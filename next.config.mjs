import { fileURLToPath } from 'node:url';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Activa Tailwind CSS v4 en Turbopack
  turbopack: {
    // Raíz del proyecto (hay otro package-lock.json en tu carpeta de usuario que confunde a Next)
    root: fileURLToPath(new URL('.', import.meta.url)),
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: '**' },
    ],
  },
};

export default nextConfig;
