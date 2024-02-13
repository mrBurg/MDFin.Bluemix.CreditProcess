import { observable, action, runInAction, makeObservable } from 'mobx';
import Router from 'next/router';
import moment from 'moment';
import { CurrentDeviceInterface } from 'current-device';
import nodeify from 'nodeify-ts';
import each from 'lodash/each';
import isFunction from 'lodash/isFunction';
import isPlainObject from 'lodash/isPlainObject';
import noop from 'lodash/noop';

import { TJSON } from '@interfaces';
import { GetResult } from '@fingerprintjs/fingerprintjs';
import { URLS, URIS, applicationPages } from '@routes';
import { UserApi } from '@src/apis';
import {
  ACCESS_TOKEN_KEY,
  FINGER_PRINT_KEY,
  REFRESH_TOKEN_KEY,
  SESSION_ID_KEY,
  AB_ENABLED,
} from '@src/constants';
import {
  setToLocalStorage,
  getMD5,
  setCookie,
  handleErrors,
  toLocalDateFormat,
  isDev,
  removeItemFromLocalStorage,
  delCookie,
  getUrlSlug,
  prepareClientPersonalInfo,
} from '@utils';
import {
  TUserData,
  TUserAddress,
  TUserContacts,
  TUserJob,
  TUserObligatory,
  TValidateLead,
  TValidateEmail,
  TLoanRequest,
  TClientPersonalInfo,
  TClientAddInfo,
  TGetSignUpData,
  TAppProps,
} from './@types/userStore';
import { OtpStore } from './OtpStore';
import { LoanStore } from './LoanStore';
import { AUTH_PROVIDER } from '@context/contextConstants';

export class UserStore {
  devMenuAction = false;
  @observable userData = {} as TUserData;
  @observable clientPersonalInfo = {} as TClientPersonalInfo;
  @observable clientAddInfo = {} as TClientAddInfo;
  @observable userDataAddress = {} as TUserAddress;
  @observable userDataContacts = [] as TUserContacts[];
  @observable userDataJob = {} as TUserJob;
  @observable userLoggedIn = false;
  @observable userAuthState = AUTH_PROVIDER.NEED_CHECK;
  @observable userFirstName = '';
  @observable userLastName = '';
  @observable pageFrame?: string;
  @observable fingerprint?: GetResult;
  @observable device?: CurrentDeviceInterface = void 0;
  @observable visitorId? = '';
  @observable isCabinet = false;
  session_id?: string = void 0;
  flow?: string = void 0;

  constructor(private userApi: UserApi, private loanStore: LoanStore) {
    makeObservable(this);
  }

  @action
  updateClientPersonalInfo(clientPersonalInfo: TClientPersonalInfo) {
    this.clientPersonalInfo = Object.assign(
      {},
      this.clientPersonalInfo,
      clientPersonalInfo
    );
  }

  @action
  updateClientAddInfo(clientAddInfo: TClientAddInfo) {
    this.clientAddInfo = Object.assign({}, this.clientAddInfo, clientAddInfo);
  }

  fetchWithAuth(callback: () => void, tokenRequired = true): void {
    const accessToken = this.userApi.getAccessToken;

    if (accessToken) {
      const date = moment.now() / 1000;

      try {
        const { exp, iat } = JSON.parse(
          Buffer.from(accessToken.split('.')[1], 'base64').toString()
        );

        if (date <= iat || date >= exp) {
          nodeify(this.userApi.refreshToken(), callback);
        } else {
          callback();
        }
      } catch (err) {
        nodeify(this.userApi.refreshToken(), callback);
      }
    } else {
      if (tokenRequired && Router.route != URLS.HOME) {
        console.log(`Redirect to ${URLS.HOME}`);

        // if (response.view == URLS.index && !Router.router?.query.utm_content) {

        window.location = URLS.HOME as string & Location;
        // Router.replace(URLS.HOME);
      }

      callback();
    }
  }

