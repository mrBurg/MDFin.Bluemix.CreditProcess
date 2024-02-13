import { TJSON } from '@interfaces';
import { LoanStore } from '@src/stores/LoanStore';
import { RepaymentStore } from '@src/stores/RepaymentStore';
import { Dispatch, SetStateAction } from 'react';
import { LAYOUT } from '..';

export type TActionsProps = Record<
  | 'paymentAmount'
  | 'extensionAmount'
  | 'currentPlannedPaymentDebt'
  | 'closingAmount',
  number
> &
  Record<'staticData', TJSON> &
  Partial<
    Record<'isCabinet' | 'dataIsInvalid', boolean> &
      Record<'className', string> &
      Record<'layout', LAYOUT> &
      Record<'callback', (() => void) | Dispatch<SetStateAction<boolean>>>
  >;

export type TActionsPropsStore = Record<'loanStore', LoanStore> &
  Record<'repaymentStore', RepaymentStore> &
  TActionsProps;
