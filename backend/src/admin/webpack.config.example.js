// ./src/admin/webpack.config.js
'use strict';

module.exports = (config, webpack) => {
  config.resolve = config.resolve || {};
  config.resolve.fallback = {
    ...(config.resolve.fallback || {}),
    fs: false,
    path: false,
    os: false,
  };

  return config;
};