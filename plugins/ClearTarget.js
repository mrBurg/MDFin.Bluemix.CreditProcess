const rimraf = require('rimraf');

module.exports = class ClearTarget {
  constructor(config) {
    this.config = config;
  }

  apply(compiler) {
    compiler.hooks.compile.tap('beforeRun', (compilation) => {
      const { target } = this.config;

      rimraf(target, () =>
        console.log('=> \x1b[92mTarget has been cleared\x1b[0m')
      );
    });
  }
};
