import each from 'lodash/each';
import GetText from 'node-gettext';

import cfg from '@root/config.json';

import roEN from '../locales/ro-EN/common.po';
import roRO from '../locales/ro-RO/common.po';
import { TJSON } from '@interfaces';

const localesData = {
  roEN,
  roRO,
} as TJSON;

class XGetText extends GetText {
  public xnpgettext(
    msgctxt: string,
    msgid: string,
    msgidPlural: string,
    count: number
  ): string {
    return this.npgettext(msgctxt, msgid, msgidPlural, count).replace(
      '%d',
      String(count)
    );
  }
}

export const gt: XGetText = new XGetText();

each(cfg.locales, (locale: string): void => {
  gt.addTranslations(
    locale,
    cfg.defaultLocaleDomain,
    localesData[locale.replace('-', '')]
  );
});

gt.setTextDomain(cfg.defaultLocaleDomain);
gt.setLocale(cfg.defaultLocale);
