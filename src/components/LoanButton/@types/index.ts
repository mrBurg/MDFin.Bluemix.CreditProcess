import { LoanStore } from '@src/stores/LoanStore';
import { UserStore } from '@src/stores/UserStore';

export type TLoanButtonProps = {
  className?: string;
  label: string;
  idExt?: string;
  location?: string;
  iconLeft?: any; //SVGElement;
  iconRight?: any; //SVGElement;
};

export type TLoanButtonPropsStore = {
  loanStore: LoanStore;
  userStore: UserStore;
} & TLoanButtonProps;
