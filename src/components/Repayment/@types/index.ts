import { LoanStore } from '@src/stores/LoanStore';
import { LocaleStore } from '@src/stores/LocaleStore';
import { RepaymentStore } from '@src/stores/RepaymentStore';
import { LAYOUT } from '..';

export type TRepaymentTypeProps = {
  className?: string;
};

export type TRepaymentTypeDefaultPropsStore = {
  repaymentStore: RepaymentStore;
} & TRepaymentTypeProps;

export type TRepaymentTypeTablePropsStore = {
  loanStore: LoanStore;
  localeStore: LocaleStore;
} & TRepaymentTypeDefaultPropsStore;

export type TRepaymentProps = {
  layout: LAYOUT;
} & TRepaymentTypeProps;
