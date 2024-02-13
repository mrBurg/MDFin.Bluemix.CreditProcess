import { TCheckboxData } from '@components/widgets/CheckboxWidget/@types';
import { LoanStore } from '@src/stores/LoanStore';
import { OtpStore } from '@src/stores/OtpStore';
import { PageStore } from '@src/stores/PageStore';
import { UserStore } from '@src/stores/UserStore';
import { FormEvent } from 'react';

export type TAuthorizationPropsStore = {
  loanStore: LoanStore;
  userStore: UserStore;
  pageStore: PageStore;
  otpStore: OtpStore;
};

export type TFieldData = {
  name: string;
  value: string;
};

export type TState = {
  marketing: boolean;
  invalidFieldsList: any[];
  formDisabled: boolean;
  isRenderMarketingPopup: boolean;
  firstName?: string;
  phoneNumber?: string;
  termsDocType?: string;
};

export type TViewProps = {
  model: TState & TAuthorizationPropsStore;
  controller: {
    onSubmitHandler: (event: FormEvent<HTMLFormElement>) => void;
    onChangeHandler: (data: TFieldData) => void;
    onBlurFields: (data: TFieldData) => void;
    onChangeHandlerPhone: (data: TFieldData) => void;
    onChangeHandleCheckBox: (data: TCheckboxData) => void;
    validateField: (data: TFieldData) => void;
    otpAction: () => void;
    marketingAccept: () => void;
    marketingDecline: () => void;
    marketingClose: () => void;
  };
};
