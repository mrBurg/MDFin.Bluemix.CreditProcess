import { inject, observer } from 'mobx-react';
import React, { createContext, useEffect } from 'react';

import {
  TLocaleProviderContext,
  TLocaleProviderProps,
  TLocaleProviderPropsStore,
} from './@types';
import { STORE_IDS } from '@stores';
import { setToLocalStorage } from '@utils';
import { LOCALE_KEY } from '@src/constants';

export const LocaleProviderCtx = createContext({} as TLocaleProviderContext);

function LocaleProviderComponent(props: TLocaleProviderProps) {
  const { children, localeStore } = props as TLocaleProviderPropsStore;

  useEffect(() => {
    setToLocalStorage(LOCALE_KEY, localeStore.locale);
  });

  return (
    <LocaleProviderCtx.Provider
      value={{
        locale: localeStore.locale,
        localizationData: localeStore.localizationData,
      }}
    >
      {children}
    </LocaleProviderCtx.Provider>
  );
}

/**
 * @description Провайдер локализации. Устанавливает язык всего приложения
 * @param locale значение свойства "locale" объекта "localeStore"
 */
export const LocaleProvider = inject(STORE_IDS.LOCALE_STORE)(
  observer(LocaleProviderComponent)
);