  fetchWithAuthStartPage(callback: () => void, tokenRequired = true): void {
    const accessToken = this.userApi.getAccessToken;

    if (accessToken) {
      try {
        callback();
      } catch (err) {
        nodeify(this.userApi.refreshToken(), callback);
      }
    } else {
      if (tokenRequired && Router.route != URLS.phoneverify) {
        console.log(`Redirect to ${URLS.phoneverify}`);
        Router.replace(URLS.phoneverify);
      }
    }
  }

  @action
  async updateUserState() {
    this.userLoggedIn = Boolean(this.userApi.getAccessToken);

    if (this.userLoggedIn) {
      const { firstName: currentFirstName, lastName: currentLastName } =
        this.loanStore.cabinetClientInfo;

      if (currentFirstName && currentLastName) {
        runInAction(async () => {
          this.userFirstName = currentFirstName;
          this.userLastName = currentLastName;
        });

        return;
      }

      await this.loanStore.getCabinetClientInfo(false);
      const { firstName, lastName } = this.loanStore.cabinetClientInfo;

      runInAction(() => {
        this.userFirstName = firstName;
        this.userLastName = lastName;
      });
    }
  }

  async logOut() {
    const requestConfig = this.userApi.postHeaderRequestConfig(URIS.LOGOUT, {
      refreshToken: this.userApi.getRefreshToken,
      fingerprint: this.userApi.getFingerPrint,
    });

    const response = await this.userApi.logOut(requestConfig);

    if (response) {
      runInAction(() => {
        this.userFirstName = '';
        this.userLastName = '';
        this.loanStore.cleanStore_CabinetClientInfo();
      });

      const loggedOutStorageData = [ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY];
      const loggedOutCookiesData = [SESSION_ID_KEY];

      each(loggedOutStorageData, (item) =>
        removeItemFromLocalStorage(getMD5(item))
      );
      each(loggedOutCookiesData, (item) => delCookie(item));

      if (Router.route == URLS.HOME) {
        Router.reload();
      } else {
        window.location = URLS.HOME as string & Location;
        // Router.replace(URLS.HOME);
      }
    }

    this.updateUserState();
  }

  /** Очистка/сброс this.userData */
  @action
  resetStore_UserData(): void {
    this.userData = {};
  }

  /** Обновление данных пользователя */
  @action
  updateStore_UserData(data: TJSON): void {
    this.userData = Object.assign({}, this.userData, data);
  }

  /** Перезаписать место работы */
  @action
  overwriteStore_Job(dataJob: TJSON): void {
    //console.log(dataJob);
    this.userDataJob = {
      ...dataJob,
    };
  }

  /** Обновление места работы */
  @action
  updateStore_Job(dataJob: TUserJob): void {
    //console.log(dataJob);
    this.userDataJob = Object.assign({}, this.userDataJob, dataJob);
  }
  @action
  updateStore_JobContact(dataJob: TJSON): void {
    this.userDataJob = {
      ...this.userDataJob,
      contact: Object.assign({}, this.userDataJob.contact, dataJob),
    };
  }

  /** Обновление адреса - получение данный на визарде */
  @action
  updateStore_Address(
    dataAddress: TUserAddress,
    dataContacts?: TUserContacts[]
  ): void {
    this.userDataAddress = Object.assign({}, this.userDataAddress, dataAddress);
    this.userDataContacts = dataContacts!;
  }

  /** Обновление елемента адреса */
  @action
  updateStore_userDataAddress(data: TJSON): void {
    this.userDataAddress = Object.assign({}, this.userDataAddress, data);
  }

  /** Обновление елемента адреса (контакты)*/
  @action
  updateStore_userDataContacts(data: TJSON): void {
    const newArray = Object.assign({}, this.userDataContacts[0], data);

    this.userDataContacts = [newArray];
  }

  /** Удаление елемента адреса (контакты)*/
  @action
  removeStore_userDataContacts(keyName: string): void {
    const list = this.userDataContacts[0] as TJSON;
    delete list[keyName], list;
  }

