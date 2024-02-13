import React, { useState, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames';

import { Preloader } from '@components/Preloader';
import { gt } from '@utils';
import { TAccountCard } from './@types';
import style from './AccountCard.module.scss';
import { ClientTabs } from '../ClientTabs';
import { CLIENT_TABS } from '@src/constants';
import { AccountsForm, LAYOUT } from '@components/AccountsForm';
import { ButtonWidget, BUTTON_TYPE } from '@components/widgets/ButtonWidget';
import { WidgetRoles } from '@src/roles';
import { URIS } from '@routes';

function AccountCardComponent(props: TAccountCard) {
  const {
    staticData,
    userStore,
    loanStore,
    loanStore: { cabinetApplication, currentPaymentToken },
  } = props;

  const [isRender, setIsRender] = useState(false);
  const [isDisabled, setIsDisabled] = useState(!!currentPaymentToken.id);

  const submitForm = useCallback(async () => {
    setIsDisabled(true);

    const response = await userStore.saveWizardStep(
      URIS.ACCOUNT_CARD,
      currentPaymentToken
    );

    if (!response) {
      return setIsDisabled(false);
    }

    userStore.getClientNextStep();
  }, [currentPaymentToken, userStore]);

  useEffect(() => {
    userStore.fetchWithAuth(async () => {
      await userStore.getClientNextStep();
      await loanStore.getCabinetApplication();

      setIsRender(true);
    });
  }, [loanStore, userStore]);

  if (isRender) {
    return (
      <div className={style.account_card}>
        <ClientTabs current={CLIENT_TABS.ACCOUNT_CARD} />
        <h2 className={style.title}>{staticData.title}</h2>

        {cabinetApplication.paymentTokenUnit && (
          <AccountsForm
            layout={LAYOUT.FRAMED}
            className={style.accounts}
            borderClassName={style.accountsBorder}
            page={CLIENT_TABS.ACCOUNT_CARD}
            {...cabinetApplication.paymentTokenUnit}
          />
        )}

        <ButtonWidget
          id={`AccountCard-${WidgetRoles.button}-${BUTTON_TYPE.BUTTON}`}
          className={classNames(style.buttonWidget, 'button_big button_blue')}
          type={BUTTON_TYPE.SUBMIT}
          disabled={isDisabled}
          onClick={submitForm}
        >
          {gt.gettext('Confirm')}
        </ButtonWidget>
      </div>
    );
  }

  return <Preloader />;
}

export const AccountCard = observer(AccountCardComponent);
