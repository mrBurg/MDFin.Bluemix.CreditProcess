const express = require('express');
const reduce = require('lodash/reduce');

const cfg = require('../config');
const { updateDotenvConfig } = require('../utils');

updateDotenvConfig();

const { URIS, httpStatus } = cfg;

const router = express.Router();

router.all(
  new RegExp(`(${URIS.ROOT}|${URIS.REDESIGN})$`, 'g'),
  (req, res, next) => {
    const { query, /* cookies, */ headers, _parsedUrl } = req;
    let searchData = _parsedUrl.search ?? '';
    let cookies = {};

    if (headers.cookie) {
      cookies = reduce(
        headers.cookie.split(' '),
        (accum, item) => {
          const [key, val] = item.split('=');

          accum[key] = val;

          return accum;
        },
        cookies
      );
    }

    if (cookies.utm && Boolean(cookies.utm)) {
      const utmData = Buffer.from(cookies.utm, 'base64').toString('utf8');
      const utm_content = new URL(utmData).searchParams.get('utm_content');

      if (utm_content == query.utm_content) {
        switch (true) {
          case _parsedUrl.pathname == '/' && query.utm_content == 'main':
          case _parsedUrl.pathname == '/redesign' &&
            query.utm_content.startsWith('redesign'):
            return next();
        }
      }
    }

    res.redirect(
      httpStatus.temporaryRedirect,
      URIS.API + URIS.GOAL_CHECK + searchData
    );
  }
);

module.exports = router;
