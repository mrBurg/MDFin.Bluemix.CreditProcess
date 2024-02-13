const sitemap = require('nextjs-sitemap-generator');

module.exports = class Sitemap {
  changefreqTypes = {
    ALWAYS: 'always',
    HOURLY: 'hourly',
    DAILY: 'daily',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
    YEARLY: 'yearly',
    NEVER: 'never',
  };

  defaultConfig = {
    // nextConfigPath: path.resolve(__dirname, '../', 'next.config.js'),
    ignoredPaths: [
      'index',
      '404',
      'activity',
      'application',
      'campaign',
      'client',
      'credit-line',
      'deal',
      'dev',
      'goal',
      'inprocess',
      'librapayResult',
      'notify',
      'personalinformation',
      'sendmoney',
      'validateleadredirect',
      'wrongaccount',
      'wrongaccount',
      '_next',
      'start',
      'sign-in',
      'sign-up',
    ],
    extraPaths: ['/'],
    pagesConfig: {
      '/': {
        priority: '1.0',
        changefreq: this.changefreqTypes.MONTHLY,
      },
      '/credit-online-urgent': {
        priority: '0.8',
        changefreq: this.changefreqTypes.MONTHLY,
      },
      '/credit-instant-pe-card': {
        priority: '0.8',
        changefreq: this.changefreqTypes.MONTHLY,
      },
      '/credit-nebancar-prin-telefon': {
        priority: '0.8',
        changefreq: this.changefreqTypes.MONTHLY,
      },
      '/credit-10000-lei': {
        priority: '0.8',
        changefreq: this.changefreqTypes.MONTHLY,
      },
      '/credit-5000-lei': {
        priority: '0.8',
        changefreq: this.changefreqTypes.MONTHLY,
      },
      '/credite-nebancare-pe-termen-lung': {
        priority: '0.8',
        changefreq: this.changefreqTypes.MONTHLY,
      },
      '/credit-ifn-online': {
        priority: '0.8',
        changefreq: this.changefreqTypes.MONTHLY,
      },
      '/credite-pe-termen-scurt': {
        priority: '0.8',
        changefreq: this.changefreqTypes.MONTHLY,
      },
      '/microcredite': {
        priority: '0.8',
        changefreq: this.changefreqTypes.MONTHLY,
      },
      '/credit-rapid-online-fara-acte': {
        priority: '0.8',
        changefreq: this.changefreqTypes.MONTHLY,
      },
      '/credit-fara-dobanda': {
        priority: '0.8',
        changefreq: this.changefreqTypes.MONTHLY,
      },
      '/credit-cu-buletinul-online': {
        priority: '0.8',
        changefreq: this.changefreqTypes.MONTHLY,
      },
      '/credit-6000-lei': {
        priority: '0.8',
        changefreq: this.changefreqTypes.MONTHLY,
      },
      '/faq': {
        priority: '0.6',
        changefreq: this.changefreqTypes.MONTHLY,
      },
      '/about-loan': {
        priority: '0.6',
        changefreq: this.changefreqTypes.MONTHLY,
      },
      '/repayment': {
        priority: '0.6',
        changefreq: this.changefreqTypes.MONTHLY,
      },
      '/hot-summer-draw': {
        priority: '0.6',
        changefreq: this.changefreqTypes.MONTHLY,
      },
      '/prize-race-contest': {
        priority: '0.6',
        changefreq: this.changefreqTypes.MONTHLY,
      },
      '/vespa-contest': {
        priority: '0.6',
        changefreq: this.changefreqTypes.MONTHLY,
      },
      '/hollydays-happy-draw': {
        priority: '0.6',
        changefreq: this.changefreqTypes.MONTHLY,
      },
      '/contacts': {
        priority: '0.4',
        changefreq: this.changefreqTypes.MONTHLY,
      },
      '/privacy-policy': {
        priority: '0.4',
        changefreq: this.changefreqTypes.MONTHLY,
      },
    },
  };

  constructor(config) {
    this.params = Object.assign({}, config, this.defaultConfig);
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tap('afterEmit', (_compilation) => {
      sitemap(this.params);
    });
  }
};
