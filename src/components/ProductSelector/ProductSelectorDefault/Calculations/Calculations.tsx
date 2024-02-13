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
    zeroNote,
    date,
    amountRequested,
    interest,
    APR,
    apr,
  } = props;

  return (
    <div className={style.loanData}>
      <p className={style.loanTitle}>{zeroNote}</p>
      <table className={style.loanInfo}>
        <tbody>
          <tr>
            <td>{date}</td>
            <td className={style.loanInfoValue}>
              {moment(dateTo).format('DD.MM.YYYY')}
            </td>
          </tr>
          <tr>
            <td>{amountRequested}</td>
            <td className={style.loanInfoValue}>
              {`${divideDigits(amount)} ${gt.gettext('Currency')}`}
            </td>
          </tr>
          <tr>
            <td>{interest}</td>
            <td className={style.loanInfoValue}>
              {`${interestAmount} ${gt.gettext('Currency')}`}
            </td>
          </tr>
          <tr>
            <td>Total de plată:</td>
            <td className={style.loanInfoValue}>
              {`${divideDigits(totalAmount!)} ${gt.gettext('Currency')}`}
            </td>
          </tr>
          <tr>
            <td>{APR}</td>
            <td className={style.loanInfoValue}>{`${apr} %`}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export { Calculations };
