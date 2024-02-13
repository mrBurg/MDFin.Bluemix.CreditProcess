import { ensureDir, writeFile, existsSync } from 'fs-extra';
import path from 'path';
import each from 'lodash/each';
import { argv } from 'yargs';

import { TPrepareSQL } from './@types';

async function prepareSQL(data: { [key: string]: any }) {
  const dirName = './sql';
  const keys = [] as any[];

  const { ENV } = process.env;

  let fileName = `${dirName}/`;
  let sqlContent = '';
  let update = false;

  each((argv as TPrepareSQL)._, (i) => {
    switch (typeof i) {
      case 'string':
        keys.push(i);

        break;
      case 'number':
        update = !!i;

        break;
    }
  });

  await ensureDir(dirName);

  const [block, path] = keys;

  each(data, (item, index) => {
    if (path && path != index) {
      return;
    }

    each(item, (itemData, name) => {
      if (block && block != name) {
        return;
      }

      const sqlData = JSON.stringify(itemData, null, 2).replace(/'/gm, '\\"');

      sqlContent += [
        `\n\n--${name.toUpperCase()} [${index}]\n`,
        'INSERT INTO front.dir_translate (lang, block, path, value)',
        `VALUES ('${ENV?.toLowerCase()}', '${name}', '${index}', '${sqlData}')`,
        update
          ? [
              'ON CONFLICT (lang, block, path) DO UPDATE',
              'SET value = excluded.value;',
            ].join('\n')
          : 'ON CONFLICT DO NOTHING;',
      ].join('\n');
    });
  });

  fileName +=
    (() => {
      switch (true) {
        case !!(block && path):
          return `${block}_${path}`;
        case !!block:
          return block;
        default:
          return `static-data`;
      }
    })() + '.sql';

  writeFile(fileName, sqlContent, 'utf8', (err) => {
    if (err) {
      return console.log(err);
    }
    console.log(`=> \x1b[92mFile ${fileName} created\x1b[0m`);
  });
}

const staticDataEntryPoint = path.resolve(
  __dirname,
  './../server/staticData/index.js'
);

if (existsSync(staticDataEntryPoint)) {
  import(staticDataEntryPoint)
    .then(prepareSQL)
    .catch(() => console.log('\x1b[91mLocal static data not found\x1b[0m'));
} else {
  console.log('\x1b[91mLocal static data not found\x1b[0m');
}
