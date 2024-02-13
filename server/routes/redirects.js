const express = require('express');

const cfg = require('../config');
const { updateDotenvConfig } = require('./../utils');

updateDotenvConfig();

const { ENVIRONMENT } = process.env;
const { URIS, httpStatus, environment } = cfg;

const isDev = ENVIRONMENT == environment.dev;

const router = express.Router();

router
  .all(URIS.DEV, (_req, res, next) => {
    if (!isDev) {
      res.redirect(httpStatus.movedPermanently, URIS.ROOT);
    }

    next();
  })
  /* .all(withExt(ALL), (req, res) => {
      res.redirect(
        httpStatus.movedPermanently,
        req.originalUrl.replace(new RegExp(extension.join('|')), '')
      );
    }) */
  .all(URIS.INDEX, (_req, res) =>
    res.redirect(httpStatus.movedPermanently, URIS.ROOT)
  );

module.exports = router;
