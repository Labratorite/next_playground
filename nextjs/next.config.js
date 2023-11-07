/** @type {import('next').NextConfig} */
const nextConfig = {
/* config options here */
  // https://github.com/sequelize/sequelize/issues/7509
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['sequelize'],
    instrumentationHook: true
  }
}

module.exports = nextConfig;

const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
