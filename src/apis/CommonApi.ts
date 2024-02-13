import axios, { AxiosRequestConfig } from 'axios';
import Router from 'next/router';

import { createHmac } from 'crypto';

import { TJSON } from '@interfaces';
import { URIS, URLS } from '@routes';
import {
  SESSION_ID_KEY,
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  FINGER_PRINT_KEY,
  METHOD,
  HEADERS,
  API_KEY,
  SECRET_KEY,
} from '@src/constants';
import {
  getFromLocalStorage,
  getMD5,
  setToLocalStorage,
  clearLocalStorage,
  handleErrors,
  isDev,
  makeApiUri,
  getCookie,
  isBrowser,
} from '@utils';
import { checkStatus } from './apiUtils';
import { TViewCheck } from './@types/commonApi';

export class CommonApi {
  get getSessionId() {
    return getCookie(SESSION_ID_KEY);
  }

  get getAccessToken() {
    return getFromLocalStorage(getMD5(ACCESS_TOKEN_KEY));
  }

  get getRefreshToken() {
    return getFromLocalStorage(getMD5(REFRESH_TOKEN_KEY));
  }

  get getFingerPrint() {
    return getFromLocalStorage(FINGER_PRINT_KEY);
  }

  get getScreen() {
    return `${screen.width}x${screen.height}x${screen.colorDepth}`;
  }

  async refreshToken(): Promise<void> {
    try {
      if (!this.getRefreshToken) {
        throw new Error('NO refreshToken');
      }

      const requestConfig = this.postHeaderRequestConfig(URIS.REFRESH_TOKEN, {
        refreshToken: this.getRefreshToken,
        fingerprint: this.getFingerPrint,
      });

      const response = await axios(requestConfig);

      if (response) {
        const { status, tokens } = response.data;

        if (checkStatus(status)) {
          setToLocalStorage(getMD5(ACCESS_TOKEN_KEY), tokens.accessToken);
          setToLocalStorage(getMD5(REFRESH_TOKEN_KEY), tokens.refreshToken);
        }
      }
    } catch (err) {
      clearLocalStorage();
      if (Router.route != URLS.SIGN_IN) {
        console.log(`Redirect to ${URLS.SIGN_IN}`);

        Router.replace(URLS.SIGN_IN);
      }
    }
  }

  // Получить данные из сервиса "любого"
  async processData(requestConfig: AxiosRequestConfig): Promise<any> {
    try {
      const response = await axios(requestConfig);

      if (checkStatus(response.data.status)) {
        return response.data;
      }
    } catch (err) {
      handleErrors(err);
    }
  }

  async getClientNextStep(data?: any): Promise<any> {
    const requestConfig = this.getHeaderRequestConfig(
      URIS.GET_CLIENT_STEP,
      data
    );

    try {
      const response = await axios(requestConfig);
      const { status, ...viewData } = response.data;
      const { view, pageFrame } = viewData;
      const result = {
        view: Object.hasOwnProperty.call(URLS, view) ? URLS[view] : `/${view}`,
        pageFrame,
      };

      if (isDev) {
        console.log(result);
      }

      // return { view: URLS['obligatory_check'] };

      if (checkStatus(status)) {
        return result;
      }
    } catch (error: any) {
      if (error.response.status == 401) {
        if (Router.route == URLS.START) {
          return { view: URLS.SIGN_IN };
          // return { view: URLS.START };
        }

        const result = { view: URLS.HOME, pageFrame: 'error' };

        return result;
      }

      handleErrors(error);
    }
  }

  async postClientNextStep(data?: any): Promise<any> {
    const requestConfig = this.postHeaderRequestConfig(
      URIS.POST_CLIENT_STEP,
      data
    );
    try {
      const response = await axios(requestConfig);

      const { status, ...viewData } = response.data;
      const { view, pageFrame } = viewData;
      const result = {
        view: Object.hasOwnProperty.call(URLS, view) ? URLS[view] : `/${view}`,
        pageFrame,
      };

      if (isDev) {
        console.log(result);
      }

      if (checkStatus(status)) {
        return result;
      }
    } catch (err) {
      handleErrors(err);
    }
  }

  /** Проверка доступности кнопки "Продолжить"
   *  Возвращает в callBack, либо true (кнопка доступна), либо false (кнопка недоступна). */
  async viewCheck(data?: TViewCheck): Promise<any> {
    const requestConfig = this.postHeaderRequestConfig(URIS.VIEW_CHECK, data);

    try {
      const response = await axios(requestConfig);

      if (response) {
        const { data } = response;

        return checkStatus(data.status);
      }

      return false; //на всякий
    } catch (err: any) {
      if (err.response) {
        const { status } = err.response;

        return checkStatus(status);
      }

      handleErrors(err);
    }
  }

  private headerRequestConfig(
    url: string,
    method: METHOD,
    data?: TJSON,
    isHmac?: boolean
  ): AxiosRequestConfig {
    let headers = {
      [HEADERS.SESSIONID]: this.getSessionId,
    } as TJSON;

    if (isBrowser) {
      headers = {
        ...headers,
        [HEADERS.SITE_URL]: window.location.href,
      };
    }

    if (isHmac) {
      const timeStamp = Math.floor(Date.now() / 1000);
      const toSign = JSON.stringify(data) + SECRET_KEY + timeStamp;

      const signature = createHmac('sha256', SECRET_KEY)
        .update(toSign)
        .digest('hex');

      headers = {
        ...headers,
        [HEADERS.AUTHENTICATION]: `HMAC-SHA256 Key=${API_KEY}, Timestamp=${timeStamp}, Signature=${signature}`,
      };
    }

    const accessToken = this.getAccessToken;

    if (accessToken) {
      headers = {
        ...headers,
        [HEADERS.AUTHORIZATION]: `Bearer ${accessToken}`,
      };
    }

    let dataType = {};

    if (data) {
      dataType = {
        [method == METHOD.GET ? 'params' : 'data']: data,
      };
    }

    const requestConfig: AxiosRequestConfig = {
      baseURL: makeApiUri(),
      method,
      url,
      headers,
      ...dataType,
    };

    return requestConfig;
  }

  postHeaderRequestConfig(url: string, data?: TJSON): AxiosRequestConfig {
    return this.headerRequestConfig(url, METHOD.POST, data);
  }

  /** Формування заголовків запиту із HMAC функцією  */
  postHmacHeaderRequestConfig(url: string, data?: TJSON): AxiosRequestConfig {
    return this.headerRequestConfig(url, METHOD.POST, data, true);
  }

  getHeaderRequestConfig(url: string, data?: TJSON): AxiosRequestConfig {
    return this.headerRequestConfig(url, METHOD.GET, data);
  }

  /* Взять Справочник. Сервис /directory/{directoryName} */
  async getDirectory(requestConfig: AxiosRequestConfig): Promise<any> {
    try {
      const response = await axios(requestConfig);
      const { status, ...values } = response.data;
      const newData = values.values;

      if (checkStatus(status)) {
        return newData;
      }

      return response.data;
    } catch (err) {
      handleErrors(err);
    }
  }
}
