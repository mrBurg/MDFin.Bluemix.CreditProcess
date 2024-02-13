import { TJSON } from '@interfaces';
import { LoanStore } from '@src/stores/LoanStore';

export type TPrizeRaceContest = TJSON;

export type TPrizeRaceContestStore = TPrizeRaceContest & {
  loanStore: LoanStore;
};

export type THowToParticipateItem = {
  number: string;
  description: string;
};

export type THowToGetItem = {
  text: string;
  class: string;
};

export type TPrizeItem = {
  title: string;
  description: string;
  imageUrl: string;
};
