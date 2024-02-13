import { TJSON } from '@interfaces';
import { LoanStore } from '@src/stores/LoanStore';

export type TCreditLineSelectorProps = {
  afterChangeCallback?: () => void;
  calculate?: boolean;
  callBack?: () => void;
} & Partial<Record<'className' | 'widgetTitle' | 'formTitle', string>>;

export type TCreditLineSelectorState = {
  title: string;
  marks: TJSON;
};

export type TCreditLineSelectorPropsStore = {
  loanStore: LoanStore;
} & TCreditLineSelectorProps;
