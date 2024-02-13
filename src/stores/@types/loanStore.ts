import { TJSON } from '@interfaces';
import { FLOW, TERM_FRACTION } from '@src/constants';

export type TProductSelectorData = Record<'term' | 'amount', number>;

export type TLoanRequest = Record<'termFraction', TERM_FRACTION> &
  Partial<Record<'fixedAmount', boolean>> &
  TProductSelectorData;

type TLoanDataKey =
  | 'dateFrom'
  | 'dateTo'
  | 'totalAmount'
  | 'advisoryFee'
  | 'informationServicesFee'
  | 'extensionAmount'
  | 'interestAmount'
  | 'apr';

export type TLoanData = Partial<
  Record<Extract<TLoanDataKey, 'dateFrom' | 'dateTo'>, string>
> &
  Partial<Record<Exclude<TLoanDataKey, 'dateFrom' | 'dateTo'>, number>> &
  TProductSelectorData;

export type TSegments = Record<'termFraction', TERM_FRACTION> &
  Record<'min' | 'max' | 'step', number>;

type TCalculatorDefault = Record<'defaultTermFraction', TERM_FRACTION> &
  Record<'defaultAmount' | 'defaultTerm', number>;

export type TCalculatorParams = Record<
  'amountSegments' | 'termSegments',
  TSegments[]
>;

export type TCalculatorProps = Record<
  'calculatorParams',
  TCalculatorParams & TCalculatorDefault
>;

export type TDocument = Record<'id' | 'index', number> &
  Record<'filename' | 'url' | 'icon', string>;

export type TDocumentUnit = Record<'type_id' | 'index', number> &
  Record<'valid' | 'full', boolean> &
  Record<'type', string> &
  Record<'documents', TDocument[]>;

export type TAccountsFormStatic = Record<
  | 'formTitle'
  | 'selectTitle'
  | 'addTitle'
  | 'addSubTitle'
  | 'nonBankingDayNotify',
  string
> &
  Record<
    'buttons',
    Record<'addBankAccount' | 'confirmBankAccount' | 'addBankCard', string>
  >;

export type TAttachmentsFormStatic = Record<'title', string> &
  Record<
    'buttons',
    Record<'idFront' | 'idBack' | 'selfie' | 'other', string>
  >; /*& {
     isPresent: {
    title: string;
    buttons: {
      idFront: string;
      idBack: string;
      selfie: string;
      other: string;
    };
  };
  notPresent: {
    title: string;
    buttons: {
      idFront: string;
      idBack: string;
      selfie: string;
      other: string;
    };
  }; 
  };*/

type TProductSelectorFormStaticKey =
  | 'sliderMaxAmount'
  | 'sliderMediumAmount'
  | 'sliderMinAmount'
  | 'day1'
  | 'days30'
  | 'days70'
  | 'AIR'
  | 'APR'
  | 'amountRequested'
  | 'apply'
  | 'date'
  | 'dni'
  | 'interest'
  | 'registerLoan'
  | 'repay'
  | 'signIn'
  | 'tabLong'
  | 'tabShort'
  | 'title'
  | 'titleSum'
  | 'titleLogged'
  | 'zeroNote'
  | 'floatPanelText';

export type TProductSelectorFormStatic = Record<
  Extract<
    TProductSelectorFormStaticKey,
    'sliderMaxAmount' | 'sliderMediumAmount' | 'sliderMinAmount'
  >,
  number
> &
  Record<
    Exclude<
      TProductSelectorFormStaticKey,
      'sliderMaxAmount' | 'sliderMediumAmount' | 'sliderMinAmount'
    >,
    string
  >;

export type TAccount = Record<'accountNumber', string> &
  Partial<Record<'account_id' | 'bank_id' | 'index', number>>;

export type TAccountUnit = Record<'accounts', TAccount[]> &
  Record<'editable', boolean> &
  Record<'selectedAccount_id', string>;

export type TPaymentToken = Record<'index', number> &
  Partial<Record<'bankName', string> & Record<'disabled', boolean>> &
  Record<'id' | 'name', string>;

