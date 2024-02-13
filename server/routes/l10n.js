const express = require('express');

const {
  fetchTemporaryData,
  makeLocalApiUri,
  warningMessage,
  updateDotenvConfig,
} = require('../utils');
const cfg = require('../config');

updateDotenvConfig();

const { URIS } = cfg;

const router = express.Router();

router.get('/list', async (req, res) => {
  warningMessage(req);

  res.json(await fetchTemporaryData(req.query));
});

module.exports = express.Router().use(makeLocalApiUri(URIS.L10N), router);
