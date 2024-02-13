import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { URIS } from '@routes';
import {
  errorsFormatter,
  handleErrors,
  jsonToQueryString,
  makeStaticUri,
} from '@utils';
import { TFetchStaticDataProps } from './@types/staticApi';
import { CommonApi } from './CommonApi';
import { HEADERS } from '@src/constants';

export class StaticApi extends CommonApi {
  async fetchStaticData(
    params: TFetchStaticDataProps,
    options = {} as AxiosRequestConfig
  ) {
    const queryParams = jsonToQueryString(params);
    const host = makeStaticUri(URIS.L10N_LIST);

    if (this.getAccessToken) {
      options.headers = {
        ...options.headers,
        [HEADERS.AUTHORIZATION]: `Bearer ${this.getAccessToken}`,
      };
    }

    try {
      const response: AxiosResponse = await axios.get(host, {
        ...options,
        params,
      });

      return response.data;
    } catch (err) {
      errorsFormatter('Server error, no data received from', {
        URL: host + queryParams,
        host,
        params,
      });

      /* if (isDev) {
        try {
          host = URIS.LOCAL_API + URIS.L10N_LIST;

          errorsFormatter('Trying to received local data from', {
            URL: host + queryParams,
            host,
            params,
          });

          const response: AxiosResponse = await axios.get(host, {
            ...options,
            params,
          });

          axios.post(URIS.LOCAL_API + URIS.CREATE_SQL, {
            data: response.data,
            params,
          });

          return response.data;
        } catch (err) {
          errorsFormatter('\x1b[30m\x1b[101mTemporary data not available');
          handleErrors(err);

          throw err;;
        }
      } */

      throw err;
    }
  }

  /** Значение в виде строки(?) */
  async fetchStaticValue(
    params: TFetchStaticDataProps,
    options = {} as AxiosRequestConfig
  ) {
    if (this.getAccessToken) {
      options.headers = {
        ...options.headers,
        [HEADERS.AUTHORIZATION]: `Bearer ${this.getAccessToken}`,
      };
    }

    try {
      const response: AxiosResponse = await axios.get(
        makeStaticUri(URIS.L10N_VALUE),
        { ...options, params }
      );

      return response.data;
    } catch (err) {
      handleErrors(err);
    }
  }
}
