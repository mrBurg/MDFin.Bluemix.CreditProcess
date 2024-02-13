import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';

import style from './ProductSelectorRd3.module.scss';

import { Preloader } from '@components/Preloader';
import { STORE_IDS } from '@stores';
import {
  TProductSelectorRedesignProps,
  TProductSelectorRedesignPropsStore,
} from './@types';
import { Calculations } from './Calculations';
import { Selector } from './Selector';
import { Authorize } from './Authorize';

function ProductSelectorRd3Component(props: TProductSelectorRedesignProps) {
  const { loanStore, userStore, className, location } =
    props as TProductSelectorRedesignPropsStore;
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
          <Authorize {...productSelectorFormStatic} />

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

export const ProductSelectorRd3 = inject(
  STORE_IDS.LOAN_STORE,
  STORE_IDS.USER_STORE,
  STORE_IDS.PAGE_STORE,
  STORE_IDS.LOYALTY_STORE
)(observer(ProductSelectorRd3Component));
