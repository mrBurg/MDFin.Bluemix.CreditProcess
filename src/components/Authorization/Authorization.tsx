import React from 'react';
import { PureComponent, FormEvent } from 'react';
import difference from 'lodash/difference';
import reduce from 'lodash/reduce';
import size from 'lodash/size';
import union from 'lodash/union';
import { inject } from 'mobx-react';

import { STORE_IDS } from '@stores';
import { FIELD_NAME, URIS_SUFFIX } from '@src/constants';
import { TField, TGetSignUpData } from '@stores-types/userStore';
import { handleErrors, validator } from '@utils';
import { TCheckboxData } from '@components/widgets/CheckboxWidget/@types';
import { ViewAuthorization } from './View';
import {
  TAuthorizationProps,
  TAuthorizationPropsStore,
  TFieldData,
  TState,
} from './@types';

@inject(
  STORE_IDS.OTP_STORE,
  STORE_IDS.LOAN_STORE,
  STORE_IDS.USER_STORE,
  STORE_IDS.PAGE_STORE
)
// @observer
export class Authorization extends PureComponent<TAuthorizationProps> {
  public readonly state: TState = {
    // lastName: '',
    phoneNumber: '',
    marketing: false,
    invalidFields: [],
    formDisabled: false,
    isRenderMarketingPopup: false,
    termsAndConditionsDocType: '',
    itsSignUp: false,
  };

  constructor(props: TAuthorizationPropsStore) {
    super(props);

    this.state = {
      ...this.state,
      itsSignUp: props.page == URIS_SUFFIX.SIGN_UP,
    };
  }

  async componentDidMount(): Promise<void> {
    const { loanStore, userStore } = this.props as TAuthorizationPropsStore;

    if (!this.state.itsSignUp) {
      return;
    }

    const termsDocType = await loanStore.getTermsAndConditionsDocType();

    if (userStore.userData.marketing && userStore.userData.phoneNumber) {
      this.setState((state) => ({
        ...state,
        formDisabled: true,
        phoneNumber: userStore.userData.phoneNumber,
        marketing: userStore.userData.marketing,
        termsAndConditionsDocType: termsDocType,
      }));
    } else if (userStore.userData.marketing || userStore.userData.phoneNumber) {
      this.setState((state) => ({
        ...state,
        phoneNumber: userStore.userData.phoneNumber,
        marketing: userStore.userData.marketing,
        termsAndConditionsDocType: termsDocType,
      }));
    } else {
      this.setState((state) => ({
        ...state,
        termsAndConditionsDocType: termsDocType,
      }));
    }

    const { phoneNumber } =
      (await userStore.getSignUp_Data()) as TGetSignUpData;

    if (phoneNumber) {
      this.setState((state) => ({
        ...state,
        phoneNumber,
      }));
    }
  }

  componentWillUnmount() {
    const { otpStore, userStore } = this.props as TAuthorizationPropsStore;
    otpStore.resetOtpParams();

    userStore.resetStore_UserData();
  }

  /** Список полей для валидации */
  private validateItems() {
    return [{ name: FIELD_NAME.PHONE_NUMBER, value: this.state.phoneNumber! }];
  }

  private async submitForm() {
    const { itsSignUp, marketing } = this.state;

    this.setState((state) => ({ ...state, formDisabled: true }));

    const res = await this.validateForm(this.validateItems());

    if (!res) {
      this.setState((state) => ({ ...state, formDisabled: false }));

      return;
    }

    if (itsSignUp && !marketing) {
      /** показываем  marketingPopup */
      this.setState((state) => ({ ...state, isRenderMarketingPopup: true }));

      return;
    }
    this.sendUserData();
  }

  private async sendUserData() {
    const { userStore, otpStore, loanStore, page } = this
      .props as TAuthorizationPropsStore;
    let {
      loanData: { amount, term },
      termFraction,
    } = loanStore;
    const fixedAmount = true;

    if (amount == 0 || term == 0) {
      await loanStore.getCalculatorParams();

      amount = loanStore.loanData.amount;
      term = loanStore.loanData.term;
      termFraction = loanStore.termFraction;
    }

    otpStore.updateUrisKey(page);
    userStore
      .sendUserData(this.state, otpStore, {
        amount,
        term,
        termFraction,
        fixedAmount,
      })
      .then(() =>
        this.setState((state) => ({
          ...state,
          formDisabled: true,
          showOtpForm: otpStore.otpReady,
        }))
      )
      .catch((err) => {
        handleErrors(err);
      });
  }

  private onSubmitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    this.submitForm();
  };

  private validateField = async (data: TFieldData) => {
    this.validateForm([{ name: data.name, value: data.value }]);
  };

  private async validateForm(validateItems: TField[]) {
    const { userStore } = this.props as TAuthorizationPropsStore;
    const validateItemsNames = reduce(
      validateItems,
      (accum, itemName) => {
        accum.push(itemName.name);

        return accum;
      },
      [] as string[]
    );

    const validateResult = validator(validateItems, userStore);

    await this.setInvalidFields(validateResult, validateItemsNames);

    return !size(this.state.invalidFields);
  }

  /** добавить невалидные/убрать валидные поля из State
   * @param validateResult - список невалидных полей
   * @param validateItemsNames - список имен полей для валидации
   */
  private setInvalidFields = async (
    validateResult: string[],
    validateItemsNames: string[]
  ) => {
    const invalidFields: string[] = this.state.invalidFields;

    if (size(validateResult)) {
      this.setState((state) => ({
        ...state,
        invalidFields: union(validateResult, invalidFields),
      }));
    } else {
      this.setState((state) => ({
        ...state,
        invalidFields: difference(invalidFields, validateItemsNames),
      }));
    }
  };

  private onChangeHandlerPhone = (data: TFieldData) =>
    this.setState((state) => ({
      ...state,
      [data.name]: data.value.replace(/[\s-_]/g, ''),
    }));

  private onChangeHandleCheckBox = (data: TCheckboxData) =>
    this.setState((state) => ({
      ...state,
      [data.name as string]: data.checked,
    }));

  private updateMarketing = (marketing: boolean) => {
    this.setState(
      (state) => ({
        ...state,
        isRenderMarketingPopup: false,
        marketing,
      }),
      this.sendUserData
    );
  };

  private otpAction = () => {
    const { otpStore } = this.props as TAuthorizationPropsStore;

    otpStore.validateOtp();
  };

  render() {
    return (
      <ViewAuthorization
        model={Object.assign(
          {},
          this.state,
          this.props as TAuthorizationPropsStore
        )}
        controller={{
          onSubmitHandler: this.onSubmitHandler,
          onChangeHandlerPhone: this.onChangeHandlerPhone,
          onChangeHandleCheckBox: this.onChangeHandleCheckBox,
          validateField: this.validateField,
          otpAction: this.otpAction,
          marketingAccept: () => this.updateMarketing(true),
          marketingDecline: () => this.updateMarketing(false),
          marketingClose: () =>
            this.setState((state) => ({
              ...state,
              formDisabled: false,
              isRenderMarketingPopup: false,
            })),
        }}
      />
    );
  }
}