  private notNeedRefreshView() {
    if (isDev && this.devMenuAction) {
      this.devMenuAction = false;

      return !this.devMenuAction;
    }

    return this.devMenuAction;
  }

  // Получить шаг клиента
  async getClientStep(callback = noop): Promise<any> {
    if (this.notNeedRefreshView()) {
      return;
    }

    if (this.userLoggedIn) {
      const response = await this.userApi.getClientNextStep();

      if (response) {
        if (AB_ENABLED && Boolean(Number(AB_ENABLED))) {
          if (
            response.view == URLS.index &&
            !Router.router?.query.utm_content
          ) {
            return (window.location = URLS.HOME as string & Location);
          }
        }

        const { routeUrl, routeAsPath } = getUrlSlug(response.view);

        switch (true) {
          // Необходимо исправить переход на главную
          case response.view == Router.route:
          case !applicationPages.includes(response.view):
            return callback();

          case applicationPages.includes(response.view):
            return Router.replace(routeUrl, routeAsPath);
        }
      }
    }

    callback();
  }

  /** Получить из сервиса следующий шаг/страницу */
  async getClientNextStep(callback = noop): Promise<any> {
    if (this.notNeedRefreshView()) {
      return;
    }

    const response = await this.userApi.getClientNextStep();

    if (response && response.pageFrame && response.pageFrame == 'error') {
      this.logOut();
    }

    if (response) {
      const { view, pageFrame } = response;

      runInAction(() => (this.pageFrame = pageFrame));

      const { routeUrl, routeAsPath } = getUrlSlug(view);
      console.log(`Refreshing of view to new ${routeAsPath || routeUrl}`);

      /* if (response.view == URLS.index) {
        // return (window.location = URLS.HOME as string & Location);
      } */

      if (view && view != Router.route) {
        return Router.replace(routeUrl, routeAsPath);
      }

      return callback();
    }

    callback();
  }

  /** Проверка доступности кнопки "Продолжить".
   * Возвращает в callBack, либо true (кнопка доступна), либо false (кнопка недоступна). */
  async postClientNextStep(
    data?: { view: string },
    callback = noop
  ): Promise<any> {
    const response = await this.userApi.postClientNextStep(data);

    if (response) {
      const { view, pageFrame } = response;

      runInAction(() => (this.pageFrame = pageFrame));

      const { routeUrl, routeAsPath } = getUrlSlug(view);
      console.log(`Refreshing of view to new ${routeUrl}`);

      /* if (response.view == URLS.index) {
        // return (window.location = URLS.HOME as string & Location);
      } */

      if (view && view != Router.route) {
        return Router.replace(routeUrl, routeAsPath);
      }
    }

    callback();
  }

  /** Проверка доступности кнопки "Продолжить".
   * Возвращает в callback, либо true (кнопка доступна), либо false (кнопка недоступна). */
  async viewCheck(data?: { view: string }, callback = noop): Promise<any> {
    const response = await this.userApi.viewCheck(data);

    //if (callback === noop) {} else {}
    callback(!!response);

    return;
  }

  async getPageFrameData(url: URIS) {
    const goalPageScript = await this.userApi.getPageFrameData(url);

    if (goalPageScript) {
      return goalPageScript;
    }
  }

  updateGoalpage(url: URIS) {
    this.userApi.updateGoalpage(url);
  }

  @action
  setSessionID(sessionID: string): void {
    this.session_id = sessionID;
    setCookie(SESSION_ID_KEY, this.session_id);
  }

  @action
  updateApp(data: TAppProps) {
    this.visitorId = data.fingerprint?.visitorId;
    this.fingerprint = data.fingerprint;
    this.device = data.device;
    this.isCabinet = data.isCabinet;

    if (this.visitorId) {
      setToLocalStorage(FINGER_PRINT_KEY, this.visitorId);
    }
  }

