import Router from 'next/router';
import { observable, runInAction, action, makeObservable } from 'mobx';
import each from 'lodash/each';
import isArray from 'lodash/isArray';
import map from 'lodash/map';
import noop from 'lodash/noop';
import reduce from 'lodash/reduce';
import size from 'lodash/size';

import { URIS, URLS } from '@routes';
import { LoanApi } from '@src/apis';
import { OTP_ACTION, TERM_FRACTION } from '@src/constants';
import {
  TAccountsFormStatic,
  TAttachmentsFormStatic,
  TProductSelectorFormStatic,
  TLoanData,
  TCabinetApplication,
  TCabinetNotify,
  TAccount,
  TCabinetDeals,
  TCabinetPay,
  TCabinetClientInfo,
  TCalculatorParams,
  TConfirmData,
  TPaymentToken,
  TNotifyItem,
} from './@types/loanStore';
import { OtpStore } from './OtpStore';
import { TReminderResponse } from '@src/apis/@types/loanApi';
import { staticApi } from '@stores';
import { TJSON } from '@interfaces';
import { getUrlSlug } from '@utils';

export class LoanStore {
  @observable accountsFormStatic?: TAccountsFormStatic;
  @observable attachmentsFormStatic?: TAttachmentsFormStatic;
  @observable productSelectorFormStatic?: TProductSelectorFormStatic;
  /** Параметры продукта */
  @observable
  calculatorParams = {} as TCalculatorParams;

  /** Параметры калькулятора */
  @observable loanData: TLoanData = {
    amount: 0,
    term: 0,
  };
  @observable cabinetClientInfo = {} as TCabinetClientInfo;
  @observable cabinetApplication = {} as TCabinetApplication;
  @observable cabinetNotify = [] as TCabinetNotify[];
  /* @observable account: TAccount = {
    [FIELD_NAME.ACCOUNT_NUMBER]: '',
  }; */
  @observable currentPaymentToken: TPaymentToken = {
    id: '',
    index: NaN,
    name: '',
  };
  @observable cabinetDeals: TCabinetDeals = { dealInfos: [] };
  @observable isNewAccount = true;
  @observable invalidAccount = false;

  private docsInvalid = true;
  @observable termFraction = TERM_FRACTION.DAY;

  constructor(private loanApi: LoanApi) {
    makeObservable(this);
  }

  /**
   * @description Обновить состояние счета
   * @param isValid true - счёт не действителен, fasle - счёт действителен
   */
  @action
  updateAccountValidity(isValid: boolean): void {
    this.invalidAccount = !isValid;
  }

  /**
   * @description VN: Обновить состояние счета
   * @param isNew true - Новый, false - Существующий
   */
  /* @action
  updateAccountState(isNew: boolean): void {
    if (!isNew) {
      this.resetAccount();
    }

    this.isNewAccount = isNew;
  } */

  /** Калькулятор: изменить сумму */
  @action
  updateAmount(value: number): void {
    this.loanData.amount = value;
  }

  //Калькулятор: изменить срок
  @action
  updateTerm(value: number, fraction: TERM_FRACTION): void {
    this.loanData.term = value;
    this.termFraction = fraction;
  }

  /**
   * VN: добавление нового "нулевого" значения выпадающего списка
   */
  @action
  addOptionToAccountList({ account_id, accountNumber }: TAccount): void {
    if (this.cabinetApplication.accountUnit) {
      const accounts = this.cabinetApplication.accountUnit.accounts;

      const optionHasAdded = accounts.some(
        (account) => account.account_id == account_id
      );

      if (!optionHasAdded) {
        accounts.push({
          account_id,
          accountNumber,
        });
      }

      this.cabinetApplication.accountUnit.accounts = accounts;
    }
  }

