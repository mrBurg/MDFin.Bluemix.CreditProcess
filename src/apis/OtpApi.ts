import axios, { AxiosRequestConfig } from 'axios';

import { CommonApi } from '.';
import { handleErrors } from '@src/utils/';
import { checkStatus } from './apiUtils';

export class OtpApi extends CommonApi {
  async getOtp(requestConfig: AxiosRequestConfig) {
    try {
      const response = await axios(requestConfig);
      const { status, ...otpData } = response.data;

      if (checkStatus(status)) {
        return otpData;
      }

      return { otpCode: null };
    } catch (err) {
      handleErrors(err);

      return { otpCode: null };
    }
  }

  async validateOtp(requestConfig: AxiosRequestConfig) {
    try {
      const response = await axios(requestConfig);
      const { status, ...otpData } = response.data;

      if (checkStatus(status)) {
        return otpData;
      }
    } catch (err) {
      handleErrors(err);
    }
  }
}
