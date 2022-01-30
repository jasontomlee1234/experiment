// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    SERVER_KEY: process.env.SERVER_KEY,
    HOST: process.env.HOST,
  }
};
