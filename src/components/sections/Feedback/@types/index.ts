import { TContactsProps } from '@components/sections/Contacts/@types';

type TTermsAndConditions = {
  text: string;
  link: string;
};

export type TFeedback = {
  workHour: string;
  termsAndConditions: TTermsAndConditions;
  className?: string;
} & TContactsProps;
