import React, {
  ReactElement,
  PureComponent,
  RefObject,
  createRef,
  FormEvent,
} from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import { action } from 'mobx';
import difference from 'lodash/difference';
import each from 'lodash/each';
import size from 'lodash/size';
import union from 'lodash/union';
import { CheckboxProps } from 'semantic-ui-react';

import style from './Otp.module.scss';

import { otpMask, maskChar } from '@root/config.json';
import { FIELD_NAME, URIS_SUFFIX } from '@src/constants';
import { handleErrors, validator } from '@utils';
import { TFieldData, TOtpProps, TOtpPropsStore, TState } from './@types';

import { CheckboxWidget } from '@components/widgets/CheckboxWidget';
import { WithLink, WithTracking } from '@components/hocs';
import { EMouseEvents } from '@src/trackingConstants';
import { STORE_IDS } from '@stores';
import { AbstractRoles, NonStandardRoles, WidgetRoles } from '@src/roles';
import { ReactInputMaskWidget } from '@components/widgets/ReactInputMaskWidget';
import { TField } from '@stores-types/userStore';
import { ButtonWidget, BUTTON_TYPE } from '@components/widgets/ButtonWidget';
import { INPUT_TYPE } from '@components/widgets/InputWidget';

@inject(STORE_IDS.OTP_STORE, STORE_IDS.LOAN_STORE, STORE_IDS.USER_STORE)
@observer
export class Otp extends PureComponent<TOtpProps> {
  public readonly state: TState = {
    invalidFields: [],
  };

  private otpPopup: RefObject<HTMLDivElement> = createRef();

  public componentDidMount(): void {
    const { otpStore } = this.props as TOtpPropsStore;

    otpStore
      .initOtpForm()
      .then(() => {
        otpStore.resend();

        return;
      })
      .catch((err) => {
        handleErrors(err);
      });
  }

  /** Список полей для валидации */
  private async validateItems(): Promise<TField[]> {
    const { otpStore, page } = this.props as TOtpPropsStore;
    let validateItems: TField[] = [];

    if (page == URIS_SUFFIX.SIGN_UP) {
      validateItems = [
        {
          name: FIELD_NAME.OTP_AGREE_CHECKBOX,
          value: otpStore.otpAgreeCheckbox!,
        },
      ];
    }
    return validateItems;
  }

  private async validateForm(validateItems: TField[]): Promise<boolean> {
    const { userStore } = this.props as TOtpPropsStore;

    const validateItemsNames: string[] = [];
    each(validateItems, (itemName: TField) => {
      validateItemsNames.push(itemName.name);
    });
    //let invalidFields: string[] = this.state.invalidFields;
    if (userStore) {
      const validateResult: string[] = validator(validateItems, userStore);
      await this.setInvalidFields(validateResult, validateItemsNames);
    }

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
      this.setState((state: TState): TState => {
        return {
          ...state,
          invalidFields: union(validateResult, invalidFields),
        };
      });
    } else {
      this.setState((state: TState): TState => {
        return {
          ...state,
          invalidFields: difference(invalidFields, validateItemsNames),
        };
      });
    }
  };

  private renderOtpData(otpCode: string) {
    return (
      <div
        ref={this.otpPopup}
        className={style.testOtp}
        onAnimationEnd={() => {
          if (this.otpPopup.current) {
            this.otpPopup.current.remove();
          }
        }}
      >
        {otpCode}
      </div>
    );
  }

  private checkOtp = async () => {
    const { otpStore } = this.props as TOtpPropsStore;

    if (!~otpStore.otpCode.search(maskChar) && otpStore.otpCode !== '') {
      const validateItems = await this.validateItems();
      const res = await this.validateForm(validateItems);
      if (!res) {
        return;
      }

      otpStore.updateOtpDisabled(true);
      this.props.action();
    }
  };

  private resendOtp = () => {
    const { otpStore, loanStore, userStore, page } = this
      .props as TOtpPropsStore;

    otpStore.updateOtpValue('');
    otpStore.resetOtpWrong();

    if (page == URIS_SUFFIX.APPLICATION) {
      otpStore.updateOtpState({});

      loanStore.cabinetSign(
        { account: loanStore.currentPaymentToken },
        otpStore
      );

      return;
    }

    otpStore.updateOtpDisabled(false);
    otpStore.updateOtpState({});
    userStore.sendUserData(userStore.userData, otpStore);
  };

  private onChangeHandle = (data: TFieldData) => {
    const { otpStore } = this.props as TOtpPropsStore;

    otpStore.updateOtpValue(data.value);
    otpStore.resetOtpWrong();
  };

  @action
  private onChangeHandleCheckBox = (
    _event: FormEvent<HTMLInputElement>,
    data: CheckboxProps
  ) => {
    const { otpStore } = this.props as TOtpPropsStore;

    otpStore.otpAgreeCheckbox = data.checked as boolean;
    this.checkOtp();
  };

  render(): ReactElement | null {
    const { invalidFields } = this.state;
    const { className, page, otpStore } = this.props as TOtpPropsStore;

    if (otpStore.otpFormStatic) {
      const itsSignUp = page == URIS_SUFFIX.SIGN_UP;

      return (
        <div className={className}>
          {otpStore.testerData && this.renderOtpData(otpStore.testerData)}
          {itsSignUp && (
            <div className={style.agree_terms}>
              <CheckboxWidget
                name={FIELD_NAME.OTP_AGREE_CHECKBOX}
                onChange={this.onChangeHandleCheckBox}
                invalid={invalidFields.includes(FIELD_NAME.OTP_AGREE_CHECKBOX)}
                checked={otpStore.otpAgreeCheckbox}
              />
              <WithTracking
                id={`Otp-${NonStandardRoles.textWithHTML}`}
                events={[EMouseEvents.CLICK]}
              >
                <WithLink
                  linkClassName={style.link}
                  links={otpStore.otpFormStatic.links}
                >
                  <div className={style.agree_text}>
                    {otpStore.otpFormStatic.termsAndConditions}
                  </div>
                </WithLink>
              </WithTracking>
            </div>
          )}
          <ReactInputMaskWidget
            id={`Otp-${AbstractRoles.input}-${INPUT_TYPE.TEL}-${FIELD_NAME.OTP}`}
            name={FIELD_NAME.OTP}
            value={otpStore.otpCode}
            className={style.input}
            invalid={otpStore.otpWrong}
            type={INPUT_TYPE.TEL}
            mask={otpMask}
            placeholder={otpMask.replace(/9/g, '*')}
            onChange={(event) =>
              this.onChangeHandle({
                name: event.currentTarget.name,
                value: event.currentTarget.value,
              })
            }
            onKeyUp={this.checkOtp}
            disabled={otpStore.otpIsDisabled}
          />
          <div className={classNames('resend', style.resend)}>
            {otpStore.otpWrong && (
              <p className={classNames(style.item, style.message)}>
                {otpStore.otpFormStatic.wrongOtp}
              </p>
            )}
            {otpStore.showResend && (
              <ButtonWidget
                id={`Otp-${WidgetRoles.button}`}
                type={BUTTON_TYPE.BUTTON}
                className={classNames(style.item, style.button)}
                onClick={this.resendOtp}
              >
                {otpStore.otpFormStatic.sendOtp}
              </ButtonWidget>
            )}
          </div>
        </div>
      );
    }

    return null;
  }
}