  /** Отправить данные для получения ОТП */
  async sendUserData(
    userData: TUserObligatory,
    otpStore: OtpStore,
    ...restProps: (TLoanRequest | (() => void))[]
  ): Promise<void> {
    let data = userData as TJSON;
    let callback = noop;

    each(restProps, (item) => {
      switch (true) {
        case isPlainObject(item):
          data = {
            ...data,
            loanRequest: item,
          };
          break;
        case isFunction(item):
          callback = item as () => void;

          break;
      }
    });

    const requestConfig = this.userApi.postHmacHeaderRequestConfig(
      (URIS as TJSON)[`SEND_OTP${otpStore.urisKey || ''}`],
      data
    );

    const otpData = await this.userApi.sendUserData(requestConfig);

    runInAction(() => {
      this.userData = Object.assign({}, userData, otpData);
    });

    const { otpId } = otpData;

    if (otpId) {
      return otpStore.updateOtpState({
        otpId,
        phoneNumber: userData.phoneNumber,
      });
    }

    callback();
  }

  /** Получить данные для Sign-up:
   *  номер телефона, если был введен при логине, перед редиректом
   *  со страницы sign-in на sign-up */
  async getSignUp_Data(): Promise<void | TGetSignUpData> {
    const requestConfig = this.userApi.getHeaderRequestConfig(
      URIS.OBLIGATORY_SIGN_UP
    );

    const response = await this.userApi.fetchWizardData(requestConfig);

    if (response && !response.showWarning) {
      return {
        phoneNumber: response.phoneNumber,
        firstName: response.firstName,
      };
    }
  }

  // Шаг. О Себе. Внесение информации (вручную)
  async getAllClientInfo(): Promise<void | boolean> {
    const requestConfig = this.userApi.getHeaderRequestConfig(
      URIS.ALL_CLIENT_INFO,
      this.userData
    );

    const response = await this.userApi.fetchWizardData(requestConfig);

    if (response && !response.showWarning) {
      const { clientPersonalInfo, clientAddInfo, flow } = response;

      this.updateClientPersonalInfo({
        ...clientPersonalInfo,
        birthDate: toLocalDateFormat(clientPersonalInfo.birthDate),
      });
      this.updateClientAddInfo(clientAddInfo);

      runInAction(() => {
        this.flow = flow;
      });
    }
  }

  // Шаг. Подтверждения персональной информации вычитанной с Фото ИД
  async getClientInfo(): Promise<void | boolean> {
    const personalInfoRequestConfig = this.userApi.getHeaderRequestConfig(
      URIS.PERSONAL_INFO,
      this.userData
    );

    const additionalInfoRequestConfig = this.userApi.getHeaderRequestConfig(
      URIS.ADDITIONAL_INFO,
      this.userData
    );

    Promise.all([
      this.userApi.fetchWizardData(personalInfoRequestConfig),
      this.userApi.fetchWizardData(additionalInfoRequestConfig),
    ])
      .then((data) => {
        const [{ clientPersonalInfo }, { clientAddInfo }] = data;

        // if (response && !response.showWarning) {
        // const { clientPersonalInfo, clientAddInfo } = response;

        this.updateClientPersonalInfo({
          ...clientPersonalInfo,
          birthDate: toLocalDateFormat(clientPersonalInfo.birthDate),
        });
        this.updateClientAddInfo(clientAddInfo);
        // }

        return;
      })
      .catch((err) => handleErrors(err));
  }

  /** Получить данные для Obligatory (wizard) */
  async getWizardData_Obligatory(): Promise<void | boolean> {
    const requestConfig = this.userApi.getHeaderRequestConfig(
      URIS.OBLIGATORY,
      this.userData
    );

    const response = await this.userApi.fetchWizardData(requestConfig);

    if (response && !response.showWarning) {
      const { obligatory } = response;

      this.updateStore_UserData({
        ...obligatory,
        birthDate: toLocalDateFormat(obligatory.birthDate) || '',
      });
    }
  }

