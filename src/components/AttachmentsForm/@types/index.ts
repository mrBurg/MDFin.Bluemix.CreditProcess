import { LoanStore } from '@src/stores/LoanStore';

export type TAttachmentsFormProps = {
  className?: string;
};

export type TAttachmentsFormPropsStore = {
  loanStore: LoanStore;
} & TAttachmentsFormProps;
