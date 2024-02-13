import { makeObservable, observable, runInAction } from 'mobx';

import { URIS } from '@routes';
import { LoyaltyApi } from '@src/apis';
import { makeStaticUri } from '@utils';
import axios from 'axios';
import { checkStatus } from '@src/apis/apiUtils';
import { TLoyaltyInfo } from '@stores-types/loyaltyStore';
import { staticApi } from '@stores';

export class LoyaltyStore {
  @observable public loyaltyEnabled = false;
  @observable public inputAvailable = false;
  @observable public loyaltyInfo = null as unknown as TLoyaltyInfo;

  constructor(private loyaltyApi: LoyaltyApi) {
    makeObservable(this);
  }

  /** Получение признака, включен ли Loyalty */
  async getLoyaltyState() {
    const requestConfig = this.loyaltyApi.getHeaderRequestConfig(
      makeStaticUri(URIS.LOYALTY_INFO)
    );

    const response = await axios(requestConfig);

    if (response && checkStatus(response.status)) {
      const { info } = response.data;

      runInAction(() => {
        this.loyaltyInfo = info;
        this.inputAvailable = info.input_available;
        this.loyaltyEnabled = !!info.program_name;
      });
    }
  }

  async initServiceMessage(isCabinet?: boolean) {
    const staticData = await staticApi.fetchStaticData({
      block: 'promo',
      path: 'static',
    });

    switch (true) {
      case isCabinet:
        return staticData.onCabinet;
      default:
        return staticData.onLanding;
    }
  }

  /**
   * @deprecated Тепер використовується initServiceMessage
   */
  async initLoyaltyServiceMessage(isCabinet?: boolean) {
    const staticData = await staticApi.fetchStaticData({
      block: 'loyalty',
      path: 'static',
    });

    switch (true) {
      case this.loyaltyInfo.done:
        return {
          message: staticData.messageDone,
          bufferText: staticData.bufferText,
        };
      case isCabinet:
        return {
          message: staticData.messageCabinet,
          bufferText: staticData.bufferText,
        };
      default:
        return {
          message: staticData.message,
          bufferText: staticData.bufferText,
        };
    }
  }

  async sendLoyaltyCode(code: string) {
    const requestConfig = this.loyaltyApi.postHeaderRequestConfig(
      URIS.LOYALTY_ADDCODE,
      { code }
    );

    return this.loyaltyApi.sendUserData(requestConfig);
  }
}
