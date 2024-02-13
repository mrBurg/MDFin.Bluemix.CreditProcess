import { TPaymentTokenUnit } from '@stores-types/loanStore';
import { TDirectoryItem } from '@stores-types/pageStore';
import { LAYOUT } from '..';
import { STORE_IDS, TStores } from '@stores';

export type TAccountsFormProps = Partial<
  Record<'className' | 'borderClassName' | 'page', string> &
    Record<'showHolidayNotify', boolean> &
    Record<'layout', LAYOUT>
> &
  TPaymentTokenUnit;

export type TAccountsFormPropsStore = Pick<
  TStores,
  STORE_IDS.PAGE_STORE | STORE_IDS.LOAN_STORE | STORE_IDS.OTP_STORE
> &
  TAccountsFormProps;

export type TFormattedAccount = TDirectoryItem &
  Partial<Record<'bank_id', number> & Record<'selected', boolean>>;

export type TLibraPayRequest = Record<
  'request',
  Record<'url' | 'body', string>
>;
