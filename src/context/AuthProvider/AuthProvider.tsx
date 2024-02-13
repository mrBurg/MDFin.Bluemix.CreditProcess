import { inject } from 'mobx-react';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import {
  TAuthProviderContext,
  TAuthProviderPropsStore,
  TAuthProviderProps,
} from './@types';
import { STORE_IDS } from '@stores';
import { AppProviderCtx } from '@context/AppProvider';
import { LayoutProviderCtx } from '@context/LayoutProvider';

export const AuthProviderCtx = createContext({} as TAuthProviderContext);

function AuthProviderComponent(props: TAuthProviderProps) {
  const { userStore, children } = props as TAuthProviderPropsStore;

  const { fingerprint, device } = useContext(AppProviderCtx);
  const { setProductSelector } = useContext(LayoutProviderCtx);

  const initAuthProvider = useCallback(async () => {
    await userStore.updateUserState();
    await userStore.getClientNextStep(() => setProductSelector(true));
    console.log('%cUpdate', 'color: #00ff65');
  }, [setProductSelector, userStore]);

  useEffect(() => {
    if (fingerprint && device) {
      initAuthProvider();
    }
  });

  return (
    <AuthProviderCtx.Provider
      value={{
        authState: userStore.userAuthState,
        userLoggedIn: userStore.userLoggedIn,
        userData: {
          userFirstName: userStore.userFirstName,
          userLastName: userStore.userLastName,
        },
        isCabinet: userStore.isCabinet,
      }}
    >
      {children}
    </AuthProviderCtx.Provider>
  );
}

/**
 * @description Провайдер авторизации. Проверяет/обновляет состояние авторизации
 * @param authState состояние авторизации
 * @param userLoggedIn состояние авторизации в "userStore"
 * @param userData данные пользователя (имя и фамилия)
 * @param isCabinet определяется роутером на основании объекта "applicationPages" компонента "@routes"
 */
export const AuthProvider = inject(STORE_IDS.USER_STORE)(AuthProviderComponent);
