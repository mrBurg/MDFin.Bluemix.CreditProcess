import { TJSON } from '@interfaces';
import { SIZE } from '@src/constants';
import { TGetBrowserData } from './@types';
import cssData from '@scss/service/constants.module.scss';
import { root } from '@utils';

enum BROWSER_NAME {
  SAMSUNG_BROWSER = 'samsung-browser',
  YANDEX_BROWSER = 'yandex-browser',
  IE = 'ie',
  TRIDENT = 'trident',
  EDGE = 'edge',
  OPERA_IOS = 'opera-ios',
  OPERA_MINI = 'opera-mini',
  OPERA_PRESTO = 'opera-presto',
  OPERA = 'opera',
  FIREFOX_IOS = 'firefox-ios',
  FIREFOX = 'firefox',
  CHROME_IOS = 'chrome-ios',
  CHROME = 'chrome',
  SAFARI = 'safari',
  UNNAMED = 'unnamed',
  UNSUPPORTED = 'unsupported',
}

export class Browser {
  public agent = navigator.userAgent;
  public ignoredBrowsers = [BROWSER_NAME.OPERA_IOS, BROWSER_NAME.OPERA_MINI];
  public name = (() => {
    let name = '';

    switch (true) {
      //SamsungBrowser
      case !!~this.agent.search(/SamsungBrowser/):
        name = BROWSER_NAME.SAMSUNG_BROWSER;
        break;
      //YaBrowser
      case !!~this.agent.search(/YaBrowser/):
        name = BROWSER_NAME.YANDEX_BROWSER;
        break;
      //IE
      case !!~this.agent.search(/MSIE/):
        name = BROWSER_NAME.IE;
        break;
      case !!~this.agent.search(/Trident/):
        name = BROWSER_NAME.TRIDENT;
        break;
      case !!~this.agent.search(/Edge/):
        name = BROWSER_NAME.EDGE;
        break;
      //Opera
      case !!~this.agent.search(
        /OPiOS|(iPhone.+(Mobile|Tablet))(?!(.+Safari))/
      ):
        name = BROWSER_NAME.OPERA_IOS;
        break;
      case !!~this.agent.search(/Opera Mini|((wv).+OPR)/):
        name = BROWSER_NAME.OPERA_MINI;
        break;
      case !!~this.agent.search(/Opera/):
        name = BROWSER_NAME.OPERA_PRESTO;
        break;
      case !!~this.agent.search(/OPR/):
        name = BROWSER_NAME.OPERA;
        break;
      //Firefox
      case !!~this.agent.search(/FxiOS/):
        name = BROWSER_NAME.FIREFOX_IOS;
        break;
      case !!~this.agent.search(/Firefox/):
        name = BROWSER_NAME.FIREFOX;
        break;
      //Chrome
      case !!~this.agent.search(/CriOS/):
        name = BROWSER_NAME.CHROME_IOS;
        break;
      case !!~this.agent.search(/Chrome/):
        name = BROWSER_NAME.CHROME;
        break;
      //Safari
      case !!~this.agent.search(/Safari/):
        name = BROWSER_NAME.SAFARI;
        break;
      //Other
      default:
        name = BROWSER_NAME.UNNAMED;
    }

    for (const item of this.ignoredBrowsers) {
      if (item == name) {
        name = BROWSER_NAME.UNSUPPORTED;
      }
    }

    return name;
  })();

  public version = (() => {
    let res = null;

    switch (this.name) {
      case BROWSER_NAME.SAMSUNG_BROWSER:
        res = this.agent.split('SamsungBrowser/')[1].split(' ')[0];
        break;
      case BROWSER_NAME.YANDEX_BROWSER:
        res = this.agent.split('YaBrowser/')[1].split(' ')[0];
        break;
      case BROWSER_NAME.IE:
        res = this.agent.split('MSIE ')[1].split(';')[0];
        break;
      case BROWSER_NAME.TRIDENT:
        res = this.agent.split('rv:')[1].split(')')[0];
        break;
      case BROWSER_NAME.EDGE:
        res = this.agent.split('Edge/')[1];
        break;
      case BROWSER_NAME.OPERA_PRESTO:
        res = this.agent.split('Version/')[1];
        break;
      case BROWSER_NAME.OPERA:
        res = this.agent.split('OPR/')[1];
        break;
      case BROWSER_NAME.FIREFOX:
        res = this.agent.split('Firefox/')[1];
        break;
      case BROWSER_NAME.CHROME:
        res = this.agent.split('Chrome/')[1].split(' ')[0];
        break;
      case BROWSER_NAME.SAFARI:
        res = this.agent.split('Version/')[1].split(' ')[0];
        break;
    }

    if (res) {
      res = parseFloat(res);
    }

    return res;
  })();

  public fullname =
    this.name + (this.version ? String(this.version).split('.')[0] : '');

  public getData = (obj: TJSON): TGetBrowserData => {
    let name;
    let result = null;

    if (obj) {
      result = obj.none || 'none';
      for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
          const trg = key.toLowerCase();

          if (trg.indexOf(this.fullname) > -1 || trg.indexOf(this.name) > -1) {
            name = obj[key];
          } else {
            const nsymbol = trg.charAt(
              trg.indexOf(this.name) + this.name.length
            );

            if (
              trg.indexOf(this.name) > -1 &&
              (nsymbol === ' ' || nsymbol === '')
            ) {
              name = obj[key];
            }
          }
        }
        if (name) {
          result = name;
          break;
        }
      }
      return result;
    } else {
      result = {
        name: this.name,
        version: this.version,
        fullname:
          this.name + this.version ? String(this.version).split('.')[0] : '',
      };
    }

    return result;
  };
}

export function isDevice(size?: string) {
  switch (size) {
    case SIZE.XXS:
      return root().innerWidth <= parseInt(cssData.xxs);
    case SIZE.XS:
      return root().innerWidth <= parseInt(cssData.xs);
    case SIZE.SM:
      return root().innerWidth <= parseInt(cssData.sm);
    case SIZE.XL:
      return root().innerWidth <= parseInt(cssData.xl);
    default:
      // SIZE.MD
      return root().innerWidth < parseInt(cssData.md);
  }
}
