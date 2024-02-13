import React, { createContext, ReactElement, useState } from 'react';

import { TRepaymentInfoContext, TRepaymentInfoProps } from './@types';
import { RepaymentInfo } from './RepaymentInfo';

export const RepaymentInfoCtx = createContext({} as TRepaymentInfoContext);
export const RepaymentInfoProvider = RepaymentInfoCtx.Provider;
export const RepaymentInfoConsumer = RepaymentInfoCtx.Consumer;

export const RepaymentInfoContext = (
  props: TRepaymentInfoProps
): ReactElement => {
  const [error, setError] = useState('');

  return (
    <RepaymentInfoProvider value={{ error, setError }}>
      <RepaymentInfo {...props} />
    </RepaymentInfoProvider>
  );
};
