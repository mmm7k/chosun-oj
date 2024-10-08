/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/professor',
        destination: '/professor/dashboard',
        permanent: true,
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // 서버 사이드에서만 적용
      config.externals.push({
        ssh2: 'commonjs ssh2',
      }),
        config.module.rules.push({
          test: /\.node$/,
          use: 'ignore-loader',
        });
    }

    return config;
  },
};

export default nextConfig;
