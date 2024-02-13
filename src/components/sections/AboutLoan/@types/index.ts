import { TJSON } from '@interfaces';

export type TDetailsObject = { text: string };

export type TDetails = string | TDetailsObject[];

export type TExtensionLoan = {
  title: string;
  details: TDetails;
  show: boolean;
}[];

export type TStep = Record<'title' | 'subTitle' | 'text', string>;

export type TClientItem = {
  title: string;
  steps: TStep[];
};

export type TClientType = Record<'new' | 'old', TClientItem>;

export type TLoanRepayment = {
  paymentDeadlineTitle: string;
  extensionLoan: TExtensionLoan;
};

export type TAboutLoanProps = {
  client: TClientType;
  loanRepayment: TLoanRepayment;
  responsibleLending: TJSON;
};
