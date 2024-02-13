import React, { useCallback, useMemo, useState } from 'react';
import size from 'lodash/size';

import style from './Selector.module.scss';

import { LoanButton } from '@components/LoanButton';
import { SliderWidget } from '@components/widgets/SliderWidget';
import { divideDigits, gt } from '@utils';
import { TSelectorProps } from './@types';
import { AmountController, TermController } from './controller';
import { TERM_FRACTION } from '@src/constants';

function Selector(props: TSelectorProps) {
  const {
    loanStore,
    loanStore: { calculatorParams, termFraction },
  } = props;

  const amountController = useMemo(
    () => new AmountController(calculatorParams.amountSegments),
    [calculatorParams.amountSegments]
  );
  const amountProps = amountController.getProps(props.amount);

  const termController = useMemo(
    () => new TermController(calculatorParams.termSegments, termFraction),
    [termFraction, calculatorParams.termSegments]
  );
  const termProps = termController.getProps(props.term);

  const [termValue, setTermValue] = useState(termProps.divider);

  const handleAmountChange = useCallback(
    (value: number, calc: boolean) => {
      loanStore.updateAmount(amountController.getValue(value));

      if (calc) {
        loanStore.calculate(true, (data) =>
          setTermValue(termController.getDivider(data.term))
        );
      }
    },
    [amountController, loanStore, termController]
  );

  const handleTermChange = useCallback(
    (value: number, calc: boolean) => {
      loanStore.updateTerm(
        termController.getValue(value),
        termController.getFraction(value)
      );

      if (calc) {
        loanStore.calculate(false, (data) =>
          setTermValue(termController.getDivider(data.term))
        );
      }

      setTermValue(value);
    },
    [loanStore, termController]
  );

  const renderTitle = useCallback(
    () => (size(termProps) ? props.titleLogged : props.title),
    [props.title, props.titleLogged, termProps]
  );

  const renderTermFraction = useCallback(
    () =>
      termFraction == TERM_FRACTION.DAY
        ? gt.ngettext('Day', 'Days', props.term)
        : gt.ngettext('Month', 'Months', props.term),
    [props.term, termFraction]
  );

  return (
    <div className={style.sliderContainer}>
      <div className={style.title}>{renderTitle()}</div>
      <div className={style.slider}>
        <SliderWidget
          output={
            <div className={style.amount}>
              <span className={style.amountOutput}>
                {divideDigits(props.amount)}
              </span>
              &nbsp;{gt.gettext('Currency')}
            </div>
          }
          className={style.sliderPanel}
          min={amountProps.min}
          max={amountProps.max}
          step={amountProps.step}
          defaultValue={amountProps.divider}
          value={amountProps.divider}
          sliderMarks={amountProps.marks}
          onChange={(value) => handleAmountChange(value as number, false)}
          onAfterChange={(value) => handleAmountChange(value as number, true)}
        />
      </div>
      {!!size(termProps) && (
        <div className={style.slider}>
          <SliderWidget
            output={
              <div className={style.amount}>
                <span className={style.amountOutput}>
                  {divideDigits(props.term)}
                </span>
                &nbsp;
                {renderTermFraction()}
              </div>
            }
            className={style.sliderPanel}
            min={termProps.min}
            max={termProps.max}
            step={termProps.step}
            defaultValue={termProps.divider}
            value={termValue}
            sliderMarks={termProps.marks}
            onChange={(value) => handleTermChange(value as number, false)}
            onAfterChange={(value) => handleTermChange(value as number, true)}
          />
        </div>
      )}
      <LoanButton
        className={style.loanButton}
        label={props.apply}
        location={props.location}
      />
    </div>
  );
}

export { Selector };
