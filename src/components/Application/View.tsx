import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import find from 'lodash/find';
import isNumber from 'lodash/isNumber';
import size from 'lodash/size';
import reduce from 'lodash/reduce';
import moment from 'moment';
import classNames from 'classnames';
import { inject, observer } from 'mobx-react';

import style from './Application.module.scss';

import ApplauseIcon from '/public/theme/icons/applause_24x24.svg';

import { ClientTabs } from '@components/client/ClientTabs';
import { CLIENT_TABS, DOC_TYPE, FIELD_NAME, FLOW } from '@src/constants';
import { WithTag } from '@components/hocs';
import { InputWidget, INPUT_TYPE } from '@components/widgets/InputWidget';
import { AbstractRoles, WidgetRoles } from '@src/roles';
import { ButtonWidget, BUTTON_TYPE } from '@components/widgets/ButtonWidget';
import { AccountsForm } from '@components/AccountsForm';
import { TDataRow } from '@components/LoanInfo/@types';
import { getDocData, LAYOUT, LoanInfo } from '@components/LoanInfo';
import { gt, makeStaticUri, toFormat } from '@utils';
import { TViewProps, ViewComponentStores } from './@types';
import { CreditLineSelector } from '@components/CreditLineSelector';
import { TDocumentUnit, TLoanProposal } from '@stores-types/loanStore';
import { ModalWindow } from '@components/popup';
import { STORE_IDS } from '@stores';
import { PolicyInfo } from '@components/PolicyInfo';
import { MODAL_TYPE } from '@components/popup/ModalWindow/ModalWindow';
import { LayoutCtx } from '@components/Layout';
import { DOC_DATA } from '@components/LoanInfo/LoanInfo';
import { RejectNotify } from './RejectNotify';
import { WithPageContainer } from '@components/hocs/WithPageContainer';
import { LoyaltyCodeField } from '@components/loyalty/LoyaltyCodeField';
import { URIS } from '@routes';
import cfg from '@root/config.json';
import { ServiceMessage } from '@components/ServiceMessage';
import { TCheckboxData } from '@components/widgets/CheckboxWidget/@types';