export type TPaymentTokenUnit = Record<'editable' | 'holiday', boolean> &
  Record<'selectedPaymentTokenId', string> &
  Record<'paymentTokens', TPaymentToken[]>;

export type TReasonId = Partial<Record<'reason_id', number>>;

export type TTokenData = Record<'name', string> &
  Record<'id' | 'index' | 'type', number>;

export type TConfirmData = Record<'paymentToken', TPaymentToken> &
  Record<'email', TEmail>;

export type TCreditParams = Record<'creditParams', TLoanData> &
  Partial<Record<'appnum', string>>;

export type TEmail = Record<'email', string> &
  Record<'emailConfirmed', boolean> &
  Record<'email_id', number>;

export type TLoanProposal = Record<
  | 'agreeLoan'
  | 'agreeDeclaration'
  | 'marketingConfirmation'
  | 'agreeFeis'
  | 'upsellEnabled',
  boolean
> &
  Record<
    'dateFrom' | 'dateTo' | 'paymentDate' | 'contract' | 'statement',
    string
  > &
  Record<'payment' | 'interestAmount' | 'totalAmount' | 'apr', number> &
  Record<'termFraction', TERM_FRACTION> &
  Record<'amountSegment', TSegments> &
  TProductSelectorData;

export type TCabinetApplication = Partial<
  Record<'flow', FLOW> &
    Record<'application', TCreditParams> &
    Record<'accountUnit', TAccountUnit> &
    Record<'documentUnits', TDocumentUnit[]> &
    Record<'notification', string> &
    Record<'loanProposal', TLoanProposal> &
    Record<'paymentTokenUnit', TPaymentTokenUnit /* | TPaymentTokens */> &
    Record<'email', TEmail> &
    Record<'dealInfos', TDealInfo[]>
>;

export type TDealInfo = Record<'dealNo' | 'closingDate', string> &
  Record<
    | 'closingAmount'
    | 'extensionAmount'
    | 'currentPlannedPaymentDebt'
    | 'paymentAmount',
    number
  > &
  Partial<
    Record<'lastPaymentDate' | 'maskedName', string> &
      Record<'documentUnits', TDocumentUnit[]> &
      Record<'lastPaymentAmount', number>
  >;

// сделака из ЛК
export type TCabinetDeals = Record<'dealInfos', TDealInfo[]> &
  Partial<Record<'notification', string>>;

//сделка из сайта (страница repayment)
export type TCabinetDeal = Record<'dealInfo', TDealInfo>;

export type TClientPhone = Record<'type_id', number> &
  Record<'phoneNumber', string>;

export type TClientAccount = Record<'bankName' | 'accnum', string>;

export type TClientArchive = Record<'dealDate' | 'dealNo', string> &
  Record<'documentUnits', TDocumentUnit[]>;
export type TExpiredDocument = Record<
  'channel' | 'body' | 'sender' | 'created' | 'dealno',
  string
> &
  Partial<Record<'subject', string>>;

/** Персональная информация Клиента для страницы personalinfo */
export type TCabinetClientInfo = Record<'lastName' | 'firstName', string> &
  Partial<Record<'pin' | 'passport' | 'birthDate' | 'expireDate', string>> &
  Partial<
    Record<'emails' | 'addresses', string[]> &
      Record<'phones', TClientPhone[]> &
      Record<'accounts', TClientAccount[]> &
      Record<'dealDocumentsList', TClientArchive[]> &
      Record<'expiredDocument', TExpiredDocument>
  >;

export type TCabinetNotify = Partial<
  Record<'displayConfirmation' | 'closable', boolean> &
    Record<'id', number> &
    Record<'text', string>
>;

export type TUpdateAccountProps = Record<'name', string> & Record<'value', any>;

export type TAppDealParams = TJSON;

export type TCabinetPay = Record<'dealNo', string> &
  Record<'paymentAmount', number> &
  Record<'inCabinet', boolean>;

export type TNotifyItem = Record<'id', number> &
  Record<'text', string> &
  Record<'displayConfirmation' | 'closable', boolean>;
