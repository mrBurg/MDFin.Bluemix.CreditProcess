import Router from 'next/router';
import { observable, action, runInAction, makeObservable } from 'mobx';

import { TJSON } from '@interfaces';
import { URIS, URLS } from '@routes';
import { OtpApi } from '@src/apis';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@src/constants';
import { setToLocalStorage, getMD5, isProd, getUrlSlug } from '@utils';
import {
  TOtpFormStatic,
  TOtpOneFieldFormStatic,
  TOtpProps,
} from './@types/otpStore';
import { UserStore } from './UserStore';
import cfg from '@root/config.json';
import { staticApi } from '@stores';

export class OtpStore {
  @observable public otpReady = false;
  @observable public testerData = '';
  @observable public otpIsDisabled = false;
  @observable public otpId: number | undefined = 0;
  @observable public otpCode = '';
  @observable public otpWrong = false;
  @observable public showResend = false;
  @observable public validForm = true;
  @observable otpFormStatic?: TOtpFormStatic & TOtpOneFieldFormStatic;
  public urisKey = '';

  @observable public otpAgreeCheckbox = false;

  constructor(private otpApi: OtpApi, private userStore: UserStore) {
    makeObservable(this);
  }

  //To delete
  @action
  setOptReady(state: boolean) {
    this.otpReady = state;
  }
  //end delete

  @action
  setValidForm(state: boolean) {
    this.validForm = state;
  }

  /** Запуск таймера показа кнопки "Отправить ОТР снова" */
  @action
  resend() {
    setTimeout(
      () => runInAction(() => (this.showResend = true)),
      cfg.showResend
    );
  }

  @action
  public async updateOtpState({ action, otpId, phoneNumber }: TOtpProps) {
    this.otpReady = !!otpId;
    this.showResend = false;
    this.otpId = otpId;

    if (!isProd && this.otpId) {
      const requestConfig = this.otpApi.postHeaderRequestConfig(URIS.GET_OTP, {
        action,
        otpId,
        phoneNumber,
      });

      const { otpCode } = await this.otpApi.getOtp(requestConfig);

      runInAction(() => {
        // console.log(`%c${otpCode}`, 'color: #ffff00');

        this.testerData = otpCode;
      });
    }
  }

  @action
  public updateOtpDisabled(state: boolean) {
    this.otpIsDisabled = state;
  }

  /** Меняем значение введенного поля ОТП-код */
  @action
  public updateOtpValue(otpCode: string) {
    this.otpCode = otpCode;
  }

  @action
  public updateUrisKey(urisKey: string) {
    this.urisKey = urisKey;
  }

  /** Очищаем поле ввода ОТР от ошибки (крассная рамка + сообщение) */
  @action
  public resetOtpWrong() {
    this.otpWrong = false;
  }

  public async initOtpForm(): Promise<void> {
    const otpFormStatic = (await staticApi.fetchStaticData({
      block: 'otp-form',
      path: 'form',
    })) as TOtpFormStatic & TOtpOneFieldFormStatic;

    runInAction(() => (this.otpFormStatic = otpFormStatic));
  }

  //После успешной валидации ОТП, сбрасываем все его параметры на дефолтные.
  @action
  public resetOtpParams() {
    this.otpReady = false;
    this.testerData = '';
    this.otpIsDisabled = false;
    this.otpId = 0;
    this.otpCode = '';
    this.otpWrong = false;
    this.showResend = false;
    this.otpAgreeCheckbox = false;
  }

  /** Валидация ОТП, при верификации номера телефона (логин/регистрация) */
  public async validateOtp() {
    const { userData } = this.userStore;
    const data = {
      ...userData,
      fingerprint: this.otpApi.getFingerPrint,
      otpCode: this.otpCode,
    };

    const requestConfig = this.otpApi.postHeaderRequestConfig(
      (URIS as TJSON)[`VALIDATE_OTP${this.urisKey}`],
      data
    );

    const validatorResponse = await this.otpApi.validateOtp(requestConfig);

    if (validatorResponse) {
      if (validatorResponse.tokens) {
        const { accessToken, refreshToken } = validatorResponse.tokens;

        runInAction(() => (this.otpIsDisabled = true));

        setToLocalStorage(getMD5(ACCESS_TOKEN_KEY), accessToken);
        setToLocalStorage(getMD5(REFRESH_TOKEN_KEY), refreshToken);

        const response = await this.otpApi.getClientNextStep(accessToken);

        // после успешной валидации OTP, делаем сброс параметров OTP
        this.resetOtpParams();

        if (response && response.view) {
          if (response.view == URLS.index) {
            return (window.location = URLS.HOME as string & Location);
          }

          const { routeUrl, routeAsPath } = getUrlSlug(response.view);

          return Router.replace(routeUrl, routeAsPath);
        }
      }

      if (validatorResponse.view) {
        const { routeUrl, routeAsPath } = getUrlSlug(
          URLS[validatorResponse.view]
        );

        return Router.replace(routeUrl, routeAsPath);
      }
    }

    /* если ОТП не валидный */
    runInAction(() => {
      this.otpIsDisabled = false;
      this.otpWrong = true;
      this.showResend = true;
      this.updateOtpValue('');
    });
  }

  /** Валидация ОТП, при подписании заявки */
  // public async cabinetConfirm(): Promise<void | boolean> {
  //   //return null;
  //   const { ...data } = { otpId: this.otpId, otpCode: this.otpCode };

  //   const requestConfig = this.otpApi.postHeaderRequestConfig(
  //     URIS.CABINET_CONFIRM,
  //     data
  //   );

  //   const authRes = await this.otpApi.validateOtp(requestConfig);

  //   if (authRes) {
  //     //const { accessToken } = authRes;

  //     runInAction(() => (this.otpIsDisabled = true));

  //     const response = await this.otpApi.getClientNextStep();
  //     if (response) {
  //       const { view } = response;

  //       // после успешной валидации OTP, делаем сброс параметров OTP
  //       this.resetOtpParams();

  //       return Router.replace(view);
  //     }
  //     //return null;
  //   }

  //   /* если ОТП не валидный */
  //   runInAction(() => {
  //     this.otpIsDisabled = false;
  //     this.otpWrong = true;
  //     this.updateOtpValue('');
  //   });
  // }
}
