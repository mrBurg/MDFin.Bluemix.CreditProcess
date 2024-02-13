import React from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import map from 'lodash/map';

import style from './LanguagesSwitcher.module.scss';

import cfg from '@root/config.json';
import { STORE_IDS } from '@stores';
import {
  TLanguagesSwitcherProps,
  TLanguagesSwitcherPropsStore,
} from './@types';

function LanguagesSwitcherComponent(props: TLanguagesSwitcherProps) {
  const { localeStore } = props as TLanguagesSwitcherPropsStore;

  return (
    <ul className={style.language}>
      {map(cfg.locales, (item: string, index: number) => (
        <li key={index} className={style.item}>
          <button
            className={classNames(style.button, {
              [style.current]: localeStore.locale == item,
            })}
            onClick={() => localeStore.setCurrentLanguage(cfg.locales[index])}
          >
            {item}
          </button>
        </li>
      ))}
    </ul>
  );
}

export const LanguagesSwitcher = inject(STORE_IDS.LOCALE_STORE)(
  observer(LanguagesSwitcherComponent)
);
