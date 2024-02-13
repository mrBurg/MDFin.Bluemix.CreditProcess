const https = require('https');
const http = require('http');
const express = require('express');
const next = require('next');
const { readFileSync } = require('fs');
const cors = require('cors');

const {
  requestLogger,
  getNetworkInterface,
  updateDotenvConfig,
} = require('./utils');
const config = require('./routes/config');
const l10n = require('./routes/l10n');
const api = require('./routes/api');
// const testApi = require('./routes/testApi');
const abTesting = require('./routes/abTest');
const redirects = require('./routes/redirects');
const cfg = require('./config');

updateDotenvConfig();

const {
  ENVIRONMENT,
  HTTPS_SERVER_HOST,
  HTTPS_PORT,
  HTTP_SERVER_HOST,
  HTTP_PORT,
} = process.env;

const {
  URIS,
  environment: { dev, prod },
  PROTOCOL,
  certificate,
} = cfg;

const isDev = ENVIRONMENT == dev;
const isProd = ENVIRONMENT == prod;

const nextApp = next({ dev: isDev });
const handle = nextApp.getRequestHandler();

const serverCallback = ((err) => {
  return (protocol, host, port) => {
    if (err) {
      throw err;
    }

    console.log(
      `\x1b[92m${protocol} App ready on =>\n  host -> [\x1b[102m\x1b[30m ${host} \x1b[0m\x1b[92m]\n  port -> :[\x1b[102m\x1b[30m ${port} \x1b[0m\x1b[92m]\n\x1b[0m`
    );
  };
})();

// const textParser = [express|body].text({ type: 'text/html' });
// const urlencodedParser = [express|body].urlencoded({ extended: false });
// const rawParser = [express|body].raw({ type: 'application/vnd.custom-type' });
// const jsonParser = [express|body].json({ type: 'application/*+json' });

(async () => {
  await nextApp.prepare();

  const server = express();
  server
    .use(requestLogger(ENVIRONMENT))
    .use(cors())
    .use(redirects)
    .use(
      process.env.AB_ENABLED && Boolean(Number(process.env.AB_ENABLED))
        ? abTesting
        : (_req, _res, next) => next()
    )
    // .use(testApi)
    .use(l10n)
    .use(config)
    .use(api)
    .all(URIS.ALL, handle);

  if (!isProd) {
    const httpServer = http.createServer({ maxHeaderSize: 64555 }, server);

    httpServer.listen(
      HTTP_PORT,
      serverCallback(PROTOCOL.HTTP, HTTP_SERVER_HOST, HTTP_PORT)
    );
  }

  const httpsServer = https.createServer(
    {
      key: readFileSync(certificate.key, { encoding: certificate.encoding }),
      cert: readFileSync(certificate.cert, { encoding: certificate.encoding }),
      maxHeaderSize: 64555,
    },
    server
  );

  httpsServer.listen(
    HTTPS_PORT,
    serverCallback(PROTOCOL.HTTPS, HTTPS_SERVER_HOST, HTTPS_PORT)
  );

  const wrapper = (data) => `\n  \x1b[102m\x1b[30m${data}\x1b[0m\x1b[92m`;
  const hostsData = getNetworkInterface();
  let hosts = `${wrapper('["localhost"]')}`;

  for (let item in hostsData) {
    hosts += `${wrapper(JSON.stringify(hostsData[item]))}\x1b[0m\t ${item}`;
  }

  console.log(`\x1b[92mYour local IPs =>  ${hosts}\n\x1b[92m\n\x1b[0m`);
})();
