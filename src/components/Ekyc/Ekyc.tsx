import Script from 'next/script';
import size from 'lodash/size';
import { inject, observer } from 'mobx-react';
import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';

import style from './Ekyc.module.scss';

import {
  TEkycParams,
  TEkycProps,
  TEkycPropsStore,
  TResponseData,
} from './@types';
import { STORE_IDS } from '@stores';
import { Preloader } from '@components/Preloader';
import { RECOGNID } from '@src/constants';
import { isDev } from '@utils';

function EkycComponent(props: TEkycProps) {
  const { className, userStore } = props as TEkycPropsStore;

  const [ekycParams, setEkycParams] = useState({} as TEkycParams);
  const [FTIsLoaded, setFTIsLoaded] = useState(false);

  const initRecognID = useCallback(() => {
    const recognid = new (window as any).RecognID({
      dev: ekycParams.dev,
      apiKey: ekycParams.apiKey,
      parentId: 'recognid-root',
      onSession(err: Error, response: TResponseData) {
        if (err) {
          throw err;
        }

        if (isDev) {
          console.groupCollapsed('Response data');
          console.log(response);
          console.groupEnd();
        }

        userStore.getClientNextStep();
      },
    });

    recognid.setParams({
      locale: 'en',
      resources: '/ekyc',
    });

    recognid.init(ekycParams);
  }, [ekycParams, userStore]);

  useEffect(() => {
    if (!size(ekycParams)) {
      userStore.fetchWithAuth(async () => {
        await userStore.getClientNextStep(async () => {
          const data = await userStore.getEkycProps();

          setEkycParams(data.info);
        });
      });
    }
  });

  useEffect(() => {
    if (FTIsLoaded || window.RecognID) {
      initRecognID();
    }
  }, [FTIsLoaded, initRecognID]);

  if (size(ekycParams)) {
    return (
      <div className={classNames(style.ekyc, className)} id={'recognid-root'}>
        <Script src={RECOGNID} onLoad={() => setFTIsLoaded(true)} />
      </div>
    );
  }

  return <Preloader />;
}

export const Ekyc = inject(STORE_IDS.USER_STORE)(observer(EkycComponent));
