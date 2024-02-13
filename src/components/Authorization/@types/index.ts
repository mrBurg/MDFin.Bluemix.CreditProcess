import { TCheckboxData } from '@components/widgets/CheckboxWidget/@types';
import { URIS_SUFFIX } from '@src/constants';
import { LoanStore } from '@src/stores/LoanStore';
import { UserStore } from '@src/stores/UserStore';
import { PageStore } from '@src/stores/PageStore';
import { OtpStore } from '@src/stores/OtpStore';
import { FormEvent } from 'react';

export type TAuthorizationProps = {
  page: URIS_SUFFIX;
  formHeader?: boolean;
};

export type TAuthorizationPropsStore = {
  loanStore: LoanStore;
  userStore: UserStore;
  pageStore: PageStore;
  otpStore: OtpStore;
} & TAuthorizationProps;

export type TFieldData = {
  name: string;
  value: string;
};

export type TState = {
  itsSignUp: boolean;
  marketing: boolean;
  invalidFields: any[];
  formDisabled: boolean;
  isRenderMarketingPopup: boolean;
  // lastName?: string;
  // firstName?: string;
  phoneNumber?: string;
  termsAndConditionsDocType?: string;
};

export type TViewProps = {
  model: TState & TAuthorizationPropsStore;
  controller: {
    onSubmitHandler: (event: FormEvent<HTMLFormElement>) => void;
    onChangeHandlerPhone: (data: TFieldData) => void;
    onChangeHandleCheckBox: (data: TCheckboxData) => void;
    validateField: (data: TFieldData) => void;
    otpAction: () => void;
    marketingAccept: () => void;
    marketingDecline: () => void;
    marketingClose: () => void;
  };
};
