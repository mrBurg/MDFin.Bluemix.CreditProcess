import { action, makeObservable, observable, runInAction } from 'mobx';

import { TJSON } from '@interfaces';
import { DIRECTORIES, URIS } from '@routes';
import { PageApi } from '@src/apis';
import { staticApi } from '@stores';
import { TDirectoryItem } from './@types/pageStore';
import { handleErrors, jsonToQueryString, makeStaticUri } from '@utils';
import axios from 'axios';
import { checkStatus } from '@src/apis/apiUtils';
import { UserStore } from './UserStore';

export class PageStore {
  public params = {} as TJSON;
  public pageData = {} as TJSON;
  public copyright = {} as TJSON;

  @observable public nj: any;
  @observable public cookiesPrivacy = null as null | TJSON;

  /** Признак, включен ли Libra Pay
   * @param true - включен
   * @param false - выключен
   * */
  @observable public librapayEnabled = false;
  @observable public ninjaEnabled = false;

  /* Справочники */
  @observable public dirGender = [] as TDirectoryItem[];
  @observable public dirMaritalStatus = [] as TDirectoryItem[];
  @observable public dirLoanPurpose = [] as TDirectoryItem[];
  @observable public dirLoanPurposeDescr = [] as TDirectoryItem[];
  @observable public dirMobilePhoneBrand = [] as TDirectoryItem[];
  @observable public dirMobilePhoneModel = [] as TDirectoryItem[];
  @observable public dirCityProvince = [] as TDirectoryItem[];
  @observable public dirDistrict = [] as TDirectoryItem[];
  @observable public dirWardCommune = [] as TDirectoryItem[];
  @observable public dirThirdPartyRelation = [] as TDirectoryItem[];
  @observable public dirSocialStatus = [] as TDirectoryItem[];
  @observable public dirEducation = [] as TDirectoryItem[];
  @observable public dirIndustry = [] as TDirectoryItem[];
  @observable public dirIndustryDetailed = [] as TDirectoryItem[];
  @observable public dirJobPosType = [] as TDirectoryItem[];
  @observable public dirJobRelationType = [] as TDirectoryItem[];
  @observable public dirBank = [] as TDirectoryItem[];
  @observable public dirDeclinedByClientReason = [] as TDirectoryItem[];

  constructor(private pageApi: PageApi, private userStore: UserStore) {
    makeObservable(this);
  }

  async getCookiesPrivacy(): Promise<void> {
    const cookiesPrivacyData = await staticApi.fetchStaticData({
      block: 'cookies-privacy',
      path: 'static',
    });

    runInAction(() => (this.cookiesPrivacy = cookiesPrivacyData));
  }

  @action
  closeCookiesPrivacy = () => {
    this.cookiesPrivacy = null;
  };

  /** Получение признака, включен ли Libra Pay */
  async getLibrapayState() {
    const requestConfig = this.pageApi.getHeaderRequestConfig(
      makeStaticUri(URIS.CABINET_CARD_ENABLED)
    );

    const response = await axios(requestConfig);

    if (response && checkStatus(response.status) && response.data) {
      const { enabled } = response.data;

      runInAction(() => (this.librapayEnabled = enabled));
    }
  }

  // Mydataninja.com
  async getNinjaState() {
    const requestConfig = this.pageApi.getHeaderRequestConfig(
      makeStaticUri(URIS.NINJA_SCRIPT)
    );

    // requestConfig.baseURL = '/ls/api';
    // requestConfig.url = '/goal/nj';

    const response = await axios(requestConfig);

    if (response && checkStatus(response.status)) {
      runInAction(() => (this.ninjaEnabled = response.data.needNinja));
    }
  }

  initNinja() {
    runInAction(() => (this.nj = window.nj || []));

    this.nj.push(['init', {}]);
  }

  async generateNinjaLead() {
    if (this.userStore.userLoggedIn && this.nj) {
      const { njuser: user_id, event_id } = await this.nj.event('lead');

      this.sendNinjaData({ user_id, event_id });
    }
  }

  async sendNinjaData(data: TJSON) {
    const requestConfig = this.pageApi.postHeaderRequestConfig(
      makeStaticUri(URIS.NINJA_SCRIPT),
      data
    );

    // requestConfig.baseURL = '/ls/api';
    // requestConfig.url = '/goal/nj';

    axios(requestConfig);
  }

  /*
   * Отправка ответа LibraPay
   */
  async proccessLibrapayResult(urlParamsData: string) {
    try {
      const requestConfig = this.pageApi.getHeaderRequestConfig(
        makeStaticUri(`${URIS.CABINET_LIBRA_RESULT}${urlParamsData}` as URIS)
      );

      await axios(requestConfig);
    } catch (err) {
      handleErrors(err);
    }
  }

  /** Взять Справочник. Сервис: /directory/{directoryName} */
  async getDirectory(directoryUrl: string, parent_id?: string): Promise<void> {
    let url = URIS.DIRECTORY + directoryUrl;

    if (parent_id) {
      url += jsonToQueryString({ parent_id });
    }

    const requestConfig = this.pageApi.getHeaderRequestConfig(url);
    const response = await this.pageApi.getDirectory(requestConfig);

    if (response) {
      runInAction(() => {
        switch (directoryUrl) {
          case DIRECTORIES.dirGender:
            return (this.dirGender = response);
          case DIRECTORIES.dirMaritalStatus:
            return (this.dirMaritalStatus = response);
          case DIRECTORIES.dirLoanPurpose:
            if (parent_id) {
              return (this.dirLoanPurposeDescr = response);
            }

            return (this.dirLoanPurpose = response);
          case DIRECTORIES.dirMobilePhoneBrand:
            if (parent_id) {
              return (this.dirMobilePhoneModel = response);
            }

            return (this.dirMobilePhoneBrand = response);
          case DIRECTORIES.dirCityProvince:
            return (this.dirCityProvince = response);
          case DIRECTORIES.dirDistrict:
            return (this.dirDistrict = response);
          case DIRECTORIES.dirWardCommune:
            return (this.dirWardCommune = response);
          case DIRECTORIES.dirThirdPartyRelation:
            return (this.dirThirdPartyRelation = response);
          case DIRECTORIES.dirSocialStatus:
            return (this.dirSocialStatus = response);
          case DIRECTORIES.dirEducation:
            return (this.dirEducation = response);
          case DIRECTORIES.dirIndustry:
            if (parent_id) {
              return (this.dirIndustryDetailed = response);
            }

            return (this.dirIndustry = response);
          case DIRECTORIES.dirJobPosType:
            return (this.dirJobPosType = response);
          case DIRECTORIES.dirJobRelationType:
            return (this.dirJobRelationType = response);
          case DIRECTORIES.dirBank:
            return (this.dirBank = response);
          case DIRECTORIES.dirDeclinedByClientReason:
            return (this.dirDeclinedByClientReason = response);
        }
      });
    }
  }

  @action
  clearDirectory(this: any, name: string) {
    this[name] = [];
  }
}
