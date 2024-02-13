import React, { useRef, useCallback, useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';

import style from './OtpOneField.module.scss';

import cfg from '@root/config.json';
import { FIELD_NAME, URIS_SUFFIX } from '@src/constants';
import { handleErrors } from '@utils';
import { TOtpOneFieldProps, TOtpOneFieldPropsStore } from './@types';
import { STORE_IDS, staticApi } from '@stores';
import { AbstractRoles, WidgetRoles } from '@src/roles';
import { ReactInputMaskWidget } from '@components/widgets/ReactInputMaskWidget';
import { ButtonWidget, BUTTON_TYPE } from '@components/widgets/ButtonWidget';
import { INPUT_TYPE } from '@components/widgets/InputWidget';
import { ModalWindow } from '@components/popup';

function OtpOneFieldComponent(props: TOtpOneFieldProps) {
  const { otpStore, className, loanStore, userStore, page } =
    props as TOtpOneFieldPropsStore;

  const [isDisable, setIsDisable] = useState(false);
  const [serviceMessage, setServiceMessage] = useState('');

  const otpPopup = useRef<HTMLDivElement>(null);
  const otpInput = useRef<HTMLInputElement>(null);

  const renderOtpData = useCallback((otpCode: string) => {
    if (otpCode) {
      return (
        <div
          ref={otpPopup}
          className={style.testOtp}
          onAnimationEnd={() => {
            if (otpPopup.current) otpPopup.current.remove();
          }}
        >
          {otpCode}
        </div>
      );
    }
  }, []);

  const checkOtp = useCallback(async () => {
    const { otpCode } = otpStore;

    if (new RegExp(cfg.otpFormat).test(otpCode)) {
      otpStore.updateOtpDisabled(true);
      props.action();
    }
  }, [otpStore, props]);

  const onChangeHandle = useCallback(
    (data: any) => {
      otpStore.updateOtpValue(data.value);
      otpStore.resetOtpWrong();
      checkOtp();
    },
    [checkOtp, otpStore]
  );

  const resendOtp = useCallback(() => {
    setIsDisable(true);

    if (page == URIS_SUFFIX.APPLICATION) {
      otpStore.updateOtpValue('');
      otpStore.resetOtpWrong();
      otpStore.updateOtpState({});
      loanStore.cabinetSign(
        { account: { ...loanStore.currentPaymentToken } },
        otpStore,
        () => setIsDisable(false)
      );

      return;
    }

    otpStore.updateOtpValue('');
    otpStore.resetOtpWrong();
    otpStore.updateOtpDisabled(false);
    otpStore.updateOtpState({});
    userStore.sendUserData(userStore.userData, otpStore);
  }, [loanStore, otpStore, page, userStore]);

  useEffect(() => {
    const initServiceMessage = async () => {
      const serviceMessage = await staticApi.fetchStaticValue({
        block: 'orange-maintenance',
        path: 'static',
      });

      if (serviceMessage && serviceMessage.value)
        setServiceMessage(serviceMessage.value);
    };

    initServiceMessage();
  }, []);

  useEffect(() => {
    otpStore
      .initOtpForm()
      .then(() => otpStore.resend())
      .then(() => {
        if (otpInput.current) {
          otpInput.current.focus();
        }

        return;
      })
      .catch((err) => handleErrors(err));
  }, [otpStore]);

  /** Зчитування OTP-коду із SMS і
   * автозаповнення значення поля цим кодом */
  useEffect(() => {
    if ('OTPCredential' in window) {
      const ac = new AbortController();

      navigator.credentials
        .get({
          otp: { transport: ['sms'] },
          signal: ac.signal,
        })
        .then((otp) => {
          if (otp) {
            onChangeHandle({
              value: otp.code,
            });
            //checkOtp(); //moved to onChangeHandle
            ac.abort();
          }
          return;
        })
        .catch((err) => {
          console.error(err);
          ac.abort();
        });
    }
  }, [checkOtp, onChangeHandle]);

  if (otpStore.otpFormStatic) {
    return (
      <div className={className}>
        {renderOtpData(otpStore.testerData)}
        {otpStore.otpWrong && (
          <p className={classNames(style.item, style.message)}>
            {otpStore.otpFormStatic.wrongOtp}
          </p>
        )}
        <ReactInputMaskWidget
          id={`Otp-${AbstractRoles.input}-${INPUT_TYPE.TEL}-${FIELD_NAME.OTP}`}
          name={FIELD_NAME.OTP}
          value={otpStore.otpCode}
          className={''}
          inputClassName={style.input}
          invalid={otpStore.otpWrong}
          type={INPUT_TYPE.TEL}
          mask={cfg.otpMask}
          maskChar={''}
          placeholder={otpStore.otpFormStatic.codeLabel}
          onChange={(event) =>
            onChangeHandle({
              name: event.currentTarget.name,
              value: event.currentTarget.value,
            })
          }
          //onKeyUp={checkOtp} //moved to onChangeHandle
          disabled={otpStore.otpIsDisabled}
          /* placeholderEmbedded */
          ref={otpInput}
          autoComplete={'one-time-code'}
        />
        {otpStore.showResend && (
          <div className={classNames('resend', style.resend)}>
            <ButtonWidget
              id={`Otp-${WidgetRoles.button}`}
              type={BUTTON_TYPE.BUTTON}
              className={classNames(style.button)}
              onClick={resendOtp}
              disabled={isDisable}
            >
              {otpStore.otpFormStatic.sendOtp}
            </ButtonWidget>
          </div>
        )}
        {serviceMessage && (
          <ModalWindow
            textData={serviceMessage}
            declineHandler={() => {
              setServiceMessage('');
            }}
          />
        )}
      </div>
    );
  }

  return null;
}

export const OtpOneField = inject(
  STORE_IDS.OTP_STORE,
  STORE_IDS.LOAN_STORE,
  STORE_IDS.USER_STORE
)(observer(OtpOneFieldComponent));
