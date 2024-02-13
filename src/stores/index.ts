import { useMemo } from 'react';

import { TJSON } from '@interfaces';
import {
  // CommonApi,
  TrackingApi,
  LoanApi,
  UserApi,
  OtpApi,
  StaticApi,
  PageApi,
  LoyaltyApi,
  RepaymentApi,
} from '@src/apis';
import { isServer } from '@utils';
import { LoanStore } from './LoanStore';
import { LocaleStore } from './LocaleStore';
import { OtpStore } from './OtpStore';
import { PageStore } from './PageStore';
import { RepaymentStore } from './RepaymentStore';
import { TrackingStore } from './TrackingStore';
import { UserStore } from './UserStore';
import { LoyaltyStore } from './LoyaltyStore';

export enum STORE_IDS {
  TRACKING_STORE = 'trackingStore',
  LOCALE_STORE = 'localeStore',
  PAGE_STORE = 'pageStore',
  LOAN_STORE = 'loanStore',
  REGISTRATION_STORE = 'registrationStore',
  REPAYMENT_STORE = 'repaymentStore',
  USER_STORE = 'userStore',
  OTP_STORE = 'otpStore',
  LOYALTY_STORE = 'loyaltyStore',
}

type TUseStoreProps = Partial<Record<'context' | 'pageData', TJSON>>;

export type TStores = {
  [STORE_IDS.LOCALE_STORE]: LocaleStore;
  [STORE_IDS.TRACKING_STORE]: TrackingStore;
  [STORE_IDS.PAGE_STORE]: PageStore;
  [STORE_IDS.LOAN_STORE]: LoanStore;
  [STORE_IDS.REPAYMENT_STORE]: RepaymentStore;
  [STORE_IDS.USER_STORE]: UserStore;
  [STORE_IDS.OTP_STORE]: OtpStore;
  [STORE_IDS.LOYALTY_STORE]: LoyaltyStore;
};

// APIS for storages
// const commonApi: CommonApi = new CommonApi();
export const staticApi: StaticApi = new StaticApi();
const trackingApi: TrackingApi = new TrackingApi();
const loanApi: LoanApi = new LoanApi();
const userApi: UserApi = new UserApi();
const otpApi: OtpApi = new OtpApi();
const loyaltyApi: LoyaltyApi = new LoyaltyApi();
const pageApi: PageApi = new PageApi();
const repaymentApi: RepaymentApi = new RepaymentApi();

// Storages
const localeStore = new LocaleStore();
const repaymentStore = new RepaymentStore(repaymentApi);
const loyaltyStore = new LoyaltyStore(loyaltyApi);
const loanStore = new LoanStore(loanApi);
const userStore = new UserStore(userApi, loanStore);
const pageStore = new PageStore(pageApi, userStore);
const otpStore = new OtpStore(otpApi, userStore);
const trackingStore = new TrackingStore(trackingApi, userStore);

export let stores: TStores | undefined;

export function useStore(initialState: TUseStoreProps): TStores {
  return useMemo((): TStores => {
    const _stores: TStores = stores ?? {
      [STORE_IDS.TRACKING_STORE]: trackingStore,
      [STORE_IDS.LOCALE_STORE]: localeStore,
      [STORE_IDS.PAGE_STORE]: pageStore,
      [STORE_IDS.LOYALTY_STORE]: loyaltyStore,
      [STORE_IDS.LOAN_STORE]: loanStore,
      [STORE_IDS.REPAYMENT_STORE]: repaymentStore,
      [STORE_IDS.USER_STORE]: userStore,
      [STORE_IDS.OTP_STORE]: otpStore,
    };

    const { context, pageData } = initialState;

    if (pageData) {
      const { copyright, ...restProps } = pageData;

      pageStore.pageData = restProps;
      pageStore.copyright = copyright;
    }

    if (context) {
      const { locales, locale, defaultLocale, params } = context;

      pageStore.params = params || {};
      localeStore.localizationData = { locales, locale, defaultLocale };
    }

    if (isServer) {
      return _stores;
    }

    if (!stores) {
      stores = _stores;
    }

    return _stores;
  }, [initialState]);
}
