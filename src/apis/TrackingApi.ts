import axios from 'axios';

import { TJSON } from '@interfaces';
import { URIS } from '@routes';
import { CommonApi } from '.';
import { checkStatus } from './apiUtils';

export class TrackingApi extends CommonApi {
  async initExternalTracking(trackingData: TJSON): Promise<any> {
    const requestConfig = this.getHeaderRequestConfig(
      URIS.EXTERNAL_TRACKING,
      trackingData
    );
    const { data, headers } = await axios(requestConfig);
    const { status, ...externalTrackingData } = data;

    if (checkStatus(status)) {
      return { ...externalTrackingData, headers };
    }
  }
}
