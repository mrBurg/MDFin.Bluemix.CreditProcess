import { observable, action, runInAction, makeObservable } from 'mobx';

import { URIS } from '@routes';
import { CommonApi } from '@src/apis';
import { staticApi } from '@stores';
import { TCabinetDeal, TDealInfo } from './@types/loanStore';
import { TFormStatic } from './@types/repaymentStore';
import { jsonToQueryString } from '@utils';
import { TJSON } from '@interfaces';

export class RepaymentStore {
  private defaultDealInfo = {
    dealNo: '',
    closingDate: '',
    closingAmount: 0,
    extensionAmount: 0,
    currentPlannedPaymentDebt: 0,
    paymentAmount: 0,
  };

  @observable formStatic?: TFormStatic;
  @observable repayment = false;
  @observable cabinetDeal: TCabinetDeal = {
    dealInfo: this.defaultDealInfo,
  };
  @observable validForm = true;
  @observable errorNotification = '';

  constructor(private commonApi: CommonApi) {
    makeObservable(this);
  }

  public async initPaymentForm(): Promise<void> {
    const formStatic = (await staticApi.fetchStaticData({
      block: 'repayment-form',
      path: 'form',
    })) as TFormStatic;

    runInAction(() => (this.formStatic = formStatic));
  }

  @action
  setValidForm(state: boolean): void {
    this.validForm = state;
  }

  @action
  public resetDeal(): void {
    this.cabinetDeal = {
      ...this.cabinetDeal,
      dealInfo: this.defaultDealInfo,
    };
  }

  @action
  public updatePaymentState = (state: boolean): void => {
    if (!state) {
      this.resetDeal();
    }

    this.repayment = state;
  };

  @action
  public updatePaymentAmount(value: number): void {
    this.cabinetDeal.dealInfo.paymentAmount = value;
  }

  @action
  public updateDealNo(value: string): void {
    this.cabinetDeal.dealInfo.dealNo = value;
  }

  @action
  public updateStore_Deal(cabinetDeal: TDealInfo): void {
    this.cabinetDeal = Object.assign({}, this.cabinetDeal, cabinetDeal);
  }

  //Сделка из сайта (страница repayment)
  public async getCabinetDeal(params: TJSON): Promise<void | boolean> {
    const url = `${URIS.deal}${jsonToQueryString({
      dealNo: this.cabinetDeal.dealInfo.dealNo,
      ...params,
    })}`;
    const requestConfig = this.commonApi.getHeaderRequestConfig(url);
    const response = await this.commonApi.processData(requestConfig);

    if (response) {
      this.updateStore_Deal(response);
      return true;
    }
  }
}
