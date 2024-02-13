import React, { useState, useEffect, useCallback } from 'react';
import { CLIENT_TABS, FLOW } from '@src/constants';

import style from './Sendmoney.module.scss';

import { ClientTabs } from '../client/ClientTabs/ClientTabs';
import cfg from '@root/config.json';
import { Preloader } from '@components/Preloader';
import { TSendmoneyProps } from './@types';
import { ServiceMessage } from '@components/ServiceMessage';
import { NotificationText } from '@components/NotificationText';
import { WithPageContainer } from '@components/hocs/WithPageContainer';

function Sendmoney(props: TSendmoneyProps) {
  const { userStore, loanStore } = props;

  const [isRender, setIsRender] = useState(false);

  const renderTabs = useCallback(() => {
    if (loanStore.cabinetApplication.flow == FLOW.WIZARD) {
      return <ClientTabs current={CLIENT_TABS.ACCOUNT_CARD} />;
    }
  }, [loanStore.cabinetApplication.flow]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    userStore.fetchWithAuth(async () => {
      await loanStore.getCabinetApplication();

      setIsRender(true);

      userStore.getClientNextStep();

      timer = setInterval(
        () => userStore.getClientNextStep(),
        cfg.refreshViewTime
      );
    });

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [loanStore, userStore]);

  if (isRender) {
    return (
      <>
        <ServiceMessage isCabinet={true} className={style.serviceMessage} />
        {renderTabs()}
        <WithPageContainer>
          <NotificationText />
        </WithPageContainer>
      </>
    );
  }

  return <Preloader />;
}

export { Sendmoney };
