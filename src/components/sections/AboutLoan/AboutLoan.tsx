import React, { useCallback } from 'react';
import classNames from 'classnames';
import isArray from 'lodash/isArray';
import map from 'lodash/map';

import style from './AboutLoan.module.scss';
import { TAboutLoanProps, TClientItem, TDetailsObject, TStep } from './@types';
import { WithDangerousHTML } from '@components/hocs';
import { AccordionWidget } from '@components/widgets/AccordionWidget';

function AboutLoan(props: TAboutLoanProps) {
  const { client, loanRepayment, responsibleLending } = props;

  const renderExtensionLoanDetails = useCallback((details: any) => {
    switch (true) {
      case isArray(details):
        return (
          <div className={style.content}>
            {map(details as TDetailsObject[], (step: TStep, index: number) => (
              <div key={index} className={style.step}>
                <div
                  className={classNames(style.stepIcon, style[`icon${index}`])}
                />
                <div className={style.subText}>{step.text}</div>
              </div>
            ))}
          </div>
        );
      default:
        return <div className={style.subText}>{details}</div>;
    }
  }, []);

  return (
    <>
      <div className={style.aboutLoan}>
        {map(client, (item: TClientItem, itemKey) => (
          <section key={itemKey} className={style.section}>
            <h2 className={style.title}>{item.title}</h2>

            <div className={style.content}>
              {map(item.steps, (step: TStep, index: number) => (
                <div key={index} className={style.step}>
                  <div
                    className={classNames(
                      style.stepIcon,
                      style[`icon${itemKey + index}`]
                    )}
                  />

                  <div className={style.stepData}>
                    <div className={classNames(style.subTitle, 'separator')}>
                      {step.title}
                      <br />
                      {step.subTitle}
                    </div>
                    <div className={style.text}>{step.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className={style.aboutLoan_blue}>
        <section className={style.section}>
          <h2 className={style.title}>{loanRepayment.paymentDeadlineTitle}</h2>
          {map(loanRepayment.extensionLoan, (item, index) => {
            if (!item.show) {
              return null;
            }

            return (
              <WithDangerousHTML key={index}>
                <h2 className={style.subTitle}>{item.title}</h2>
                {renderExtensionLoanDetails(item.details)}
              </WithDangerousHTML>
            );
          })}
        </section>
      </div>

      <div className={style.aboutLoan}>
        <section className={style.section}>
          <h2 className={style.title}>{responsibleLending.title}</h2>
          <AccordionWidget
            data={responsibleLending.itemsList}
            exclusive={false}
            fluid
          />
        </section>
      </div>
    </>
  );
}

export { AboutLoan };
