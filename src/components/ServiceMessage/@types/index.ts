import { LoyaltyStore } from '@src/stores/LoyaltyStore';

export type TServiceMessageProps = {
  className?: string;
  isCabinet?: boolean;
};

export type TServiceMessagePropsStore = {
  loyaltyStore: LoyaltyStore;
} & TServiceMessageProps;

export type TMessage = {
  message: string;
  className: string;
  bufferText?: string;
};
/* export type TMessages = {
  onCabinet: TMessage[];
  onLanding: TMessage[];
}; */

export type TMessages = TMessage[];
