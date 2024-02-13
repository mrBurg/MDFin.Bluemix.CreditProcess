import React, { useEffect, useCallback, useState } from 'react';
import { observer } from 'mobx-react';

import style from './WrongAccount.module.scss';

import { AccountsForm } from '@components/AccountsForm';
import { WithDangerousHTML } from '@components/hocs';
import { CLIENT_TABS, FLOW } from '@src/constants';
import { TWrongAccountProps } from './@types';
import { gt } from '@utils';
import { Preloader } from '@components/Preloader';
import { ClientTabs } from '@components/client/ClientTabs';
import classNames from 'classnames';
import { ButtonWidget, BUTTON_TYPE } from '@components/widgets/ButtonWidget';
import { WidgetRoles } from '@src/roles';

function WrongAccountComponent(props: TWrongAccountProps) {
  const {
    userStore,
    loanStore,
    loanStore: { cabinetApplication },
  } = props;

  const [isRender, setIsRender] = useState(false);
  const [submitEnabled, setSubmitEnabled] = useState(false);

  useEffect(() => {
    userStore.fetchWithAuth(async () => {
      await userStore.getClientNextStep();
      await loanStore.getCabinetApplication();

      setIsRender(true);
    });
  }, [loanStore, userStore]);

  /** Активация/деактивация кнопки 'Continua' */
  useEffect(() => {
    if (loanStore.currentPaymentToken.id) {
      setSubmitEnabled(true);
    } else {
      setSubmitEnabled(false);
    }
  }, [loanStore.currentPaymentToken.id]);

  const onSubmitHandler = useCallback(async () => {
    setSubmitEnabled(false);

    const submitForm = async () => {
      const data = { view: CLIENT_TABS.WRONG_ACCOUNT };
      userStore.postClientNextStep(data, () => setSubmitEnabled(true));
    };

    submitForm();
  }, [userStore]);

  const renderAccounts = useCallback(() => {
    if (cabinetApplication.paymentTokenUnit) {
      return (
        <AccountsForm
          className={style.accounts}
          {...cabinetApplication.paymentTokenUnit}
        />
      );
    }
  }, [cabinetApplication.paymentTokenUnit]);

  const renderTabs = useCallback(() => {
    if (loanStore.cabinetApplication.flow == FLOW.WIZARD) {
      return <ClientTabs current={CLIENT_TABS.WRONG_ACCOUNT} />;
    }
  }, [loanStore.cabinetApplication.flow]);

  if (isRender && cabinetApplication) {
    return (
      <div className={style.wrongAccount}>
        {renderTabs()}

        {cabinetApplication.notification && (
          <WithDangerousHTML>
            <h2 className={style.title}>{cabinetApplication.notification}</h2>
          </WithDangerousHTML>
        )}

        {renderAccounts()}

        <ButtonWidget
          id={`WrongAccount-${WidgetRoles.button}-${BUTTON_TYPE.BUTTON}`}
          className={classNames(
            style.buttonWidget,
            style.buttonSubmit,
            'button_big button_blue'
          )}
          type={BUTTON_TYPE.BUTTON}
          onClick={onSubmitHandler}
          disabled={!submitEnabled}
        >
          {gt.gettext('More')}
        </ButtonWidget>
      </div>
    );
  }

  return <Preloader />;
}

export const WrongAccount = observer(WrongAccountComponent);
