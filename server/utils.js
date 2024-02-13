const expressWinston = require('express-winston');
const winston = require('winston');
const { networkInterfaces } = require('os');
const each = require('lodash/each');
const isBoolean = require('lodash/isBoolean');
const isString = require('lodash/isString');
const map = require('lodash/map');
const crypto = require('node:crypto').webcrypto;
const dotenv = require('dotenv');
const args = require('yargs').argv;

const cfg = require('./config');

const {
  URIS,
  logger,
  environment: { paths, prod, test, dev },
  extension,
} = cfg;

function getLoggerFileProps(level) {
  return {
    maxsize: 5242880,
    maxFiles: 5,
    colorize: false,
    filename: `./server/logs/${level}.log`,
    level,
  };
}

function getLoggerConfig(level) {
  return {
    transports: [
      new winston.transports.Console({
        colorize: true,
        level,
      }),
    ],
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'MMM-DD-YYYY HH:mm:ss',
      }),
      winston.format.printf(
        (info) => `${[info.timestamp]}: ${info.level}: ${info.message}`
      )
    ),
    ignoreRoute: (req) =>
      new RegExp(logger.ignoredUrls.join('|')).test(req.originalUrl),
  };
}

module.exports = {
  updateDotenvConfig() {
    dotenv.config({ path: paths.common });
    dotenv.config({
      path: (() => {
        switch (true) {
          case args.t:
            return paths.test;
          case args.p:
            return paths.prod;
          default:
            return paths.dev;
        }
      })(),
    });
  },

  requestLogger(env) {
    const loggerDataInfo = getLoggerConfig(logger.level.info);
    const loggerDataWarn = getLoggerConfig(logger.level.warn);

    switch (env) {
      case prod:
        return (_req, _res, next) => next();
      case test:
        return [
          expressWinston.logger(loggerDataInfo),
          expressWinston.errorLogger(loggerDataWarn),
        ];
      case dev:
        loggerDataInfo.transports.push(
          new winston.transports.File(getLoggerFileProps(logger.level.info))
        );

        loggerDataWarn.transports.push(
          new winston.transports.File(getLoggerFileProps(logger.level.warn))
        );

        return [
          expressWinston.logger(loggerDataInfo),
          expressWinston.errorLogger(loggerDataWarn),
        ];
      default:
        throw new Error(
          '\x1b[92m### Environment variables not received ###\x1b[0m'
        );
    }
  },

  logger(env) {
    switch (env) {
      case test:
      case dev:
        return (data) => {
          const { url, ...restData } = data;

          return winston
            .createLogger({
              transports: [
                new winston.transports.File({
                  ...getLoggerFileProps(logger.level.verbose),
                  filename: `./server/logs/trackingapi.log`,
                }),
              ],
              format: winston.format.combine(
                winston.format.timestamp({
                  format: 'MMM-DD-YYYY HH:mm:ss',
                }),
                winston.format.printf(
                  (info) =>
                    `${[info.timestamp]}: ${url}\n{\n\t${(() => {
                      const result = [];

                      for (const item in Object.entries(info.message)) {
                        const [key, value] = item;

                        if (Object.hasOwnProperty.call(info.message, key)) {
                          result.push(`"${key}" : "${value}"`);
                        }
                      }

                      return result.join('\n\t');
                    })()}\n}`
                )
              ),
              ignoreRoute: (req) =>
                new RegExp(logger.ignoredUrls.join('|')).test(req.originalUrl),
            })
            .info(restData);
        };
      default:
        return () => void 0;
    }
  },

  withExt(route, ext = `(${extension.join('|')})`) {
    return route + ext;
  },

  async fetchTemporaryData(params) {
    const { block, path } = params;
    let staticDataResult = {};

    await import('./staticData/index.js')
      .then((data) => {
        const { default: staticData } = data;

        try {
          staticDataResult = staticData[path][block];
        } catch (err) {
          console.log(
            '\x1b[91mThese keys are missing in local static data \x1b[0m'
          );
        }

        return;
      })
      .catch(() => console.log('\x1b[91mLocal static data not found\x1b[0m'));

    if (!Object.keys(staticDataResult)) {
      console.log('\x1b[91mLocales not found\x1b[0m');
    }

    return staticDataResult;
  },

  makeLocalApiUri(data = '') {
    return URIS.API + data;
  },

  getNetworkInterface() {
    const interfaces = networkInterfaces();
    const results = Object.create(null);

    for (const [name, value] of Object.entries(interfaces)) {
      for (const net of value) {
        if (net.family === 'IPv4' && !net.internal) {
          if (!results[name]) {
            results[name] = [];
          }

          results[name].push(net.address);
        }
      }
    }

    return results;
  },

  /**
   * @param  {...any} args
   * @default 1e7-1e3-4e3-8e3-1e11
   */
  generateUId(...args) {
    let res = args.join('');

    if (!res) {
      res = [1e7, -1e3, -4e3, -8e3, -1e11].join('');
    }

    return res.replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  },

  getRandom(data, int) {
    if (int) {
      return Math.trunc(Math.random() * data);
    }

    return Math.trunc(Math.random() * data * 100) / 100;
  },

  getText(data) {
    const words =
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus tempora aut id nam repudiandae delectus magni illum, eius non magnam qui. Enim est saepe ullam delectus qui error, dolorum tenetur!';

    if (!data) {
      return words;
    }

    const text = words.split(' ');

    text.length = data;

    return text.join(' ');
  },

  jsonToQueryString(json, ...restProps) {
    let encode = false;
    let symbol = '?';

    each(restProps, (item) => {
      switch (true) {
        case isBoolean(item):
          encode = item;

          break;
        case isString(item):
          symbol = item;

          break;
      }
    });

    return (
      symbol +
      map(json, (value, key) => {
        if (!value) {
          return false;
        }

        if (encode) {
          key = encodeURIComponent(key);
          value = encodeURIComponent(value);
        }

        return `${key}=${value}`;
      })
        .filter((value) => value)
        .join('&')
    );
  },

  warningMessage(req, message = '') {
    console.log(
      `\n\x1b[31m${message || 'Request to middleware server'}\x1b[0m ${
        req.originalUrl
      }\n`
    );
  },
};
