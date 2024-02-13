import { LoanStore } from '@src/stores/LoanStore';
import { RepaymentStore } from '@src/stores/RepaymentStore';

export type TDealInfoProps = {
  className?: string;
  title: string;
  params: any;
};

export type TDealInfoPropsStore = {
  loanStore: LoanStore;
  repaymentStore: RepaymentStore;
} & TDealInfoProps;
