const { NODE_ENV } = require("./env");

// spell-checker:ignore displayname
const commonPlugins = ["add-react-displayname"];

module.exports = {
  plugins: {
    development: [...commonPlugins, "react-hot-loader/babel"],
    production: [...commonPlugins],
    test: [...commonPlugins],
  }[NODE_ENV],
  presets: ["@babel/preset-env", "@babel/preset-react"],
};
