const path = require("path");

module.exports = function override(config) {
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      "react-refresh/runtime.js": path.resolve(
        __dirname,
        "node_modules/react-refresh/runtime.js"
      ),
    },
  };
  return config;
};