function ApplicationViewComponent(props: TViewProps) {
  const {
    staticData,
    loanStore,
    pageStore,
    model: {
      checkBoxes,
      invalidFieldsList,
      isDisabled,
      showModalWindow,
      email,
      showHolidayNotify,
      isSelectorRender,
      agreeDeclarationInfo,
      isUpsell,
      upsellIsDisabled,
    },
    controller: {
      onChangeCheckbox,
      updateEmail,
      onBlurHandler,
      onFocusHandler,
      cabinetConfirm,
      cabinetDecline,
      closeDeclarationInfo,
      setShowModalWindow,
      setIsSelectorRender,
      upsellButtonHandler,
    },
  } = props as ViewComponentStores;

  const { blur } = useContext(LayoutCtx);

  const isAmountSegment = useMemo(
    () =>
      loanStore.cabinetApplication.loanProposal &&
      !!size(loanStore.cabinetApplication.loanProposal.amountSegment),
    [loanStore.cabinetApplication.loanProposal]
  );

  const isDealInfos = useMemo(
    () => !!size(loanStore.cabinetApplication.dealInfos),
    [loanStore.cabinetApplication.dealInfos]
  );

  const renderAccounts = useCallback(() => {
    if (loanStore.cabinetApplication.paymentTokenUnit) {
      return (
        <AccountsForm
          className={style.accounts}
          showHolidayNotify={showHolidayNotify}
          {...loanStore.cabinetApplication.paymentTokenUnit}
        />
      );
    }
  }, [loanStore.cabinetApplication.paymentTokenUnit, showHolidayNotify]);

  const renderPolicy = useCallback(() => {
    if (size(checkBoxes)) {
      return (
        <PolicyInfo
          className={style.policy}
          checkBoxes={checkBoxes}
          docs={loanStore.cabinetApplication.documentUnits}
          onChange={(data) => onChangeCheckbox(data as TCheckboxData)}
        />
      );
    }
  }, [
    checkBoxes,
    loanStore.cabinetApplication.documentUnits,
    onChangeCheckbox,
  ]);

  const renderLoanInfo = useCallback(() => {
    const { loanProposal, documentUnits } = loanStore.cabinetApplication;
    const { loanInfoTitle, loanInfoFields } = staticData;

    const orderSort = [
      'payment',
      'paymentDate',
      'dateTo',
      'contract',
      'statement',
      'amount',
      'term',
    ] as (keyof TLoanProposal)[];

    const docItem = reduce(
      documentUnits,
      (accum, item) => {
        accum[item.type_id] = item;

        return accum;
      },
      [] as TDocumentUnit[]
    );

    const contractData = find(
      docItem,
      (item) => item && item.type_id == DOC_TYPE.agreement
    );

    const statementData = find(
      documentUnits,
      (item) => item && item.type_id == DOC_TYPE.statementResponsibility
    );

    if (loanProposal) {
      const paramsData = reduce(
        orderSort,
        (accum, item) => {
          let itemData = {
            type: item,
            text: loanInfoFields[item],
            value: loanProposal[item],
          } as TDataRow;

          switch (item) {
            case 'contract':
              if (getDocData(contractData)) {
                itemData = {
                  ...itemData,
                  link: getDocData<string>(contractData, DOC_DATA.URL),
                };
              }

              break;
            case 'statement':
              if (getDocData(statementData)) {
                itemData = {
                  ...itemData,
                  link: getDocData<string>(statementData, DOC_DATA.URL),
                  value: getDocData<string>(statementData, DOC_DATA.FILENAME),
                };
              }

              break;
            case 'term':
              if (loanProposal.termFraction) {
                itemData = {
                  ...itemData,
                  type: item + loanProposal.termFraction,
                };
              }
          }

          accum.push(itemData);

          return accum;
        },
        [] as TDataRow[]
      );

      return (
        <LoanInfo
          title={!isDealInfos && loanInfoTitle}
          className={style.loanInfo}
          params={paramsData}
        />
      );
    }

    return null;
  }, [isDealInfos, loanStore.cabinetApplication, staticData]);

  const renderLoyaltyCodeField = useCallback(() => {
    const dealInfoFields = pageStore.pageData.dealInfoFields;

    if (
      !(dealInfoFields && isDealInfos && loanStore.cabinetApplication.dealInfos)
    ) {
      return (
        <LoyaltyCodeField
          className={style.loyaltyCode}
          isTooltip={false}
          isTitle={false}
        />
      );
    }
  }, [
    isDealInfos,
    loanStore.cabinetApplication.dealInfos,
    pageStore.pageData.dealInfoFields,
  ]);

  const renderDealInfo = useCallback(() => {
    const dealInfoFields = pageStore.pageData.dealInfoFields;
    // const loanInfoFields = pageStore.pageData.loanInfoFields;
    // const loanProposal = loanStore.cabinetApplication.loanProposal;
    // const documentUnits = loanStore.cabinetApplication.documentUnits;

    if (
      dealInfoFields &&
      isDealInfos &&
      loanStore.cabinetApplication.dealInfos
    ) {
      const dealInfo = loanStore.cabinetApplication.dealInfos[0];
      const dealNo = `${cfg.defaultLocale.split('-')[1]}${dealInfo.dealNo}`;
      const docItem = reduce(
        dealInfo.documentUnits,
        (accum, item) => {
          accum[item.type_id] = item;

          return accum;
        },
        [] as TDocumentUnit[]
      );

      const paramsData = [
        //{ text: pageData.maturity, value: dealInfo.maturity! }, //appr_product_id eq 999
        {
          text: dealInfoFields.closingDate,
          value: moment(dealInfo.closingDate).format(cfg.tinyDateFormat),
        },
        {
          text: dealInfoFields.agreementPdf,
          value: dealNo,
          link: getDocData<string>(docItem[14], DOC_DATA.URL),
        },
        {
          text: dealInfoFields.refuse,
          value: (
            <ButtonWidget
              id={`Application-${WidgetRoles.button}-refuse`}
              className={style.refuseLink}
              onClick={() => {
                if (isDealInfos) {
                  return setShowModalWindow(true);
                }

                cabinetDecline();
              }}
            >
              {moment(dealInfo.closingDate).format(cfg.tinyDateFormat)}
            </ButtonWidget>
          ),
        },
        {
          text: dealInfoFields.declaratiaPdf,
          value: dealNo,
          link: getDocData<string>(docItem[13], DOC_DATA.URL),
        },
        getDocData(docItem[40]) && {
          text: dealInfoFields.repaymentSchedule,
          value: dealInfoFields.repaymentSchedule,
          link: getDocData<string>(docItem[40], DOC_DATA.URL),
        },
        {
          text: dealInfoFields.dataProtectionPolicy,
          value: dealInfoFields.dataProtectionPolicy,
          link: makeStaticUri(
            (URIS.GET_ATTACHMENT_DOC_TYPE + 'privacy_policy') as URIS
          ),
        },
        {
          text: dealInfoFields.feis,
          value: dealInfoFields.feis,
          link: getDocData<string>(docItem[21], DOC_DATA.URL),
        },
        getDocData(docItem[37]) && {
          text: dealInfoFields.anaf,
          value: dealInfoFields.anaf,
          link: getDocData<string>(docItem[37], DOC_DATA.URL),
        },
        {
          text: dealInfoFields.creditOffice,
          value: dealInfoFields.creditOffice,
          link: getDocData<string>(docItem[36], DOC_DATA.URL),
        },
        getDocData(docItem[44]) && {
          text: dealInfoFields.beneficiarReal,
          value: dealInfoFields.beneficiarReal,
          link: getDocData(docItem[44], DOC_DATA.URL),
        },
        getDocData(docItem[42]) && {
          text: dealInfoFields.responsibilityStatement,
          value: dealInfoFields.responsibilityStatement,
          link: getDocData<string>(docItem[42], DOC_DATA.URL),
        },
        {
          text: dealInfoFields.lastPayment,
          value: isNumber(dealInfo.lastPaymentAmount)
            ? toFormat(dealInfo.lastPaymentAmount, {
                style: 'currency',
                currency: gt.gettext('Currency'),
              })
            : '',
        },
        {
          text: dealInfoFields.lastPaymentDate,
          value: dealInfo.lastPaymentDate
            ? moment(dealInfo.lastPaymentDate).format(cfg.tinyDateFormat)
            : '',
        },
      ];

      return (
        <LoanInfo
          className={style.dealInfo}
          title={staticData.dealInfoTitle}
          params={paramsData}
          layout={LAYOUT.DEFAULT}
          afterContent={
            <ButtonWidget
              id={`Application-${WidgetRoles.button}-${BUTTON_TYPE.SUBMIT}`}
              className={classNames(style.accept, 'button_big button_blue')}
              onClick={cabinetConfirm}
              disabled={isDisabled}
            >
              {staticData.buttonText}
            </ButtonWidget>
          }
          collapsed
        />
      );
    }
  }, [
    cabinetConfirm,
    cabinetDecline,
    isDealInfos,
    isDisabled,
    loanStore.cabinetApplication.dealInfos,
    pageStore.pageData.dealInfoFields,
    setShowModalWindow,
    staticData.buttonText,
    staticData.dealInfoTitle,
  ]);

  const renderCreditLineSelector = useCallback(() => {
    if (isAmountSegment) {
      return (
        <CreditLineSelector
          calculate
          callBack={() => {
            setIsSelectorRender(true);
          }}
        />
      );
    }
  }, [isAmountSegment, setIsSelectorRender]);

  const renderUpsell = useCallback(() => {
    if (isUpsell) {
      const { upsell } = staticData;

      return (
        <div className={style.upsell}>
          <ButtonWidget
            className={style.upsellButton}
            type={BUTTON_TYPE.BUTTON}
            onClick={() => upsellButtonHandler()}
            disabled={upsellIsDisabled}
          >
            {upsell.button}
          </ButtonWidget>
          <p className={style.upsellText}>{upsell.text}</p>
        </div>
      );
    }
  }, [isUpsell, staticData, upsellButtonHandler, upsellIsDisabled]);

  const renderTabs = useCallback(() => {
    if (loanStore.cabinetApplication.flow == FLOW.WIZARD) {
      return (
        <div className={style.tabs}>
          <ClientTabs current={CLIENT_TABS.APPLICATION} />
        </div>
      );
    }
  }, [loanStore.cabinetApplication.flow]);

  useEffect(() => {
    if (!isAmountSegment) {
      setIsSelectorRender(true);
    }
  }, [isAmountSegment, setIsSelectorRender]);

  if (loanStore.cabinetApplication) {
    return (
      <>
        <ServiceMessage className={style.serviceMessage} isCabinet={true} />
        {renderTabs()}
        <WithPageContainer>
          <div
            className={classNames(style.application, {
              [style.applicationBlur]: blur,
            })}
          >
            {loanStore.cabinetApplication.notification && (
              <WithTag
                tags={{
                  'applause-icon': <ApplauseIcon />,
                }}
              >
                <div className={style.title}>
                  {loanStore.cabinetApplication.notification}
                </div>
              </WithTag>
            )}

            {renderCreditLineSelector()}
            {renderUpsell()}
            {renderAccounts()}
            {renderPolicy()}

            {isSelectorRender && (
              <>
                <InputWidget
                  id={`Application-${AbstractRoles.input}-${INPUT_TYPE.TEXT}-${FIELD_NAME.EMAIL}`}
                  name={FIELD_NAME.EMAIL}
                  type={INPUT_TYPE.TEXT}
                  placeholder={staticData.emailPlaceholder}
                  onChange={(event) => updateEmail(event.currentTarget.value)}
                  onBlur={() => onBlurHandler()}
                  onFocus={() => onFocusHandler()}
                  value={email}
                  invalid={invalidFieldsList.includes(FIELD_NAME.EMAIL)}
                  className={style.email}
                />
                <ButtonWidget
                  id={`Application-${WidgetRoles.button}-${BUTTON_TYPE.SUBMIT}`}
                  className={classNames(style.accept, 'button_big button_blue')}
                  onClick={() => cabinetConfirm()}
                  disabled={isDisabled}
                >
                  {staticData.buttonText}
                </ButtonWidget>

                {renderLoyaltyCodeField()}
                {renderLoanInfo()}
                {renderDealInfo()}

                {!isDealInfos && (
                  <>
                    <div className={style.or}>
                      <span className={style.orText}>{gt.gettext('or')}</span>
                    </div>

                    <ButtonWidget
                      id={`Application-${WidgetRoles.link}-refuse`}
                      className={style.refuse}
                      onClick={() => {
                        if (isDealInfos) {
                          return setShowModalWindow(true);
                        }

                        cabinetDecline();
                      }}
                    >
                      {staticData.rejectButton ||
                        (isAmountSegment
                          ? staticData.creditLineRefuse
                          : staticData.refuse)}
                    </ButtonWidget>
                  </>
                )}
              </>
            )}
          </div>
        </WithPageContainer>

        {/**Нотификация отказа Транша */}
        <RejectNotify />
        {/**Конец нотификации отказа Транша */}

        {/**Нотификация при закрытии Кредитной Линии*/}
        {showModalWindow && (
          <ModalWindow
            type={MODAL_TYPE.PROMPT}
            textData={[staticData.modalText]}
            acceptHandler={() => setShowModalWindow(false)}
            declineHandler={() => cabinetDecline()}
            staticData={{
              acceptButtonText: staticData.buttonTextNoClose,
              declineButtonText:
                staticData.rejectButton || staticData.buttonTextClose,
            }}
          />
        )}
        {/**Конец нотификации при закрытии Кредитной Линии*/}
        {agreeDeclarationInfo && (
          <ModalWindow
            type={MODAL_TYPE.MODAL}
            textData={staticData.agreeDeclarationText}
            declineHandler={() => closeDeclarationInfo()}
          />
        )}
      </>
    );
  }

  return null;
}

export const ApplicationView = inject(
  STORE_IDS.LOAN_STORE,
  STORE_IDS.PAGE_STORE
)(observer(ApplicationViewComponent));
