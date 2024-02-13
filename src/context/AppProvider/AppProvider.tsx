import { useRouter } from 'next/router';
import { inject } from 'mobx-react';
import React, { createContext, useCallback, useEffect } from 'react';

import {
  TAppProviderContext,
  TAppProviderProps,
  TAppProviderPropsStore,
} from './@types';
import { STORE_IDS } from '@stores';
import { handleErrors } from '@utils';
import { AppProviderHelper } from './AppProviderHelper';
import { applicationPages } from '@routes';
import includes from 'lodash/includes';

export const AppProviderCtx = createContext({} as TAppProviderContext);

function AppProviderComponent(props: TAppProviderProps) {
  const { children, userStore, trackingStore } =
    props as TAppProviderPropsStore;

  const router = useRouter();

  const setCurrentDevice = useCallback(async () => {
    try {
      const device = await import('current-device');

      return device.default;
    } catch (err) {
      handleErrors(err);
    }
  }, []);

  const collectFingerPrint = useCallback(async () => {
    try {
      const fingerprintJS = await import('@fingerprintjs/fingerprintjs');
      const fp = await fingerprintJS.load();

      return await fp.get();
    } catch (err) {
      handleErrors(err);
    }
  }, []);

  useEffect(() => {
    const initAppProps = async () => {
      userStore.updateApp({
        fingerprint: await collectFingerPrint(),
        device: await setCurrentDevice(),
        isCabinet: includes(applicationPages, router.route),
      });
    };

    initAppProps();
  }, [
    collectFingerPrint,
    router.route,
    setCurrentDevice,
    trackingStore,
    userStore,
  ]);

  useEffect(() => {
    userStore.updateLocalStorage();
    trackingStore.updateLocalStorage();
  });

  return <AppProvider.Helper>{children}</AppProvider.Helper>;
}

AppProviderComponent.Helper = AppProviderHelper;

/**
 * @summary Провайдер приложения. Получает и записывает необходимую информацию о браузере пользователя в локальное хранилище.
 * @description Компонент состоит из двух частей AppProvider и AppProviderHelper. AppProvider выполняется один раз при посещении стриницы и получает данные из подключеных компонентов \@fingerprintjs/fingerprintjs и current-device. AppProviderHelper следит за состоянием сторов и в случае удаления данных из локального стореджа востанавливает их из состояния приложения
 * @param fingerprint полученый из модуля "@fingerprintjs/fingerprintjs"
 * @param device полученый из модуля "current-device"
 * @todo getExternalSessionData
 * @event getExternalSessionData отправляет на сервер состояние текущей сессии
 */
export const AppProvider = inject(
  STORE_IDS.USER_STORE,
  STORE_IDS.TRACKING_STORE
)(AppProviderComponent);
