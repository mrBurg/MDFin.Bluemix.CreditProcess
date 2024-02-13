import { LoanStore } from '@src/stores/LoanStore';
import { UserStore } from '@src/stores/UserStore';
import { TCabinetNotify } from '@stores-types/loanStore';

export type TNotify = {
  //notifications: string[] | string;
  className?: string;
  loanStore: LoanStore;
  userStore: UserStore;
};

export type TState = {
  isRender: boolean;
  cabinetNotify?: TCabinetNotify[];
};
