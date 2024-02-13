import React, { useCallback, useMemo } from 'react';
import { inject, observer } from 'mobx-react';

import style from './NotificationText.module.scss';

import { Preloader } from '@components/Preloader';
import { TNotificationText, TNotificationTextStore } from './@types';
import { ReloadButtonWidget } from '@components/widgets/ReloadButtonWidget';
import { WithDangerousHTML } from './../hocs/WithDangerousHTML/WithDangerousHTML';
import { STORE_IDS } from '@stores';

function NotificationTextComponent(props: TNotificationText) {
  const { userStore, loanStore } = props as TNotificationTextStore;

  const onReloadHandler = useCallback(
    (callback: (() => void) | undefined) =>
      userStore.getClientNextStep(callback),
    [userStore]
  );

  const notification = useMemo(() => {
    const { cabinetApplication } = loanStore;

    if (cabinetApplication.notification) {
      return cabinetApplication.notification;
    }
  }, [loanStore]);

  if (notification) {
    return (
      <>
        <div className={style.main}>
          <WithDangerousHTML>
            <div className={style.notification}>{notification}</div>
          </WithDangerousHTML>
        </div>
        <ReloadButtonWidget
          reloadHandler={(callback) => onReloadHandler(callback)}
          className={style.reloadButton}
        />
      </>
    );
  }

  return <Preloader />;
}

export const NotificationText = inject(
  STORE_IDS.LOAN_STORE,
  STORE_IDS.USER_STORE
)(observer(NotificationTextComponent));
