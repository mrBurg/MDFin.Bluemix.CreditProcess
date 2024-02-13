import React, { useCallback, useEffect, useMemo, useState } from 'react';
import find from 'lodash/find';
import indexOf from 'lodash/indexOf';
import isUndefined from 'lodash/isUndefined';
import reduce from 'lodash/reduce';
import size from 'lodash/size';
import classNames from 'classnames';
import { observer, inject } from 'mobx-react';

import cfg from '@root/config.json';

import style from './AccountsForm.module.scss';
import Checked from '/public/theme/icons/checked_24x24.svg';

import { ReactSelectWidget } from '@components/widgets/ReactSelectWidget';
import { TSelectChangeData } from '@components/widgets/ReactSelectWidget/@types';
import {
  CLIENT_TABS,
  EVENT,
  FIELD_NAME,
  PAYMENT_METHOD,
  securedSiteList,
} from '@src/constants';
import { AbstractRoles, WidgetRoles } from '@src/roles';
import { STORE_IDS } from '@stores';
import { gt, handleErrors, isDev, stopScroll } from '@utils';
import {
  TAccountsFormProps,
  TAccountsFormPropsStore,
  TFormattedAccount,
  TLibraPayRequest,
} from './@types';
import { ButtonWidget, BUTTON_TYPE } from '@components/widgets/ButtonWidget';
import { ReactInputMaskWidget } from '@components/widgets/ReactInputMaskWidget';
import { LibraPayFrame } from '@components/LibraPayFrame';
import { checkStatus } from '@src/apis/apiUtils';
import { INPUT_TYPE } from '@components/widgets/InputWidget';
import { useRouter } from 'next/router';

export enum LAYOUT {
  DEFAULT = 'default',
  SHADED = 'shaded',
  FRAMED = 'framed',
}