  /**
   * RO: добавление нового "нулевого" значения выпадающего списка
   */
  @action
  addOptionToPaymentTokens({ id, name, disabled }: TPaymentToken): void {
    if (this.cabinetApplication.paymentTokenUnit) {
      const paymentTokens =
        this.cabinetApplication.paymentTokenUnit.paymentTokens;

      const optionHasAdded = paymentTokens.some((token) => token.id == id);

      if (!optionHasAdded) {
        const index = size(paymentTokens) + 1;
        paymentTokens.push({
          id,
          name,
          index,
          disabled,
        });
      }

      this.cabinetApplication.paymentTokenUnit.paymentTokens = paymentTokens;
    }
  }

  /*@action
  resetAccount(): void {
    this.account = {
      accountNumber: '',
      name: '',
    }
  } */

  /** обнуление текущего счета/карты */
  @action
  resetCurrentPaymentToken(): void {
    this.currentPaymentToken = {
      id: '',
      index: NaN,
      name: '',
    };
  }

  /** NOT_USED обновление нового(?) текущего счета */
  /* @action
  updateAccount({ name, value }: TUpdateAccountProps): void {
    this.account = {
      ...this.account,
      [name]: value,
    }
  } */

  /** измение текущего счета/карты */
  @action
  updateCurrentPaymentToken(data: TPaymentToken) {
    this.currentPaymentToken = data;
  }

  @action
  updatePaymentAmount(value: number) {
    this.cabinetDeals.dealInfos[0].paymentAmount = value;
  }

  async initAttachmentsForm() {
    const attachmentsFormStatic = (await staticApi.fetchStaticData({
      block: 'attachments-form',
      path: 'form',
    })) as TAttachmentsFormStatic;

    runInAction(() => (this.attachmentsFormStatic = attachmentsFormStatic));
  }

  async initAccountForm() {
    const accountsFormStatic = (await staticApi.fetchStaticData({
      block: 'accounts-form',
      path: 'form',
    })) as TAccountsFormStatic;

    runInAction(() => (this.accountsFormStatic = accountsFormStatic));
  }

  async initProductSelectorForm(): Promise<void> {
    const productSelectorFormStatic = (await staticApi.fetchStaticData({
      block: 'product-selector-form',
      path: 'form',
    })) as TProductSelectorFormStatic;

    runInAction(
      () => (this.productSelectorFormStatic = productSelectorFormStatic)
    );
  }

  /** VN: Добавление нового текущего счета */
  /* async addAccount(paymentToken: TPaymentToken): Promise<any> {
    const requestConfig = this.loanApi.postHeaderRequestConfig(URIS.account, {
      paymentToken: {
        ...paymentToken,
      },
    });

    return await this.loanApi.processData(requestConfig);
  } */

  /** RO: Добавление нового текущего счета */
  async addAccount(accountNumber: string): Promise<any> {
    const requestConfig = this.loanApi.postHeaderRequestConfig(
      URIS.CABINET_ADD_ACCOUNT,
      {
        accountNumber,
      }
    );

    return await this.loanApi.processData(requestConfig);
  }

  /** Отправка перевыбранного Клиентом счета/карты */
  async cabinetChangeAccount(
    currentPaymentToken: TPaymentToken
  ): Promise<TJSON | void> {
    const requestConfig = this.loanApi.postHeaderRequestConfig(
      URIS.CABINET_CHANGE_ACCOUNT,
      currentPaymentToken
    );

    return await this.loanApi.processData(requestConfig);
  }

  /** RO: Добавление новой банковской карты */
  async addCard(data: TJSON): Promise<any> {
    const requestConfig = this.loanApi.postHeaderRequestConfig(
      URIS.CABINET_ADD_CARD,
      data
    );

    // requestConfig.baseURL = '/ls/api';

    return await this.loanApi.processData(requestConfig);
  }

  /** Получить параметры калькулятора */
  async getCalculatorParams(): Promise<void> {
    const requestConfig = this.loanApi.getHeaderRequestConfig(
      URIS.GET_CALCULATOR_PARAMS
    );

    const response = await this.loanApi.getCalculatorParams(requestConfig);

    if (response) {
      const { defaultAmount, defaultTerm, defaultTermFraction, ...restProps } =
        response.calculatorParams;

      runInAction(() => {
        this.calculatorParams = restProps;
        this.termFraction = defaultTermFraction;
        this.loanData.amount = defaultAmount;
        this.loanData.term = defaultTerm;
      });
    }
  }

