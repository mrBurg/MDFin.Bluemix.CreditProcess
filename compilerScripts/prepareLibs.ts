import { exec } from 'child_process';
import rimraf from 'rimraf';
import { existsSync, copySync, readdir } from 'fs-extra';
import each from 'lodash/each';
import size from 'lodash/size';

const libsSrcPath = 'src/libs/public';
const libsPath = './public/libs';
const vendorLibs = [
  {
    name: 'fingerprintjs.js',
    path: 'node_modules/@fingerprintjs/fingerprintjs/dist/fp.js',
  },
];

function addLibs() {
  each(vendorLibs, (item) => {
    copySync(item.path, `${libsPath}/${item.name}`);
  });

  readdir(libsSrcPath, (err, files) => {
    if (!err && size(files)) {
      exec('tsc --project tsconfig.libs.json', (err) => {
        if (err) {
          console.log(err);
        }
      });
    }
  });
}

if (existsSync(libsPath)) {
  rimraf(libsPath, () => {
    console.log('=> \x1b[92mLibs has been cleared\x1b[0m');

    addLibs();
  });
} else {
  addLibs();
}
