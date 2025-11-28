const multiconfig = require('./webpack.common.cjs');

multiconfig.forEach(config => {
  config.mode = 'development';
  config.devtool = 'inline-source-map';
});

module.exports = multiconfig;