  async calculate(fixedAmount: boolean, callBack = noop): Promise<void> {
    const requestConfig = this.loanApi.postHeaderRequestConfig(URIS.CALCULATE, {
      ...this.loanData,
      termFraction: this.termFraction,
      fixedAmount,
    });

    const response = await this.loanApi.calculate(requestConfig);

    if (response) {
      runInAction(() => {
        this.loanData = Object.assign({}, this.loanData, response.loanProposal);

        if (this.cabinetApplication.loanProposal) {
          this.cabinetApplication.loanProposal = Object.assign(
            {},
            this.cabinetApplication.loanProposal,
            response.loanProposal
          );
        }

        callBack(this.loanData);
      });
    }
  }

  /** Получить данные для баннера */
  async reminder(): Promise<TReminderResponse | void> {
    const requestConfig = this.loanApi.postHeaderRequestConfig(URIS.REMINDER, {
      ...this.loanData,
      termFraction: this.termFraction,
    });

    const response = await this.loanApi.reminder(requestConfig);

    if (response) {
      return response;
    }
  }

  async getLoan(callback = noop, location?: string): Promise<void | boolean> {
    const requestConfig = this.loanApi.postHeaderRequestConfig(
      URIS.WIZARD_START,
      { ...this.loanData, location }
    );

    const response = await this.loanApi.wizardStart(requestConfig);

    if (response && response.view) {
      const { routeUrl, routeAsPath } = getUrlSlug(URLS[response.view]);

      callback();

      return Router.push(routeUrl, routeAsPath);
    }

    callback();
  }

  async getLoanAuthorize(
    callback = noop,
    location?: string
  ): Promise<void | boolean> {
    const requestConfig = this.loanApi.postHeaderRequestConfig(
      URIS.WIZARD_START,
      { ...this.loanData, location }
    );

    const response = await this.loanApi.wizardStart(requestConfig);

    if (response && response.view) {
      if (response.view == 'phoneverify') {
        callback();
      }
      const { routeUrl, routeAsPath } = getUrlSlug(URLS[response.view]);

      return Router.push(routeUrl, routeAsPath);
    }

    callback();
  }

  /**
   * - Кабинет - Персональная информация.
   * - Отображение ФИО на кнопке логина.
   * @param needExtraData - получать список документов и уведомление просроченного документа
   */
  async getCabinetClientInfo(needExtraData: boolean): Promise<void> {
    const requestConfig = this.loanApi.getHeaderRequestConfig(URIS.CLIENT_INFO);

    const response = await this.loanApi.processData(requestConfig);

    let extraData = {};
    if (needExtraData) {
      const archiveRequestConfig = this.loanApi.getHeaderRequestConfig(
        URIS.CLIENT_ARCHIVE
      );
      const archiveResponse = await this.loanApi.processData(
        archiveRequestConfig
      );

      const expiredDocRequestConfig = this.loanApi.getHeaderRequestConfig(
        URIS.CLIENT_EXPIRED_DOCUMENT
      );
      const expiredDocResponse = await this.loanApi.processData(
        expiredDocRequestConfig
      );

      extraData = {
        ...extraData,
        dealDocumentsList: archiveResponse.dealDocumentsList,
        expiredDocument: expiredDocResponse.communication,
      };
    }

    if (response) {
      this.updateStore_CabinetClientInfo(
        Object.assign({}, response.clientInfo, extraData)
      );
    }
  }

  @action
  updateStore_CabinetClientInfo(cabinetClientInfo: TCabinetClientInfo) {
    this.cabinetClientInfo = Object.assign(
      {},
      this.cabinetClientInfo,
      cabinetClientInfo
    );
  }

  @action
  cleanStore_CabinetClientInfo() {
    this.cabinetClientInfo = {} as TCabinetClientInfo;
  }

