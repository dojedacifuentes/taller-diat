import type { NextConfig } from 'next';

/**
 * La Clase 1 dejó de organizarse en diez bloques y pasó a cinco etapas de
 * ejecución. Los enlaces y QR impresos que apuntan a las rutas antiguas siguen
 * llevando a alguna parte útil en lugar de morir en un 404.
 */
const class1LegacyRedirects: { from: string; to: string }[] = [
  { from: '/clase-1/b00', to: '/clase-1' },
  { from: '/clase-1/b01', to: '/clase-1' },
  { from: '/clase-1/b02', to: '/clase-1' },
  { from: '/clase-1/b03', to: '/clase-1/prompt' },
  { from: '/clase-1/b04', to: '/clase-1/prompt' },
  { from: '/clase-1/b05', to: '/clase-1/auditoria' },
  { from: '/clase-1/b06', to: '/clase-1/verificacion' },
  { from: '/clase-1/b07', to: '/clase-1/verificacion' },
  { from: '/clase-1/b08', to: '/clase-1/verificacion' },
  { from: '/clase-1/b09', to: '/clase-1/cierre' },
  { from: '/clase-1/mi-trabajo', to: '/clase-1/cierre' },
  { from: '/clase-1/manual', to: '/glosario' },
];

const nextConfig: NextConfig = {
  async redirects() {
    return class1LegacyRedirects.map(({ from, to }) => ({
      source: from,
      destination: to,
      permanent: false,
    }));
  },
};

export default nextConfig;
