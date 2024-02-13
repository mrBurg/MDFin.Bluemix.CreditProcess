export type TCalculationResponse = {
  loanProposal: {
    dateFrom: string;
    dateTo: string;
    payment: number;
    amount: number;
    interestAmount: number;
    totalAmount: number;
    term: number;
    termFraction: string;
    apr: number;
    amountSegment: {
      min: number;
      max: number;
      step: number;
    };
  };
};

export type TReminderResponse = {
  //reminderInfo: {
  enabled: boolean;
  header: string;
  body: string;
  action: string;
  footnote: string;
  template: string;
  delay: number;
  //}
};
