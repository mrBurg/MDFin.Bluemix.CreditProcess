import axios, { AxiosRequestConfig } from 'axios';

import { TJSON } from '@interfaces';
import { URIS } from '@routes';
import { METHOD } from '@src/constants';
import { isDev, handleErrors } from '@utils';
import { CommonApi } from '.';
import { checkStatus } from './apiUtils';

export class UserApi extends CommonApi {
  async sendUserData(requestConfig: AxiosRequestConfig) {
    try {
      const response = await axios(requestConfig);
      const { status, ...otpData } = response.data;

      if (isDev) {
        console.log(response.data);
      }

      if (checkStatus(status)) {
        return otpData;
      }
    } catch (err) {
      handleErrors(err);
    }
  }

  async fetchWizardData(requestConfig: AxiosRequestConfig) {
    const { method } = requestConfig;

    try {
      const response = await axios(requestConfig);

      if (response) {
        const {
          data: { status, ...responseData },
        } = response;

        if (checkStatus(status)) {
          switch (method) {
            case METHOD.GET:
              return responseData;
            case METHOD.POST:
              return true;
          }
        }
      }
    } catch (err) {
      handleErrors(err);

      return { showWarning: true };
    }
  }

  async logOut(requestConfig: AxiosRequestConfig) {
    try {
      const { data } = await axios(requestConfig);

      console.log('Client has been logged out');

      return checkStatus(data.status);
    } catch (err) {
      handleErrors(err);
    }
  }

  async getGeneratedAttachment(requestConfig: AxiosRequestConfig) {
    try {
      const response = await axios(requestConfig);

      if (response) {
        const {
          data: { status, ...responseData },
        } = response;

        if (checkStatus(status)) {
          return responseData;
        }
      }
    } catch (err) {
      handleErrors(err);
    }
  }

  async leadLogin(requestConfig: AxiosRequestConfig) {
    try {
      const response = await axios(requestConfig);

      if (response) {
        const { data } = response;

        if (checkStatus(data.status)) {
          return data.tokens;
        }
      }
    } catch (err) {
      handleErrors(err);
    }
  }

  async validateEmail(params: TJSON) {
    const requestConfig = this.getHeaderRequestConfig(
      URIS.VALIDATE_EMAIL,
      params
    );

    try {
      const response = await axios(requestConfig);

      if (response) {
        const { data } = response;

        return checkStatus(data.status);
      }
    } catch (err) {
      handleErrors(err);
    }
  }

  async unsubscribe(params: TJSON) {
    const requestConfig = this.getHeaderRequestConfig(URIS.UNSUBSCRIBE, params);

    try {
      const response = await axios(requestConfig);

      if (response) {
        const { data } = response;

        return checkStatus(data.status);
      }
    } catch (err) {
      handleErrors(err);
    }
  }

  async getPageFrameData(url: URIS) {
    const requestConfig = this.getHeaderRequestConfig(url);

    try {
      const response = await axios(requestConfig);

      if (response) {
        const { data } = response;

        // if (checkStatus(data.status)) {
        if (checkStatus(response.status)) {
          if (data.sitePixelScript) return data.sitePixelScript;

          return data.goalPageScript;
        }
      }
    } catch (err) {
      handleErrors(err);
    }
  }

  updateGoalpage(url: URIS) {
    const requestConfig = this.postHeaderRequestConfig(url);

    try {
      axios(requestConfig);
    } catch (err) {
      handleErrors(err);
    }
  }

  async confirmPersonalInfo(requestConfig: AxiosRequestConfig) {
    try {
      const response = await axios(requestConfig);

      if (response) {
        const { data } = response;

        return checkStatus(data.status);
      }
    } catch (err) {
      handleErrors(err);
    }
  }

  async getEkycProps(requestConfig: AxiosRequestConfig) {
    const response = await axios(requestConfig);

    if (response) {
      return response.data;
    }
  }
}