  /** Получить данные для Address */
  async getWizardData_Address(): Promise<void | boolean> {
    const requestConfig = this.userApi.getHeaderRequestConfig(
      URIS.address,
      this.userData
    );

    const response = await this.userApi.fetchWizardData(requestConfig);

    if (response && !response.showWarning) {
      const { address, contacts } = response;

      this.updateStore_Address(address, contacts);
    }
  }

  /** Получить данные для Job */
  async getWizardData_Job(): Promise<void | boolean> {
    const requestConfig = this.userApi.getHeaderRequestConfig(
      URIS.job,
      this.userData
    );

    const response = await this.userApi.fetchWizardData(requestConfig);

    if (response && !response.showWarning) {
      const { job } = response;

      this.updateStore_Job(job);
    }
  }

  /** Сохранить шаг в БД */
  async saveWizardStep<T>(step: URIS, data?: T) {
    const requestConfig = this.userApi.postHeaderRequestConfig(
      step,
      data as TJSON
    );

    return await this.userApi.fetchWizardData(requestConfig);
  }

  async getGeneratedAttachment(step: URIS, data: TJSON) {
    const requestConfig = this.userApi.postHeaderRequestConfig(
      step,
      data as TJSON
    );

    return await this.userApi.getGeneratedAttachment(requestConfig);
  }

  async leadLogin(data: TValidateLead) {
    const requestConfig = this.userApi.postHeaderRequestConfig(
      URIS.LEAD_LOGIN,
      {
        ...data,
        fingerprint: this.fingerprint?.visitorId,
      }
    );

    const response = await this.userApi.leadLogin(requestConfig);

    if (response) {
      const { accessToken, refreshToken } = response;

      if (accessToken && refreshToken) {
        setToLocalStorage(getMD5(ACCESS_TOKEN_KEY), accessToken);
        setToLocalStorage(getMD5(REFRESH_TOKEN_KEY), refreshToken);
        this.getClientNextStep();
      }

      return;
    }

    this.getClientNextStep();
  }

  async validateEmail(textData: TValidateEmail, query: TJSON) {
    const { success, failed } = textData;
    const response = await this.userApi.validateEmail(query);

    return response ? success : failed;
  }

  async unsubscribe(textData: TValidateEmail, query: TJSON) {
    const { success, failed } = textData;
    const response = await this.userApi.unsubscribe(query);

    return response ? success : failed;
  }

  async confirmPersonalInfo(callback = noop) {
    const requestConfig = this.userApi.postHeaderRequestConfig(
      URIS.PERSONAL_INFO,
      { clientPersonalInfo: prepareClientPersonalInfo(this.clientPersonalInfo) }
    );

    const response = await this.userApi.confirmPersonalInfo(requestConfig);

    if (response) {
      const personalInfoRequestConfig = this.userApi.getHeaderRequestConfig(
        URIS.PERSONAL_INFO,
        this.userData
      );

      const response = await this.userApi.fetchWizardData(
        personalInfoRequestConfig
      );

      if (response) {
        this.updateClientPersonalInfo({
          ...response.clientPersonalInfo,
          birthDate: toLocalDateFormat(response.clientPersonalInfo.birthDate),
        });
      }
    }

    callback(!response);
  }

  async upsellStart(callback: () => void) {
    await this.loanStore.upsellStart();
    this.getClientNextStep(callback);
  }

  async getEkycProps() {
    const requestConfig = this.userApi.getHeaderRequestConfig(URIS.EKYC);

    // requestConfig.baseURL = '/';

    try {
      const response = await this.userApi.getEkycProps(requestConfig);

      if (response.info) {
        return response;
      }
    } catch (err) {
      handleErrors(err);
    }
  }

  updateLocalStorage() {
    if (this.visitorId) {
      setToLocalStorage(FINGER_PRINT_KEY, this.visitorId);
    }
  }
}
