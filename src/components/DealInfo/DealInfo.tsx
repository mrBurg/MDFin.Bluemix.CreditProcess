import React, { useCallback } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import map from 'lodash/map';

import style from './DealInfo.module.scss';

import { FieldDataConverter } from '@components/hocs';
import { STORE_IDS } from '@stores';
import { TDealInfoProps, TDealInfoPropsStore } from './@types';
import { gt } from '@utils';
import { ButtonWidget, BUTTON_TYPE } from '@components/widgets/ButtonWidget';
import { LinkWidget } from '@components/widgets/LinkWidget';

function DealInfoComponent(props: TDealInfoProps) {
  const { className, title, params, loanStore, repaymentStore } =
    props as TDealInfoPropsStore;

  const cabinetPay = useCallback((): void => {
    const dealInfo = repaymentStore.cabinetDeal.dealInfo;

    if (dealInfo) {
      const dealPay = {
        dealNo: dealInfo.dealNo,
        paymentAmount: dealInfo.paymentAmount,
        inCabinet: false,
      };

      loanStore.cabinetPay(dealPay);
    }
  }, [loanStore, repaymentStore.cabinetDeal.dealInfo]);

  return (
    <div className={classNames(style.dealInfo, className)}>
      <table className={style.datatable}>
        <thead>
          <tr>
            <th colSpan={2}>{title}</th>
          </tr>
        </thead>
        <tbody>
          {map(params, (item, key) => {
            if (!item.value) {
              return;
            }

            return (
              <tr key={key}>
                <td>{gt.gettext(item.text)}</td>
                <td>
                  {item.link ? (
                    <LinkWidget href={item.link} className={style.link}>
                      {item.value}
                    </LinkWidget>
                  ) : (
                    <FieldDataConverter type={item.type}>
                      {item.value}
                    </FieldDataConverter>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <ButtonWidget
        type={BUTTON_TYPE.BUTTON}
        className={style.button}
        onClick={cabinetPay}
      >
        {gt.gettext('toPay')}
      </ButtonWidget>
    </div>
  );
}

export const DealInfo = inject(
  STORE_IDS.LOAN_STORE,
  STORE_IDS.REPAYMENT_STORE
)(observer(DealInfoComponent));
