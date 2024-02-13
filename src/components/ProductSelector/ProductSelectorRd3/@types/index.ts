import { LoanStore } from '@src/stores/LoanStore';
import { UserStore } from '@src/stores/UserStore';
import { PageStore } from '@src/stores/PageStore';

export type TProductSelectorRedesignProps = {
  className?: string;
  location?: string;
};

export type TProductSelectorRedesignPropsStore = {
  loanStore: LoanStore;
  userStore: UserStore;
  pageStore: PageStore;
} & TProductSelectorRedesignProps;
