const path = require('path');

const dedicatedEndPoint = 'https://tixs.infura-ipfs.io';
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      dedicatedEndPoint,
      'tixs.infura-ipfs.io',
    ],
  },
  env: {
    BASE_URL: process.env.BASE_URL,
  },
};
module.exports = nextConfig;

// module.exports = {
//   reactStrictMode: true,
//   webpack: (config) => {
//     // eslint-disable-next-line no-param-reassign
//     config.resolve.alias['@'] = path.resolve(__dirname);
//     return config;
//   },
// };

