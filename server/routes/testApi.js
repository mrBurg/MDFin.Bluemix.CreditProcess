const express = require('express');
const path = require('path');
const reduce = require('lodash/reduce');

const cfg = require('./../config');
const {
  logger,
  generateUId,
  getText,
  getRandom,
  makeLocalApiUri,
  warningMessage,
  updateDotenvConfig,
} = require('../utils');

updateDotenvConfig();

const { ENVIRONMENT } = process.env;

const router = express.Router();

router.get('/external_tracking', (req, res, next) => {
  warningMessage(req);

  const { query } = req;

  if (query.new_id == 1) {
    return res.send({
      external_session_id: Math.round(Math.random() * 999999999).toString(),
    });
  }

  if (query.u) {
    return res.send({
      status: 'ok',
    });
  }

  next();
});

router.get('/trackingapi', (req, res, next) => {
  warningMessage(req);

  const { query } = req;

  console.log(query);

  if (query) {
    return res.send({
      status: 'ok',
      query,
    });
  }

  next();
});

router.post('/trackingapi_logger', (req, res) => {
  warningMessage(req);

  const { body } = req;
  // res.setHeader('Content-Type', 'application/json');

  if (!(body.fp && body.fp_components && body.fp2 && body.fp2_comp)) {
    logger(ENVIRONMENT)({
      url: body.url,
      session_id: body.session_id,
      JSESSIONID: body.JSESSIONID,
      session_page_info_id: body.session_page_info_id,
      referrer: body.referrer,
      action: body.action,
      fp: body.fp,
      fp2: body.fp2,
    });
  }

  return res.send({
    status: 'ok',
  });
});

router.get('/loyalty/message', (req, res) => {
  warningMessage(req);

  return res.json({
    message: `Promoție!!! Numai până la <accent>${
      100 + Math.ceil(Math.random() * 900)
    }</accent>! Adu un prieten și primiți câte 50 de lei fiecare!`,
  });
});

function fillAcc() {
  const id = generateUId(count, 1e3);

  paymentTokens.push({
    id,
    index: count,
    name: generateUId(1e15),
  });

  selectedPaymentTokenId = id;
}

const paymentTokens = [];
let selectedPaymentTokenId = null;
let count = 0;
const accBody = {
  AMOUNT: '0.00',
  CURRENCY: 'RON',
  ORDER: getRandom(10000, true),
  DESC: getText(2),
  TERMINAL: getRandom(1000000, true),
  EMAIL: '',
  TRTYPE: getRandom(100, true),
  TIMESTAMP: Date.now(),
  NONCE: generateUId(1e15),
  BACKREF: 'http://localhost/librapayResult',
  M_INFO:
    'eyJicm93c2VyTGFuZ3VhZ2UiOiJydS1SVSIsImJyb3dzZXJTY3JlZW5IZWlnaHQiOiIxNDQwIiwiYnJvd3NlckNvbG9yRGVwdGgiOiIyNCIsImhvbWVQaG9uZSI6eyJjYyI6IjQwIiwic3Vic2NyaWJlciI6Ijc5OTk5MDAzMCJ9LCJjYXJkaG9sZGVyTmFtZSI6IkFuY2EgRW1hbnVlbGEgUG9wZXNjdSIsImJyb3dzZXJKYXZhRW5hYmxlZCI6ImZhbHNlIiwiYnJvd3NlclNjcmVlbldpZHRoIjoiMjU2MCIsImJyb3dzZXJJUCI6IjM3LjExNS4xNDcuMTYwIiwiYnJvd3NlclRaIjoiLTE4MCIsImJyb3dzZXJVc2VyQWdlbnQiOiJNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXaW42NDsgeDY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMTE0LjAuMC4wIFNhZmFyaS81MzcuMzYiLCJicm93c2VyQWNjZXB0SGVhZGVyIjoiaW1hZ2UvYXZpZixpbWFnZS93ZWJwLGltYWdlL2FwbmcsaW1hZ2Uvc3ZnK3htbCxpbWFnZS8qLCovKjtxPTAuOCJ9',
  CLIENT_ID: generateUId(1e5),
  P_SIGN: generateUId(1e63),
};
const date = new Date().toISOString();

for (; count < 3; count++) {
  fillAcc();
}

router.get('/cabinet/application', (req, res) => {
  warningMessage(req);

  return res.json({
    loanProposal: {
      agreeLoan: true,
      agreeDeclaration: true,
      marketingConfirmation: false,
      agreeFeis: true,
      dateFrom: date,
      dateTo: date,
      payment: getRandom(1e3),
      paymentDate: date,
      contract: generateUId(1e6),
      amount: getRandom(1e4),
      interestAmount: getRandom(1e3),
      totalAmount: getRandom(1e4),
      term: getRandom(1e3, true),
      termFraction: 'D',
      apr: getRandom(1e2, true),
      upsellEnabled: false,
    },
    documentUnits: [
      {
        type_id: getRandom(20, true),
        type: getText(1),
        index: 0,
        valid: true,
        full: true,
        documents: [
          {
            id: generateUId(count, 1e4),
            index: 0,
            filename: getText(5),
            url: '/po/api/attachment/get?h=e5035b565561c1a8c8c848d56d698a254b6b1a4534bbbdb1fd8eb2a32bf2a2b4',
            icon: '/po/api/resources/pdf.png',
          },
        ],
      },
    ],
    paymentTokenUnit: {
      paymentTokens,
      selectedPaymentTokenId,
      editable: true,
      holiday: false,
    },
    email: {
      email_id: 0,
      emailConfirmed: false,
    },
    notification: getText(20),
    onWizard: true,
    flow: 'wizard',
    status: 'OK',
  });
});

router.post('/payment/addCard', (req, res) => {
  warningMessage(req);

  const { body } = req;

  res.json({
    status: cfg.httpStatus.ok,
    request: {
      url: '/librapayResult',
      method: 'redirect',
      body: reduce(
        accBody,
        (accum, item, key) => (accum.push(`${key}=${item}`), accum),
        []
      ).join('&'),
      ...body.result,
    },
  });
});

router.post('/libra-iframe', (req, res) => {
  warningMessage(req);

  fillAcc();
  count++;

  // eslint-disable-next-line no-undef
  res.sendFile(path.join(__dirname, './../tpl/libra-iframe.html'));
});

router.post('/processCard', (_req, res) => {
  console.log('processCard');

  res.redirect('/librapayResult');
});

router.post('/payment/librapayAddCardResult', (_req, res) => {
  console.log('librapayAddCardResult');

  res.end();
});

router.get('/ekyc/info', (req, res) => {
  warningMessage(req);

  return res.json({
    info: {
      request_id: '152',
      webhook_url: 'https://testhorareact.finmdtest.com/po/api/ekyc/webhook',
      language: 'ro',
      stages: ['LivenessDetection', 'IDDocVerification'],
      apiKey: 'Basic aG9yYWNyZWRpdDpLTDhVbjFXaEdHb2kzUDlW',
      // apiKey: 'Basic bWRmaW46cXdlcnR5MTIzNDU=',
    },
  });
});

router.all('/goal/nj', (req, res) => {
  warningMessage(req);

  let resData = {};

  switch (req.method) {
    case cfg.method.get:
      resData = { needNinja: true };

      break;
    case cfg.method.post:
      resData = { status: cfg.httpStatus.ok };
  }

  res.send(resData);
});

module.exports = express.Router().use(makeLocalApiUri(), router);
