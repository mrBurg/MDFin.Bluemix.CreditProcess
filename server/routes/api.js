// const { default: axios } = require('axios');
const express = require('express');
const { ensureDir, writeFile } = require('fs-extra');

const cfg = require('./../config');
const {
  jsonToQueryString,
  makeLocalApiUri,
  warningMessage,
  updateDotenvConfig,
} = require('./../utils');

updateDotenvConfig();

const { /* ORIGIN_API_HOST, */ PO_API_HOST } = process.env;
const { URIS, httpStatus } = cfg;

const router = express.Router();

router.post('/createsql', (req, res) => {
  warningMessage(req);

  const { data, params } = req.body;
  const dirName = './sql';
  const sqlData = JSON.stringify(data, null, 2).replace(/'/gm, '\\"');

  ensureDir(dirName)
    .then(() =>
      writeFile(
        `${dirName}/${params.block}_${params.path}.sql`,
        [
          `\n\n--${params.block.toUpperCase()}\n`,
          'INSERT INTO front.dir_translate (lang, block, path, value)',
          `VALUES ('ro', '${params.block}', '${params.path}', '${sqlData}')`,
          'ON CONFLICT (lang, block, path) DO UPDATE',
          'SET value = excluded.value;',
        ].join('\n'),
        'utf8',
        (err) => {
          if (err) {
            console.log(err);
          }

          console.log(
            `=> \x1b[92mFile ./sql/${params.block}_${params.path}.sql created\x1b[0m`
          );
        }
      )
    )
    .catch((error) => console.log(error));

  res.end();
});

router.get(URIS.GOAL_CHECK, (req, res) => {
  warningMessage(req);

  const utm_content = Math.random() > 0 /* 0.5 */ ? 'main' : 'redesign';
  const { query } = req;
  const refererData = {
    main: '/',
    redesign: '/redesign',
  };
  const queryString = jsonToQueryString({ ...query, utm_content });
  const cookieOptions = ['Version=1', 'Path=/', 'Secure', 'SameSite=None'];

  // aHR0cHM6Ly90ZXN0aG9yYXJlYWN0LmZpbm1kdGVzdC5jb20/dXRtX2NvbnRlbnQ9bWFpbg== /main
  // aHR0cHM6Ly90ZXN0aG9yYXJlYWN0LmZpbm1kdGVzdC5jb20vcmVkZXNpZ24/dXRtX2NvbnRlbnQ9cmVkZXNpZ24= /redesign

  return res
    .set('Set-Cookie', [
      [
        `utm=${Buffer.from(`${PO_API_HOST}${queryString}`).toString('base64')}`,
        ...cookieOptions,
      ].join(';'),
      /* [`SESSIONID=${Math.trunc(Math.random() * 9e6)}`, ...cookieOptions].join(
          ';'
        ), */
    ])
    .redirect(
      httpStatus.temporaryRedirect,
      refererData[utm_content] + queryString
    );
});

// router.all('/*', async (req, res, next) => {
//   warningMessage(req);

//   // console.log(`\n\x1b[31m${ORIGIN_API_HOST}\x1b[0m\n`);

//   const request = await axios(ORIGIN_API_HOST + req.originalUrl, {
//     method: req.method,
//     headers: req.headers,
//   });

//   if (request.data) {
//     return res.set(request.headers).send(request.data);
//   }

//   next();
// });

module.exports = express.Router().use(makeLocalApiUri(), router);
