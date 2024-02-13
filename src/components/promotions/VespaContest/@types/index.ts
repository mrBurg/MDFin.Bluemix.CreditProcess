import { TJSON } from '@interfaces';
import { LoanStore } from '@src/stores/LoanStore';

export type TVespaContest = TJSON;

export type TVespaContestStore = TVespaContest & {
  loanStore: LoanStore;
};

export type THowToGetItem = {
  imageUrl: string;
  description: string;
};
