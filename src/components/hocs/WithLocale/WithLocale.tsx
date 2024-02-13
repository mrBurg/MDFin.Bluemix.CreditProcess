import { ReactElement, useEffect } from 'react';
import { inject, observer } from 'mobx-react';

import { LOCALE_KEY } from '@src/constants';
import { STORE_IDS } from '@stores';
import { isDev, setToLocalStorage } from '@utils';
import { TWithLocaleProps, TWithLocalePropsStore } from './@types';

function WithLocaleComponent(props: TWithLocaleProps) {
  const { children, localeStore } = props as TWithLocalePropsStore;

  useEffect(() => {
    if (isDev) {
      console.log(
        `The project is initialized for localization [${localeStore.localizationData.locale}]`
      );
    }

    setToLocalStorage(LOCALE_KEY, localeStore.locale);
    document.documentElement.lang = localeStore.locale;
  }, [localeStore]);

  return children as ReactElement;
}

export const WithLocale = inject(STORE_IDS.LOCALE_STORE)(
  observer(WithLocaleComponent)
);
