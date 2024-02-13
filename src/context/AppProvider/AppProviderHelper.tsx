import { inject, observer } from 'mobx-react';
import React, { useEffect } from 'react';

import { TAppProviderProps, TAppProviderPropsStore } from './@types';
import { AppProviderCtx } from '.';
import { STORE_IDS } from '@stores';

function AppProviderHelperComponent(props: TAppProviderProps) {
  const { children, userStore, trackingStore } =
    props as TAppProviderPropsStore;

  useEffect(() => {
    if (userStore.fingerprint && userStore.device) {
      trackingStore.getExternalSessionData();
    }
  }, [trackingStore, userStore.device, userStore.fingerprint]);

  return (
    <AppProviderCtx.Provider
      value={{
        visitorId: userStore.visitorId,
        fingerprint: userStore.fingerprint,
        device: userStore.device,
        isCabinet: userStore.isCabinet,
      }}
    >
      {children}
    </AppProviderCtx.Provider>
  );
}

export const AppProviderHelper = inject(
  STORE_IDS.USER_STORE,
  STORE_IDS.TRACKING_STORE
)(observer(AppProviderHelperComponent));
