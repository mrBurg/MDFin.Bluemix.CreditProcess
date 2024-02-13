import { TJSON } from '@interfaces';
import { handleErrors, isDev } from '@utils';
import axios, { AxiosRequestConfig } from 'axios';
import { CommonApi } from '.';

import { checkStatus } from './apiUtils';

export class LoanApi extends CommonApi {
  async getCalculatorParams(requestConfig: AxiosRequestConfig) {
    try {
      const response = await axios(requestConfig);
      const { status, ...productsParams } = response.data;

      if (checkStatus(status)) {
        return productsParams;
      }
    } catch (err) {
      handleErrors(err);
    }
  }

  async reminder(requestConfig: AxiosRequestConfig) {
    try {
      const response = await axios(requestConfig);
      const { status, reminderInfo } = response.data;

      if (checkStatus(status)) {
        return reminderInfo;
      }
    } catch (err) {
      handleErrors(err);
    }
  }

  async calculate(requestConfig: AxiosRequestConfig) {
    try {
      const response = await axios(requestConfig);
      const { status, ...creditParams } = response.data;

      if (checkStatus(status)) {
        return creditParams;
      }
    } catch (err) {
      handleErrors(err);
    }
  }

  async wizardStart(requestConfig: AxiosRequestConfig) {
    try {
      const response = await axios(requestConfig);
      const { status, ...responseDate } = response.data;

      if (checkStatus(status)) {
        return responseDate;
      }
    } catch (err) {
      handleErrors(err);
    }
  }

  async cabinetSign(requestConfig: AxiosRequestConfig) {
    try {
      const response = await axios(requestConfig);
      const { status, ...otpData } = response.data;

      if (isDev) {
        console.log(response.data);
      }

      if (checkStatus(status)) {
        return { ...otpData };
      }
    } catch (err) {
      handleErrors(err);
    }
  }

  //API погашение из ЛК (и сайта?)
  async cabinetPay(requestConfig: TJSON) {
    try {
      const response = await axios(requestConfig);
      const { status, ...respData } = response.data;

      if (isDev) {
        console.log(response.data);
      }

      if (checkStatus(status)) {
        return respData;
      }
    } catch (err) {
      if (!(await handleErrors(err))) {
        return window.location.reload();
      }
      // handleErrors(err);
    }
  }

  async cabinetDecline(requestConfig: AxiosRequestConfig) {
    try {
      const { data } = await axios(requestConfig);

      if (isDev) {
        console.log(data);
      }
    } catch (err) {
      handleErrors(err);
    }
  }

  async cabinetConfirm(requestConfig: AxiosRequestConfig) {
    try {
      const response = await axios({
        ...requestConfig,
        validateStatus: (status) => status > 300 && status < 500,
      });
      const { errors } = response.data;

      return errors;
    } catch (err) {
      handleErrors(err);
    }
  }

  async uploadAttachment(requestConfig: AxiosRequestConfig) {
    try {
      const response = await axios(requestConfig);
      const { status, ...attachmentsData } = response.data;

      if (checkStatus(status)) {
        return attachmentsData;
      }
    } catch (err) {
      handleErrors(err);
      return false;
    }
  }
}
