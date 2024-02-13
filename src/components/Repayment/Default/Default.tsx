import React, { useCallback } from 'react';
import { observer, inject } from 'mobx-react';
import classNames from 'classnames';

import style from './Default.module.scss';

import { Actions } from '@components/Actions';
import { DealInfo } from '@components/DealInfo';
import { Preloader } from '@components/Preloader';
import { STORE_IDS } from '@stores';
import {
  TRepaymentTypeProps,
  TRepaymentTypeDefaultPropsStore,
} from '../@types';
import { TFormStatic } from '@stores-types/repaymentStore';

function DefaultComponent(props: TRepaymentTypeProps) {
  const {
    className,
    repaymentStore,
    repaymentStore: {
      cabinetDeal: { dealInfo },
      formStatic,
    },
  } = props as TRepaymentTypeDefaultPropsStore;

  const renderDealInfo = useCallback(() => {
    if (dealInfo) {
      const { dealNo, maskedName, closingDate } = dealInfo;

      return (
        <DealInfo
          className={style.item}
          title={'Về Khoản Vay'}
          params={[
            {
              text: 'loanAgreement',
              value: dealNo,
            },
            {
              text: 'maskedName',
              value: maskedName,
            },
            {
              type: 'dateTo',
              text: 'dateTo',
              value: closingDate,
            },
          ]}
        />
      );
    }

    return null;
  }, [dealInfo]);

  const onSubmitHandler = useCallback(
    (event: any): void => {
      event.preventDefault();

      repaymentStore.updatePaymentState(false);
    },
    [repaymentStore]
  );

  if (dealInfo) {
    const {
      paymentAmount,
      extensionAmount,
      currentPlannedPaymentDebt,
      closingAmount,
    } = dealInfo;

    const actionProps = {
      paymentAmount,
      extensionAmount,
      currentPlannedPaymentDebt,
      closingAmount,
    };

    return (
      <form
        onSubmit={onSubmitHandler}
        className={classNames(style.paymentForm, className)}
      >
        {renderDealInfo()}
        <Actions
          {...actionProps}
          className={classNames(style.item, style.actions)}
          staticData={formStatic as TFormStatic}
        />
      </form>
    );
  }

  return <Preloader />;
}

export const Default = inject(STORE_IDS.REPAYMENT_STORE)(
  observer(DefaultComponent)
);
