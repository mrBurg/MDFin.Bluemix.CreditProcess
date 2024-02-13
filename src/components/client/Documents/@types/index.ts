import { TJSON } from '@interfaces';
import { LoanStore } from '@src/stores/LoanStore';
import { PageStore } from '@src/stores/PageStore';
import { UserStore } from '@src/stores/UserStore';

export type TDocumentsProps = {
  staticData: TJSON;
};

export type TDocumentsPropsStore = {
  userStore: UserStore;
  loanStore: LoanStore;
  pageStore: PageStore;
} & TDocumentsProps;
