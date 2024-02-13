import React, { useState } from 'react';
import classNames from 'classnames';
import { inject } from 'mobx-react';

import style from './LoanButton.module.scss';

import { WidgetRoles } from '@src/roles';
import { STORE_IDS } from '@stores';
import { TLoanButtonProps, TLoanButtonPropsStore } from './@types';
import { ButtonWidget, BUTTON_TYPE } from '@components/widgets/ButtonWidget';

export enum LOCATION {
  DRAW = 'Draw',
  PROMOTION = 'promotion',
}

function LoanButtonComponent(props: TLoanButtonProps) {
  const {
    className,
    location,
    label,
    loanStore,
    userStore,
    idExt = '',
    iconLeft,
    iconRight,
  } = props as TLoanButtonPropsStore;
  const [isDisabled, setIsDisabled] = useState(false);

  /** При натисканні на кнопку з акційного банера або акційної сторінки
   * відбувався редірект на головну сторінку, оскільки, по замовчуванню
   * у fetchWithAuth, по дефолту, параметр tokenRequired = true.
   * Така поведінка, булі неприпустимою, тому ввівся цей параметр.
   */
  // const isTokenRequired = location != 'Draw';

  return (
    <ButtonWidget
      id={`Loan-${WidgetRoles.button}${idExt ? '-' + idExt : idExt}`}
      className={classNames(style.loanButton, className)}
      type={BUTTON_TYPE.BUTTON}
      onClick={() => {
        setIsDisabled(true);

        userStore.fetchWithAuth(() => {
          loanStore.getLoan(() => setIsDisabled(false), location);
        }, false);
      }}
      disabled={isDisabled}
    >
      <>
        {iconLeft && iconLeft}
        {label}
        {iconRight && iconRight}
      </>
    </ButtonWidget>
  );
}

export const LoanButton = inject(
  STORE_IDS.LOAN_STORE,
  STORE_IDS.USER_STORE
)(LoanButtonComponent);
