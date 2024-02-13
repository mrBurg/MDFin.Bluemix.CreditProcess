import React, { useCallback, useEffect, useRef, useState } from 'react';
import { observer, inject } from 'mobx-react';
import classNames from 'classnames';
import map from 'lodash/map';

import style from './Table.module.scss';

import { Preloader } from '@components/Preloader';
import { STORE_IDS } from '@stores';
import { TRepaymentTypeProps, TRepaymentTypeTablePropsStore } from '../@types';
import { getTextWidth, gt, toFormat } from '@utils';
import { ButtonWidget, BUTTON_TYPE } from '@components/widgets/ButtonWidget';
import { AbstractRoles, WidgetRoles } from '@src/roles';
import { FIELD_NAME } from '@src/constants';
import { InputWidget, INPUT_TYPE } from '@components/widgets/InputWidget';
import { TJSON } from '@interfaces';
import cfg from '@root/config.json';

function TableComponent(props: TRepaymentTypeProps) {
  const {
    className,
    repaymentStore,
    repaymentStore: {
      cabinetDeal: { dealInfo },
      formStatic,
    },
    loanStore,
  } = props as TRepaymentTypeTablePropsStore;

  const input = useRef<HTMLInputElement>(null);
  const [inputWidth, setInputWidth] = useState('0px');
  const [invalid, setInvalid] = useState(false);
  const [paymentAmountData, setPaymentAmountData] = useState(
    dealInfo.paymentAmount
  );

  const getValidAmount = useCallback(
    (data: number | string) => Number(String(data).replace(/,/g, '.')),
    []
  );

  const onBlurHandler = useCallback(
    (data: Record<'name' | 'value', string>) => {
      const value = getValidAmount(data.value);

      setPaymentAmountData(value);

      if (value < cfg.minPaymentAmount) {
        return setInvalid(true);
      }
    },
    [getValidAmount]
  );

  const onChangeHandler = useCallback((data: any) => {
    const paymentAmountFormat = new RegExp(cfg.paymentAmountFormat, 'g');

    if (paymentAmountFormat.test(String(data.value))) {
      const value = String(data.value).replace(/^(0)+(?=\d+)/g, '$1.');

      setPaymentAmountData(value as any);
    }

    /* setPaymentAmountData(
      data.value.replace(/\.+/g, '.').replace(/^[0.](?=\d|(\.){2,})/, '0.')
    ); */
  }, []);

  const onSubmitHandler = useCallback(() => {
    if (!invalid) {
      loanStore.cabinetPay({
        dealNo: dealInfo.dealNo,
        paymentAmount: paymentAmountData,
        inCabinet: false,
      });
      repaymentStore.updatePaymentState(false);
    }
  }, [dealInfo.dealNo, invalid, loanStore, paymentAmountData, repaymentStore]);

  const renderItem = useCallback((data: number | string) => {
    {
      if (isNaN(data as number)) {
        return data;
      }

      return toFormat(data as number).replace(/\./g, ' ');
    }
  }, []);

  useEffect(() => {
    if (input.current) {
      setInputWidth(getTextWidth(input.current));
    }
  }, [paymentAmountData]);

  if (dealInfo && formStatic) {
    const {
      maskedName,
      extensionAmount,
      currentPlannedPaymentDebt,
      closingAmount,
    } = dealInfo;

    return (
      <form
        onSubmit={(event) => {
          event.preventDefault();

          onSubmitHandler();
        }}
        className={classNames(style.paymentForm, className)}
      >
        <table className={style.paymentTable}>
          <tbody>
            {map(
              {
                maskedName,
                extensionAmount,
                currentPlannedPaymentDebt,
                closingAmount,
              },
              (item, index) => {
                if (item) {
                  return (
                    <tr key={index}>
                      <td>{(formStatic as TJSON)[index]}</td>
                      <td>{renderItem(item)}</td>
                    </tr>
                  );
                }

                return null;
              }
            )}
            <tr>
              <td>{gt.gettext('Enter the amount')}</td>
              <td>
                <InputWidget
                  id={`Authorization-${AbstractRoles.input}-${INPUT_TYPE.TEXT}-${FIELD_NAME.PAYMENT_AMOUNT}`}
                  name={FIELD_NAME.AMOUNT}
                  className={style.inputWidget}
                  inputClassName={style.input}
                  invalid={invalid}
                  type={INPUT_TYPE.TEL}
                  value={paymentAmountData}
                  onChange={(event) =>
                    onChangeHandler({
                      name: event.currentTarget.name,
                      value: event.currentTarget.value,
                    })
                  }
                  onBlur={(event) =>
                    onBlurHandler({
                      name: event.currentTarget.name,
                      value: event.currentTarget.value,
                    })
                  }
                  onFocus={() => setInvalid(false)}
                  style={{ width: inputWidth }}
                  maxLength={cfg.maxCharsPaymentAmount}
                  ref={input}
                />
                {` ${gt.gettext('Currency')}`}
              </td>
            </tr>
          </tbody>
        </table>
        <ButtonWidget
          id={`RepaymentTable-${WidgetRoles.button}-${BUTTON_TYPE.SUBMIT}`}
          className={style.button}
          type={BUTTON_TYPE.SUBMIT}
        >
          {gt.gettext('payment')}
        </ButtonWidget>
      </form>
    );
  }

  return <Preloader />;
}

export const Table = inject(
  STORE_IDS.REPAYMENT_STORE,
  STORE_IDS.LOAN_STORE,
  STORE_IDS.LOCALE_STORE
)(observer(TableComponent));
