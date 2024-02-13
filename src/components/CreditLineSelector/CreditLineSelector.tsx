import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { inject } from 'mobx-react';

import style from './CreditLineSelector.module.scss';

import { SliderWidget } from '@components/widgets/SliderWidget';
import { staticApi, STORE_IDS } from '@stores';
import {
  TCreditLineSelectorProps,
  TCreditLineSelectorPropsStore,
  TCreditLineSelectorState,
} from './@types';
import { divideDigits, gt } from '@utils';
import noop from 'lodash/noop';
import { TLoanProposal, TSegments } from '@stores-types/loanStore';
import classNames from 'classnames';

function CreditLineSelectorComponent(props: TCreditLineSelectorProps) {
  const {
    loanStore,
    calculate = false,
    afterChangeCallback = noop,
    className,
    formTitle,
    callBack = noop,
  } = props as TCreditLineSelectorPropsStore;

  const amountData = useMemo(() => {
    if (loanStore.cabinetApplication.loanProposal) {
      return loanStore.cabinetApplication.loanProposal.amount;
    }
  }, [loanStore]);

  const amountSegmentData = useMemo(() => {
    if (loanStore.cabinetApplication.loanProposal) {
      return loanStore.cabinetApplication.loanProposal.amountSegment;
    }
  }, [loanStore]) as TSegments;

  const [amount, setAmount] = useState(amountData);
  const [amountSegment, setAmountSegment] = useState(amountSegmentData);
  const [staticData, setStaticData] = useState<TCreditLineSelectorState>();

  const initialProps = useMemo(
    () => ({
      title: '',
      marks: {
        [amountSegment.min]: {
          label: `${divideDigits(amountSegment.min)} ${gt.gettext('Currency')}`,
        },
        [amountSegment.max]: {
          label: `${divideDigits(amountSegment.max)} ${gt.gettext('Currency')}`,
        },
      },
    }),
    [amountSegment.max, amountSegment.min]
  );

  const handleAmountChangeEnd = useCallback(
    (value: any) => {
      loanStore.updateAmount(value);
      if (calculate) {
        loanStore.calculate(true);
      }

      afterChangeCallback();
    },
    [afterChangeCallback, calculate, loanStore]
  );

  useEffect(() => {
    const init = async () => {
      const response = await staticApi.fetchStaticData({
        block: 'credit-line-selector-form',
        path: 'form',
      });

      if (response) {
        setStaticData({ ...initialProps, ...response });
      }

      callBack();
    };

    init();

    const { amountSegment, amount, term, termFraction } = loanStore
      .cabinetApplication.loanProposal as TLoanProposal;

    setAmount(amount);
    setAmountSegment(amountSegment);
    loanStore.updateAmount(amount);
    loanStore.updateTerm(term, termFraction);
  }, [callBack, initialProps, loanStore]);

  if (staticData) {
    return (
      <div className={classNames('selectorWrap', style.selector)}>
        <p className={style.selectorTitle}>{formTitle ?? staticData.title}</p>
        <SliderWidget
          className={classNames(style.slider, className)}
          output={`${amount} ${gt.gettext('Currency')}`}
          min={amountSegment.min}
          max={amountSegment.max}
          step={amountSegment.step}
          value={amount}
          sliderMarks={staticData.marks}
          onChange={(value) => setAmount(value as number)}
          onAfterChange={(value) => handleAmountChangeEnd(value)}
        />
      </div>
    );
  }

  return null;
}

export const CreditLineSelector = inject(STORE_IDS.LOAN_STORE)(
  CreditLineSelectorComponent
);
