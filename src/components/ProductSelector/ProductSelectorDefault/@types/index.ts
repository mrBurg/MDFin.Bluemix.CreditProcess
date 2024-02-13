import { LoanStore } from '@src/stores/LoanStore';
import { UserStore } from '@src/stores/UserStore';

export type TProductSelectorProps = {
  className?: string;
  location?: string;
};

export type TProductSelectorPropsStore = {
  loanStore: LoanStore;
  userStore: UserStore;
} & TProductSelectorProps;