  //После визарда, берем либо документы, либо заявку, либо статус заявки (текстовку нотификации), либо...
  async getCabinetApplication(): Promise<void | boolean> {
    const requestConfig = this.loanApi.getHeaderRequestConfig(
      URIS.application,
      this.loanData
    );

    // requestConfig.baseURL = '/ls/api';

    const response = await this.loanApi.processData(requestConfig);

    if (response) {
      this.updateStore_Application(response);
    }
  }

  @action
  updateStore_Application(cabinetApplication: TCabinetApplication) {
    this.cabinetApplication = Object.assign(
      {},
      this.cabinetApplication,
      cabinetApplication
    );
  }

  //Сделка из ЛК
  async getCabinetDeals(): Promise<void | boolean> {
    const requestConfig = this.loanApi.getHeaderRequestConfig(
      URIS.deals,
      this.loanData
    );

    const response = await this.loanApi.processData(requestConfig);
    if (response) {
      this.updateStore_Deals(response);
    }
  }

  @action
  async updateStore_Deals(cabinetDeals: TCabinetDeals): Promise<void> {
    this.cabinetDeals = Object.assign({}, this.cabinetDeals, cabinetDeals);
  }

  async uploadAttachment(
    files: FileList,
    type: string,
    callBack = noop
  ): Promise<void> {
    const formData = new FormData();

    each(files, (item) => {
      /*var reader = new FileReader();
      reader.readAsArrayBuffer(item);
      reader.onload = function (evt) {
        if (evt.target.readyState == FileReader.DONE) {
          console.log(evt.target, 'evt.target');
        }

        var arrayBuffer = reader.result;
        console.log(arrayBuffer, 'arrayBuffer');
        var bytes = new Uint8Array(arrayBuffer as ArrayBuffer);
        console.log(bytes, 'bytes');
        var blob = new Blob(bytes as BlobPart[], { type: item.type });

        console.log(blob, 'blob');

        var file = new File([blob], encodeURI(item.name), { type: item.type });
        console.log(file);
      };*/

      formData.append('file', item);
      formData.append('type_id', type);
      formData.append('filename', encodeURI(item.name));
    });

    const formFilled = formData.has('type_id');

    if (formFilled) {
      const requestConfig = this.loanApi.postHeaderRequestConfig(
        URIS.UPLOAD_ATTACHMENT,
        formData
      );

      const response = await this.loanApi.uploadAttachment(requestConfig);

      if (response) {
        runInAction(() =>
          this.updateStore_Application(
            Object.assign({}, this.cabinetApplication, response)
          )
        );
      }

      /** В этот коллбек, передается результат выполнения сервиса
       *  если есть респонс, то - true; если респонса нет или ошибка - false */
      callBack(!!response);
    }
  }

  async getNotify(callback = noop): Promise<void> {
    const requestConfig = this.loanApi.getHeaderRequestConfig(
      URIS.notify,
      this.loanData
    );

    const response = await this.loanApi.processData(requestConfig);

    if (response) {
      const { notifications } = response;
      this.updateStore_Notify(notifications);
      callback();
    }
  }

  @action
  updateStore_Notify(cabinetNotify?: TCabinetNotify[]): void {
    this.cabinetNotify = cabinetNotify!;
  }

  //Подтвердить показ нотификации клиенту
  async confirmDisplay(): Promise<void> {
    const confirmationIds = this.getDisplayConfirmationItems();
    if (!size(confirmationIds)) {
      return;
    }

    const requestConfig = this.loanApi.postHeaderRequestConfig(
      URIS.notify_Confirm_Display,
      { notificationIds: confirmationIds }
    );

    this.loanApi.processData(requestConfig);
  }

  //выбрать id-шки нотификаций, которые нужно "деактивировать"
  getDisplayConfirmationItems(): number[] {
    const isArrayNotify =
      isArray(this.cabinetNotify) && !!size(this.cabinetNotify);

    const displayConfirmationItems = [] as number[];

    if (isArrayNotify) {
      map(this.cabinetNotify, (item: TNotifyItem) => {
        if (item.displayConfirmation) {
          displayConfirmationItems.push(item.id);
        }
      });
    }

    return displayConfirmationItems;
  }

