import { /* RESPONSE_STATUS, */ STATUS } from '@src/constants';
import { handleErrors, isDev } from '@utils';
import axios, { AxiosRequestConfig } from 'axios';
import { CommonApi } from '.';
import { checkStatus } from './apiUtils';

export class LoyaltyApi extends CommonApi {
  async sendUserData(requestConfig: AxiosRequestConfig) {
    try {
      const response = await axios({
        ...requestConfig,
        validateStatus(status) {
          return (
            (status >= STATUS.OK && status < 300) ||
            status == STATUS.BAD_REQUEST
          );
        },
      });

      const { data } = response;

      if (isDev) {
        console.log(response.data);
      }

      // if (
      //   data.status.toLowerCase() == RESPONSE_STATUS.ERROR &&
      //   data.error == 'ValidationException'
      // ) {
      //   return true; //MDFC-12084
      // } else {
      return checkStatus(data.status);
      // }
    } catch (err) {
      handleErrors(err);
    }
  }
}
