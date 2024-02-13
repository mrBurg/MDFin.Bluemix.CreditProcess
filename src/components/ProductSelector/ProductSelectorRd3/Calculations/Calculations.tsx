import React from 'react';
import moment from 'moment';

import style from './Calculations.module.scss';

import { TCalculationsProps } from './@types';
import { divideDigits, gt } from '@utils';

function Calculations(props: TCalculationsProps) {
  const {
    amount,
    totalAmount,
    dateTo,
    interestAmount,
    date,
    amountRequested,
    interest,
    repay,
    APR,
    apr,
  } = props;

  return (
    <div className={style.loanData}>
      <div className={style.loanInfo}>
        <div className={style.loanInfoItem}>
          <div>{date}</div>
          <div className={style.loanInfoValue}>
            {moment(dateTo).format('DD.MM.YYYY')}
          </div>
        </div>
        <div className={style.loanInfoItem}>
          <div>{amountRequested}</div>
          <div className={style.loanInfoValue}>
            {`${divideDigits(amount)} ${gt.gettext('Currency')}`}
          </div>
        </div>
        <div className={style.loanInfoItem}>
          <div>{interest}</div>
          <div className={style.loanInfoValue}>
            {`${interestAmount} ${gt.gettext('Currency')}`}
          </div>
        </div>
        <div className={style.loanInfoItem}>
          <div>{repay}</div>
          <div className={style.loanInfoValue}>
            {`${divideDigits(totalAmount!)} ${gt.gettext('Currency')}`}
          </div>
        </div>
        <div className={style.loanInfoItem}>
          <div>{APR}</div>
          <div className={style.loanInfoValue}>{`${apr} %`}</div>
        </div>
      </div>
    </div>
  );
}

export { Calculations };