  //погашение из ЛК (и сайта?)
  async cabinetPay(dealPay: TCabinetPay): Promise<void> {
    const requestConfig = this.loanApi.postHeaderRequestConfig(
      URIS.CABINET_PAY,
      dealPay
    );

    const response = await this.loanApi.cabinetPay(requestConfig);

    if (response) {
      const { redirectUrl } = response;

      if (redirectUrl) {
        return window.location.assign(redirectUrl);
      }
    }
  }

  // Подписываем заявку
  async cabinetSign(
    account: any,
    otpStore: OtpStore,
    callback = noop
  ): Promise<void> {
    const requestConfig = this.loanApi.postHeaderRequestConfig(
      URIS.CABINET_SIGN,
      account
    );

    const otpData = await this.loanApi.cabinetSign(requestConfig);

    const { otpId } = otpData;

    if (otpId) {
      return otpStore.updateOtpState({
        action: OTP_ACTION.SIGN,
        otpId /* phoneNumber, */,
      });
    }

    callback();
  }

  // Отказ Клиента от заявки
  async cabinetDecline(): Promise<void> {
    const requestConfig = this.loanApi.postHeaderRequestConfig(
      URIS.CABINET_DECLINE
    );

    const status = await this.loanApi.cabinetDecline(requestConfig);

    console.log(status);
  }

  // Подтверждение Клиента от заявки
  async cabinetConfirm(data: TConfirmData): Promise<void> {
    const requestConfig = this.loanApi.postHeaderRequestConfig(
      URIS.CABINET_CONFIRM,
      data
    );

    const status = await this.loanApi.cabinetConfirm(requestConfig);

    console.log(status);
  }

  async cabinetConfirmCheck(data: TConfirmData): Promise<string[]> {
    const requestConfig = this.loanApi.postHeaderRequestConfig(
      URIS.CABINET_CONFIRM_CHECK,
      data
    );

    const response = await this.loanApi.cabinetConfirm(requestConfig);

    return reduce(
      response,
      (accum, item) => {
        accum.push(item.name);

        return accum;
      },
      [] as string[]
    );
  }

  @action
  private checkDocs(): void {
    const { documentUnits } = this.cabinetApplication;

    if (!documentUnits) {
      this.docsInvalid = true;
      return;
    }

    each(documentUnits, (item) => {
      if (!item.valid) {
        this.docsInvalid = true;

        return item.valid;
      }

      this.docsInvalid = false;
    });
  }

  get getInvalidDocs(): boolean {
    this.checkDocs();

    /* return (
      this.docsInvalid ||
      (this.isNewAccount && Boolean(!this.account.accountNumber.length))
    ); */

    return this.docsInvalid;
  }

  async getTermsAndConditionsDocType(): Promise<void | string> {
    const requestConfig = this.loanApi.getHeaderRequestConfig(
      URIS.GET_TERMS_AND_CONDITIONS_DOC_TYPE
    );

    const response = await this.loanApi.processData(requestConfig);

    if (response) {
      const { documentType } = response;
      return documentType;
    }
  }

  /** Сервис реактивации Кредитной Линии */

  async reactivation(callback = noop): Promise<any> {
    const requestConfig = this.loanApi.postHeaderRequestConfig(
      URIS.REACTIVATION,
      {
        loanRequest: {
          amount: this.loanData.amount,
        },
      }
    );

    await this.loanApi.processData(requestConfig);
    callback();
  }

  /** Сервис закрытия Кредитной Линии */

  async declineDieal(callback = noop): Promise<any> {
    const requestConfig = this.loanApi.postHeaderRequestConfig(
      URIS.DECLINE_DEAL
    );

    await this.loanApi.processData(requestConfig);
    callback();
  }

  async upsellStart() {
    const requestConfig = this.loanApi.postHeaderRequestConfig(
      URIS.UPSELL_START
    );

    await this.loanApi.processData(requestConfig);
  }

  async upsellBack(callback = noop): Promise<any> {
    const requestConfig = this.loanApi.postHeaderRequestConfig(URIS.BACK_STEP);

    await this.loanApi.processData(requestConfig);
    callback();
  }
}
