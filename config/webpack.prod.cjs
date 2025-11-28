const multiconfig = require('./webpack.common.cjs');

multiconfig.forEach(config => {
  config.mode = 'production';
});

module.exports = multiconfig;
