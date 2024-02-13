const path = require('path');
// const _ = require('lodash');

const { Sitemap } = require('./plugins');
const cfg = require('./config.json');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
});

// const redirectPages = ['/index', '/contacts'];

module.exports = withBundleAnalyzer({
  distDir: 'build',
  env: {
    ENVIRONMENT: process.env.ENVIRONMENT,
    PO_PROJECT_HOST: process.env.PO_PROJECT_HOST,
    PO_API: process.env.PO_API,
    PO_API_HOST: process.env.PO_API_HOST,
    PO_API_PORT: process.env.PO_API_PORT,
    ACCESS_TOKEN_KEY: process.env.ACCESS_TOKEN_KEY,
    REFRESH_TOKEN_KEY: process.env.REFRESH_TOKEN_KEY,
    SESSION_ID_KEY: process.env.SESSION_ID_KEY,
    EXTERNAL_SESSION_KEY: process.env.EXTERNAL_SESSION_KEY,
    FINGER_PRINT_KEY: process.env.FINGER_PRINT_KEY,
    LOCALE_KEY: process.env.LOCALE_KEY,
    RECOGNID: process.env.RECOGNID,
    API_KEY: process.env.API_KEY,
    SECRET_KEY: process.env.SECRET_KEY,
    AB_ENABLED: process.env.AB_ENABLED,
  },
  pageExtensions: ['tsx'],
  /* async redirects() {
    return _.reduce(
      redirectPages,
      (accum, item) => {
        accum.push({
          source: `${item}(.x?html):slug*`,
          destination: `${item}:slug*`,
          permanent: true,
          basePath: false,
        });

        return accum;
      },
      []
    );
  }, */
  /* async headers() {
    return [
      {
        source: '/(.*)',
        headers: [],
      },
    ];
  }, */
  i18n: {
    locales: cfg.locales,
    defaultLocale: cfg.defaultLocale,
    domains: [
      {
        domain: cfg.domain,
        defaultLocale: cfg.defaultLocale,
      },
    ],
    localeDetection: false,
  },
  webpack(baseConfig, _options) {
    const { PO_PROJECT_HOST, PO_PROJECT_PORT } = this.env;
    const { module = {} } = baseConfig;

    const config = {
      ...baseConfig,
      module: {
        ...module,
        //noParse: /jquery|lodash/,
        // noParse: /lodash/,
        // noParse: /moment/,
        rules: [...(module.rules || [])],
      },
    };

    config.module.rules = [
      ...config.module.rules,
      {
        test: /\.pot?$/,
        use: ['json-loader', 'po-gettext-loader'],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              svgo: false,
            },
          },
        ],
      },
    ];

    config.resolve.alias = {
      ...config.resolve.alias,
      normalize: 'normalize.css/normalize.css',
    };

    config.plugins = [
      ...config.plugins,
      new Sitemap({
        baseUrl: PO_PROJECT_PORT
          ? `${PO_PROJECT_HOST}:${PO_PROJECT_PORT}`
          : PO_PROJECT_HOST,
        pagesDirectory: path.resolve(__dirname, 'pages'),
        targetDirectory: path.resolve(__dirname, 'public'),
      }),
    ];

    // console.log(config, options);
    return config;
  },
});
