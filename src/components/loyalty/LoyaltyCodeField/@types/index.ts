import { LoyaltyStore } from '@src/stores/LoyaltyStore';

export type TLoyaltyCodeFieldProps = Partial<Record<'className', string>> &
  Partial<
    Record<
      | 'isTooltip'
      | 'isTitle'
      | 'isErrorMessage'
      | 'isPlaceholder'
      | 'permanentNotify',
      boolean
    >
  >;

export type TLoyaltyCodeFieldStores = {
  loyaltyStore: LoyaltyStore;
} & TLoyaltyCodeFieldProps;
