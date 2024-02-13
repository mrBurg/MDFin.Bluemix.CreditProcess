import { argv } from 'yargs';
import { copySync, existsSync } from 'fs-extra';
import rimraf from 'rimraf';
import { TPrepare } from './@types';

const sqlPath = './sql';
const buildPath = './build';
const logsPath = './server/logs';
const envProductionLocalPath = './.env.production.local';

if (!(argv as TPrepare).t) {
  if (existsSync(logsPath)) {
    rimraf(logsPath, () =>
      console.log('=> \x1b[92mTemporary logs has been deleted\x1b[0m')
    );
  }
}

if (existsSync(sqlPath)) {
  rimraf(sqlPath, () =>
    console.log('=> \x1b[92mSQL scripts has been cleared\x1b[0m')
  );
}

if (existsSync(buildPath)) {
  rimraf(buildPath, () =>
    console.log('=> \x1b[92mBuild has been cleared\x1b[0m')
  );
}

switch (true) {
  case (argv as TPrepare).t:
    copySync('./env', './');

    break;
  case (argv as TPrepare).p:
    if (existsSync(envProductionLocalPath)) {
      rimraf(envProductionLocalPath, () =>
        console.log(
          '=> \x1b[92mEnv [\x1b[102m\x1b[30m .env.production.local \x1b[0m\x1b[92m] has been removed\x1b[0m'
        )
      );
    }

    break;
  default:
    if (existsSync(envProductionLocalPath)) {
      rimraf(envProductionLocalPath, () =>
        console.log(
          '=> \x1b[92mEnv [\x1b[102m\x1b[30m .env.production.local \x1b[0m\x1b[92m] has been removed\x1b[0m'
        )
      );
    }
}