function AccountsFormComponent(props: TAccountsFormProps) {
  const {
    editable,
    paymentTokens,
    className,
    selectedPaymentTokenId,
    page,
    layout = LAYOUT.DEFAULT,
    pageStore,
    loanStore,
    otpStore,
    showHolidayNotify = false,
  } = props as TAccountsFormPropsStore;

  const router = useRouter();

  const [showBankStatementPanel, setShowBankStatementPanel] = useState(false);
  const [accountNumber, setAccountNumber] = useState('');
  const [libraPayRequest, setLibraPayRequest] = useState(
    {} as TLibraPayRequest
  );

  const hasAccounts = useMemo(() => size(paymentTokens), [paymentTokens]);

  /** Форматирование списка счетов/карт под ReactSelectWidget */
  const accountFormatter = useCallback(
    () =>
      reduce(
        paymentTokens,
        (accum, item) => {
          const { name, /* bankName, */ id, ...props } = item;

          accum.push({
            ...props,
            value: id,
            text: name, // bankName ? (htmlParser(`${bankName}<br />${name}`) as string) : name
          });

          return accum;
        },
        [] as TFormattedAccount[]
      ),
    [paymentTokens]
  );

  const getSelectLabel = useCallback(() => {
    const { accountsFormStatic, currentPaymentToken } = loanStore;

    if (accountsFormStatic) {
      let selectTitle = accountsFormStatic.selectTitle;

      const token = find(
        paymentTokens,
        (item) => item.id == currentPaymentToken.id
      );

      if (token && token.bankName) {
        selectTitle = token.bankName;
      }

      return selectTitle;
    }

    return '';
  }, [loanStore, paymentTokens]);

  const selectAccountHandler = useCallback(
    (data: TSelectChangeData) => {
      const changeAccount = async () => {
        if (!isUndefined(data.value)) {
          const newAcc = find(
            loanStore.cabinetApplication.paymentTokenUnit?.paymentTokens,
            (item) => item.id == data.value
          );

          if (!newAcc) {
            return;
          }

          const res = await loanStore.cabinetChangeAccount(newAcc);
          if (res && res.status && checkStatus(res.status)) {
            loanStore.updateCurrentPaymentToken(newAcc);
          }
        }
      };

      changeAccount();
    },
    [loanStore]
  );

  const onChangeHandler = useCallback(
    (value: any) => {
      setAccountNumber(value);

      if (loanStore.invalidAccount) {
        loanStore.updateAccountValidity(true);
      }
    },
    [loanStore]
  );

  const confirmBankAccount = useCallback(async () => {
    /* loanStore.addAccount(accountNumber)*/
    await loanStore
      .addAccount(accountNumber)
      .then((res) => {
        if (res) {
          loanStore.getCabinetApplication();
          setShowBankStatementPanel(false);
          setAccountNumber('');
        } else {
          loanStore.updateAccountValidity(res);
        }

        return;
      })
      .catch((err) => handleErrors(err));
  }, [accountNumber, loanStore]);

  const renderiFrame = useCallback(() => {
    if (libraPayRequest.request) {
      return (
        <LibraPayFrame
          url={libraPayRequest.request.url}
          body={libraPayRequest.request.body}
          pageStore={pageStore}
        />
      );
    }
  }, [libraPayRequest.request, pageStore]);

  const addLibraPayCard = useCallback(async () => {
    const response = await loanStore.addCard({
      // browserAcceptHeader:"application\/json",
      // browserIP:"10.129.2.251",
      browserJavaEnabled: String(navigator.javaEnabled()),
      browserLanguage: navigator.language,
      browserColorDepth: String(screen.colorDepth),
      browserScreenHeight: String(screen.height),
      browserScreenWidth: String(screen.width),
      browserTZ: String(new Date().getTimezoneOffset()),
      browserUserAgent: navigator.userAgent,
      /* result: {
        url: '/ls/api/libra-iframe',
        method: PAYMENT_METHOD.IFRAME,
      }, */
      // email:"example@example.com",
      // cardholderName:"Cardholder Name",
    });

    if (response && response.request) {
      const { method, url } = response.request;

      switch (method) {
        case PAYMENT_METHOD.IFRAME:
          setLibraPayRequest(response);

          break;

        case PAYMENT_METHOD.REDIRECT:
          router.push(url);

          break;
      }
    }
  }, [loanStore, router]);

  const renderCustomAccounts = useCallback(() => {
    if (loanStore.accountsFormStatic) {
      const { accountsFormStatic, invalidAccount } = loanStore;

      const renderAccountsInput = () => {
        const accounts = (
          <ReactInputMaskWidget
            id={`AccountsForm-${AbstractRoles.input}-${INPUT_TYPE.TEXT}-${FIELD_NAME.ACCOUNT_NUMBER}`}
            name={FIELD_NAME.ACCOUNT_NUMBER}
            value={accountNumber}
            className={style.inputWidget}
            inputClassName={style.input}
            invalid={invalidAccount}
            type={INPUT_TYPE.TEXT}
            mask={cfg.accountMask}
            // placeholder={accountMask.replace(/9/g, '*')}
            onChange={(event) => onChangeHandler(event.currentTarget.value)}
          />
        );

        switch (layout) {
          case LAYOUT.FRAMED:
          case LAYOUT.SHADED:
            return <div className={style[layout]}>{accounts}</div>;
          default:
            return accounts;
        }
      };

      return (
        <>
          <h2 className={style.addTitle}>{accountsFormStatic.addTitle}</h2>
          {/* <h2 className={style.addSubTitle}>
            {accountsFormStatic.addSubTitle}
          </h2> */}

          {pageStore.librapayEnabled && (
            <>
              <div className={style.libraPayData}>
                <ButtonWidget
                  id={`AccountsForm-${WidgetRoles.button}-libraPay`}
                  className={classNames(
                    style.button,
                    'button_big button_green'
                  )}
                  onClick={() => addLibraPayCard()}
                  type={BUTTON_TYPE.BUTTON}
                >
                  {accountsFormStatic.buttons.addBankCard}
                </ButtonWidget>
              </div>
              <div className={style.or}>{gt.gettext('or')}</div>
            </>
          )}

          <div className={style.customAccounts}>
            {!showBankStatementPanel && (
              <ButtonWidget
                id={`AccountsForm-${WidgetRoles.button}-addBankAccount`}
                className={classNames(style.button, 'button_big button_green')}
                onClick={() => setShowBankStatementPanel(true)}
              >
                {accountsFormStatic.buttons.addBankAccount}
              </ButtonWidget>
            )}
            {showBankStatementPanel && (
              <>
                {renderAccountsInput()}

                <ButtonWidget
                  id={`AccountsForm-${WidgetRoles.button}-confirmBankAccount`}
                  className={classNames(
                    style.button,
                    style.buttonConfirm,
                    'button_big button_green'
                  )}
                  onClick={() => confirmBankAccount()}
                  type={BUTTON_TYPE.BUTTON}
                >
                  {accountsFormStatic.buttons.confirmBankAccount}
                </ButtonWidget>
              </>
            )}
          </div>
        </>
      );
    }
  }, [
    accountNumber,
    addLibraPayCard,
    confirmBankAccount,
    layout,
    loanStore,
    onChangeHandler,
    pageStore.librapayEnabled,
    showBankStatementPanel,
  ]);

  useEffect(() => {
    loanStore
      .initAccountForm()
      .then(() => {
        if (loanStore.accountsFormStatic) {
          //добавление нового "нулевого" значения выпадающего списка
          if (editable && hasAccounts && page == CLIENT_TABS.ACCOUNT_CARD) {
            loanStore.addOptionToPaymentTokens({
              id: '0',
              name: loanStore.accountsFormStatic.selectTitle,
              index: 100,
              disabled: true,
            });
          }

          if (selectedPaymentTokenId) {
            const selectedPaymentToken = find(
              paymentTokens,
              (item) => selectedPaymentTokenId == item.id
            );

            if (selectedPaymentToken) {
              loanStore.updateCurrentPaymentToken(selectedPaymentToken);
            }
          }
        }

        return;
      })
      .catch((err) => handleErrors(err));
  }, [
    editable,
    hasAccounts,
    loanStore,
    page,
    paymentTokens,
    selectedPaymentTokenId,
  ]);

  useEffect(() => {
    const messageHandler = (event: MessageEvent) => {
      if (!~indexOf(securedSiteList, event.origin) && !isDev) {
        return;
      }

      if (event.data == EVENT.CLOSE_IFRAME) {
        const frame = document.getElementById('librapayFrame');

        if (frame) {
          stopScroll(false);
          frame.parentNode?.removeChild(frame);
          loanStore.getCabinetApplication();
        }
      }
    };

    window.addEventListener('message', messageHandler);

    return () => window.removeEventListener('message', messageHandler);
  }, [loanStore]);

  /** Render Component */
  if (loanStore.accountsFormStatic) {
    const renderAccounts = () => {
      const accountsData = (
        <>
          <ReactSelectWidget
            name={FIELD_NAME.ACCOUNT_ID}
            value={loanStore.currentPaymentToken.id}
            placeholder={getSelectLabel()}
            options={accountFormatter()}
            onChange={selectAccountHandler}
            disabled={!!otpStore.otpReady}
          />
          {/* <div className={style.accountsNote}>
              NOTĂ: pentru transferurile realizate în alte conturi decât cele
              deschise la BCR creditarea contului beneficiar se va face în
              următoarea zi lucrătoare
            </div> */}
        </>
      );

      switch (layout) {
        case LAYOUT.FRAMED:
        case LAYOUT.SHADED:
          return (
            <div className={classNames(style[layout], style.accounts)}>
              {accountsData}
            </div>
          );
        default:
          return accountsData;
      }
    };

    return (
      <>
        <form className={classNames(style.accountsForm, className)}>
          {!!hasAccounts && (
            <>
              <h2 className={style.accountsFormTitle}>
                {loanStore.accountsFormStatic.formTitle}
                {loanStore.cabinetApplication.paymentTokenUnit
                  ?.selectedPaymentTokenId && <Checked />}
              </h2>
              {renderAccounts()}
            </>
          )}
          {showHolidayNotify && (
            <span className={style.nonBankingDayNotify}>
              {loanStore.accountsFormStatic.nonBankingDayNotify}
            </span>
          )}
          {editable && renderCustomAccounts()}
        </form>
        {libraPayRequest.request?.url && renderiFrame()}
      </>
    );
  }

  return null;
}

export const AccountsForm = inject(
  STORE_IDS.PAGE_STORE,
  STORE_IDS.LOAN_STORE,
  STORE_IDS.OTP_STORE
)(observer(AccountsFormComponent));
