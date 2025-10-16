/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects() {
    return [
      {
        source: "/",
        destination: "/home",
        permanent: false, // ou false, se preferir um redirecionamento temporário (302)
      },
    ];
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
  output: "standalone",
};

export default nextConfig;
