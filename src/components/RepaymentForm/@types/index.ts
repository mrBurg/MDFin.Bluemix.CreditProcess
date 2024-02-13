import { ReactElement } from 'react';

import { RepaymentStore } from '@src/stores/RepaymentStore';

export type TRepaymentFormProps = {
  renderTitle?: (className?: string) => ReactElement;
  title?: string;
  className?: string;
};

export type TFieldData = Record<'name' | 'value', string>;

export type TRepaymentFormPropsStore = {
  repaymentStore: RepaymentStore;
} & TRepaymentFormProps;
