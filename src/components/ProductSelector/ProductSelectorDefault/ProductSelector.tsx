import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';

import style from './ProductSelector.module.scss';

import { Preloader } from '@components/Preloader';
import { STORE_IDS } from '@stores';
import { TProductSelectorProps, TProductSelectorPropsStore } from './@types';
import { Calculations } from './Calculations';
import { Selector } from './Selector';
import { LoyaltyCodeField } from '@components/loyalty/LoyaltyCodeField';

function ProductSelectorComponent(props: TProductSelectorProps) {
  const { loanStore, userStore, className, location } =
    props as TProductSelectorPropsStore;

  const [isRender, setIsRender] = useState(false);

  useEffect(() => {
    userStore.fetchWithAuth(async () => {
      await loanStore.initProductSelectorForm();
      await loanStore.getCalculatorParams();
      await loanStore.calculate(true);
      setIsRender(true);
    }, false);
  }, [loanStore, userStore]);

  if (isRender) {
    const { productSelectorFormStatic, loanData } = loanStore;

    if (productSelectorFormStatic && loanData) {
      return (
        <div className={classNames(style.productSelector, className)}>
          <Selector
            {...productSelectorFormStatic}
            amount={loanData.amount}
            term={loanData.term}
            loanStore={loanStore}
            location={location}
          />
          <LoyaltyCodeField
            className={style.loyaltyCode}
            isPlaceholder={false}
          />
          <Calculations
            {...productSelectorFormStatic}
            apr={loanData.apr as number}
            dateTo={loanData.dateTo as string}
            amount={loanData.amount}
            interestAmount={loanData.interestAmount as number}
            totalAmount={loanData.totalAmount as number}
          />
        </div>
      );
    }
  }

  return (
    <div className={classNames(style.productSelectorPreloader, className)}>
      <Preloader />
    </div>
  );
}

export const ProductSelector = inject(
  STORE_IDS.LOAN_STORE,
  STORE_IDS.USER_STORE,
  STORE_IDS.PAGE_STORE,
  STORE_IDS.LOYALTY_STORE
)(observer(ProductSelectorComponent));
