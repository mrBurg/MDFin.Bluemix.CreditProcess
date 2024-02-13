const fs = require('fs-extra');

module.exports = class CopyFiles {
  constructor(config) {
    this.config = config;
  }

  apply(compiler) {
    compiler.hooks.compile.tap('beforeRun', (compilation) => {
      const { from, to, callBack } = this.config;

      fs.copySync(from, to, callBack);
    });
  }
};
