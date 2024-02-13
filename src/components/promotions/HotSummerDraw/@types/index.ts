import { TJSON } from '@interfaces';
import { LoanStore } from '@src/stores/LoanStore';

export type THotSummerDraw = TJSON;

export type THotSummerDrawStore = THotSummerDraw & {
  loanStore: LoanStore;
};

export type THowToParticipateItem = {
  description: string;
  imageUrl: string;
  number: string;
  title: string;
};

export type THowToGetItem = string[];
