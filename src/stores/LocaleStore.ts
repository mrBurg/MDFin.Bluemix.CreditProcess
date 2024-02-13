import { observable, makeObservable, action } from 'mobx';

import { TLocalizationData } from '@stores-types/localeStore';
import { gt } from '@utils';
import cfg from '@root/config.json';

export class LocaleStore {
  @observable locale = cfg.defaultLocale;
  localizationData = {} as TLocalizationData;

  constructor() {
    makeObservable(this);
  }

  @action
  setCurrentLanguage(data: string) {
    this.locale = data;

    document.documentElement.lang = this.locale;
    gt.setLocale(this.locale);

    console.log(`Language has been changed to [${this.locale}]`);
  }
}
