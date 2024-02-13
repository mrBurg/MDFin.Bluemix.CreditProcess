import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { observer, inject } from 'mobx-react';
import noop from 'lodash/noop';

import style from './Actions.module.scss';

import { FIELD_NAME } from '@src/constants';
import { AbstractRoles, WidgetRoles } from '@src/roles';
import { STORE_IDS } from '@stores';
import { gt, toFormat } from '@utils';
import { TActionsProps, TActionsPropsStore } from './@types';
import { InputWidget, INPUT_TYPE } from '@components/widgets/InputWidget';
import { ButtonWidget, BUTTON_TYPE } from '@components/widgets/ButtonWidget';
import cfg from '@root/config.json';
import { TJSON } from '@interfaces';

export enum LAYOUT {
  COLOR = 'color',
  DEFAULT = 'default',
}

function ActionsComponent(props: TActionsProps) {
  const {
    className,
    paymentAmount,
    extensionAmount,
    currentPlannedPaymentDebt,
    closingAmount,
    staticData,
    isCabinet,
    loanStore,
    repaymentStore,
    layout = LAYOUT.DEFAULT,
    callback = noop,
    dataIsInvalid = false,
  } = props as TActionsPropsStore;

  const [amount, setAmount] = useState(paymentAmount);

  const getValidAmount = useCallback(
    () => Number(String(amount).replace(/,/g, '.')),
    [amount]
  );

  const updatePaymentAmount = useCallback(
    (value: number | string) => {
      const paymentAmountFormat = new RegExp(cfg.paymentAmountFormat, 'g');

      if (paymentAmountFormat.test(String(value))) {
        value = String(value).replace(/^(0)+(?=\d+)/g, '$1.');

        setAmount(value as any);

        callback();
      }
    },
    [callback]
  );

  const onBlurHandler = useCallback(() => {
    const value = getValidAmount();

    updatePaymentAmount(value);
  }, [getValidAmount, updatePaymentAmount]);

  const onClickHandler = useCallback(
    (data: TJSON) => updatePaymentAmount(data.amount),
    [updatePaymentAmount]
  );

  useEffect(() => {
    const value = getValidAmount();

    if (isCabinet) {
      return loanStore.updatePaymentAmount(value);
    }

    repaymentStore.updatePaymentAmount(value);
  }, [getValidAmount, isCabinet, loanStore, repaymentStore]);

  return (
    <div className={classNames(style[layout], style.actions, className)}>
      <div className={style.amountInfo}>
        <p className={style.amountText}>{staticData.actionsTitle}</p>
        <InputWidget
          id={`Actions-${AbstractRoles.input}-${INPUT_TYPE.NUMBER}-${FIELD_NAME.PAYMENT_AMOUNT}`}
          name={FIELD_NAME.PAYMENT_AMOUNT}
          type={INPUT_TYPE.CURRENCY}
          className={style.inputWidget}
          inputClassName={classNames(style.input, {
            [style.error]: dataIsInvalid,
          })}
          value={amount}
          onChange={(event) => updatePaymentAmount(event.currentTarget.value)}
          onFocus={(event) => updatePaymentAmount(event.currentTarget.value)}
          onBlur={() => onBlurHandler()}
          maxLength={cfg.maxCharsPaymentAmount}
          invalid={dataIsInvalid}
          required
        />
      </div>

      {!!extensionAmount && (
        <ButtonWidget
          id={`Actions-${WidgetRoles.button}-${BUTTON_TYPE.BUTTON}`}
          className={classNames(style.button, {
            ['button_blue']: getValidAmount() == extensionAmount,
            ['button_gray-light']: getValidAmount() != extensionAmount,
          })}
          data-amount={extensionAmount}
          onClick={(event) => onClickHandler(event.currentTarget.dataset)}
          disabled={extensionAmount < 1}
          type={BUTTON_TYPE.BUTTON}
        >
          <span className={style.buttonText}>
            {staticData.actions.repayToExtend}
          </span>
          &nbsp;
          <span className={style.buttonAmount}>
            {toFormat(extensionAmount, {
              style: 'currency',
              currency: gt.gettext('Currency'),
            })}
          </span>
        </ButtonWidget>
      )}

      {!!currentPlannedPaymentDebt && (
        <ButtonWidget
          id={`Actions-${WidgetRoles.button}-${BUTTON_TYPE.BUTTON}`}
          className={classNames(style.button, {
            ['button_blue']: getValidAmount() == currentPlannedPaymentDebt,
            ['button_gray-light']:
              getValidAmount() != currentPlannedPaymentDebt,
          })}
          data-amount={currentPlannedPaymentDebt}
          onClick={(event) => onClickHandler(event.currentTarget.dataset)}
          disabled={currentPlannedPaymentDebt == 0}
          type={BUTTON_TYPE.BUTTON}
        >
          <span className={style.buttonText}>
            {staticData.actions.currentPlannedPaymentDebt}
          </span>
          &nbsp;
          <span className={style.buttonAmount}>
            {toFormat(currentPlannedPaymentDebt, {
              style: 'currency',
              currency: gt.gettext('Currency'),
            })}
          </span>
        </ButtonWidget>
      )}

      <ButtonWidget
        id={`Actions-${WidgetRoles.button}-${BUTTON_TYPE.BUTTON}`}
        className={classNames(style.button, {
          ['button_blue']: getValidAmount() == closingAmount,
          ['button_gray-light']: getValidAmount() != closingAmount,
        })}
        data-amount={closingAmount}
        onClick={(event) => onClickHandler(event.currentTarget.dataset)}
        disabled={currentPlannedPaymentDebt == 0}
        type={BUTTON_TYPE.BUTTON}
      >
        <span className={style.buttonText}>
          {staticData.actions.repayFullTheLoan}
        </span>
        &nbsp;
        <span className={style.buttonAmount}>
          {toFormat(closingAmount, {
            style: 'currency',
            currency: gt.gettext('Currency'),
          })}
        </span>
      </ButtonWidget>
    </div>
  );
}

export const Actions = inject(
  STORE_IDS.LOAN_STORE,
  STORE_IDS.REPAYMENT_STORE
)(observer(ActionsComponent));
