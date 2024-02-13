import { LoyaltyStore } from '@src/stores/LoyaltyStore';

export type TLoyaltyServiceMessageProps = Partial<
  Record<'className', string> & Record<'isCabinet', boolean>
>;

export type TLoyaltyServiceMessagePropsStore = Record<
  'loyaltyStore',
  LoyaltyStore
> &
  TLoyaltyServiceMessageProps;

export type TMessages = Record<'message', string> &
  Partial<Record<'bufferText', string>>;
