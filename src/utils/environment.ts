import isUndefined from 'lodash/isUndefined';

import { ENVIRONMENT } from '@src/constants';

export const isServer: boolean = typeof window === String(void 0);
export const isBrowser: boolean = process.browser;
export const isDev = ENVIRONMENT == 'development';
export const isTest = ENVIRONMENT == 'test';
export const isProd = ENVIRONMENT == 'production';
export const isFrame = !isServer && window.location != window.parent.location;
export const env = (() => {
  switch (true) {
    case isTest:
      return 'test';
    case isProd:
      return 'prod';
  }
})();

export const root = () => (!isUndefined(globalThis) ? globalThis : self);

/* let inIframe = false;

try {
  inIframe =
    window != window.top ||
    document != top.document ||
    self.location != top.location;
} catch (e) {
  inIframe = true;
}

export const isFramed = inIframe;
 */
