import { LoanStore } from '@src/stores/LoanStore';

export type TSelectorProps = {
  loanStore: LoanStore;
} & Record<
  'title' | 'titleLogged' | 'registerLoan' | 'signIn' | 'apply',
  string
> &
  Record<'amount' | 'term', number> &
  Partial<Record<'location', string>>;

export type TSegment = {
  termFraction?: string;
} & Record<'min' | 'max' | 'step' | 'divisions' | 'segmentSize', number>;
