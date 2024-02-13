const express = require('express');

const { makeLocalApiUri, updateDotenvConfig } = require('../utils');
const cfg = require('../config');

updateDotenvConfig();

const { URIS } = cfg;

const router = express.Router();

router.get('/list', (req, res, next) => {
  const { query } = req;

  if (query.key == 'po.partner.iframe') {
    return res.json({
      iframeName: 'horacredit_frm',
      hostname: 'http://localhost',
      iframeURL: '/externals/iframe',
    });
  }

  next();
});

module.exports = express.Router().use(makeLocalApiUri(URIS.CONFIG), router);
