import { TJSON } from '@interfaces';
import { LoanStore } from '@src/stores/LoanStore';
import { UserStore } from '@src/stores/UserStore';

export type TExpiredDocData = {
  body: string;
  channel: string;
  sender: string;
  created: string;
  dealno: string;
  subject?: string;
};

export type TPersonalInformation = {
  staticData: TJSON;
};

export type TPersonalInformationStore = {
  loanStore: LoanStore;
  userStore: UserStore;
} & TPersonalInformation;
