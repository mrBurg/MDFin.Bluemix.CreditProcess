import React, { useContext } from 'react';
import map from 'lodash/map';

import style from './RepaymentInfo.module.scss';

import { TRepaymentInfoProps } from './@types';
import { Section } from './Section';
import { ErrorNotification } from '@components/ErrorNotification';
import { RepaymentInfoConsumer, RepaymentInfoCtx } from '.';

function RepaymentInfo(props: TRepaymentInfoProps) {
  const { dataList, bankAccounts } = props;
  const { error } = useContext(RepaymentInfoCtx);

  return (
    <RepaymentInfoConsumer>
      {() => {
        return (
          <div className={style.container}>
            <ErrorNotification
              className={style.errorNotification}
              error={error}
            />
            {map(dataList, (content, index) => (
              <Section
                key={index}
                index={index}
                content={content}
                bankAccounts={bankAccounts}
              />
            ))}
          </div>
        );
      }}
    </RepaymentInfoConsumer>
  );
}

export { RepaymentInfo };
