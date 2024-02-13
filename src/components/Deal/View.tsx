import React, { useCallback, useMemo } from 'react';
import moment from 'moment';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import isNumber from 'lodash/isNumber';
import reduce from 'lodash/reduce';

import style from './Deal.module.scss';

import { TViewProps } from './@types';
import { ButtonWidget, BUTTON_TYPE } from '@components/widgets/ButtonWidget';
import { TDocumentUnit } from '@stores-types/loanStore';
import { gt, makeStaticUri, toFormat } from '@utils';
import { URIS } from '@routes';
import {
  LoanInfo,
  LAYOUT as LOAN_INFO_LAYOUT,
  getDocData,
} from '@components/LoanInfo';
import { Actions, LAYOUT as ACTIONS_LAYOUT } from '@components/Actions';
import cfg from '@root/config.json';
import { DOC_DATA } from '@components/LoanInfo/LoanInfo';

function View(props: TViewProps) {
  const { staticData, model, controller } = props;

  const dealInfo = useMemo(() => model.dealInfos[0], [model.dealInfos]);

  const dealNo = useMemo(
    () => `${cfg.defaultLocale.split('-')[1]}${dealInfo.dealNo}`,
    [dealInfo.dealNo]
  );

  const dealInfoFields = useMemo(
    () => staticData.dealInfoFields,
    [staticData.dealInfoFields]
  );

  const actionProps = useMemo(
    () => ({
      paymentAmount: dealInfo.paymentAmount,
      extensionAmount: dealInfo.extensionAmount,
      currentPlannedPaymentDebt: dealInfo.currentPlannedPaymentDebt,
      closingAmount: dealInfo.closingAmount,
    }),
    [
      dealInfo.closingAmount,
      dealInfo.currentPlannedPaymentDebt,
      dealInfo.extensionAmount,
      dealInfo.paymentAmount,
    ]
  );

  const renderDealInfo = useCallback(() => {
    if (dealInfoFields) {
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
          link: getDocData(docItem[14], DOC_DATA.URL),
        },
        {
          text: dealInfoFields.declaratiaPdf,
          value: dealNo,
          link: getDocData(docItem[13], DOC_DATA.URL),
        },
        getDocData(docItem[40]) && {
          text: dealInfoFields.repaymentSchedule,
          value: dealInfoFields.repaymentSchedule,
          link: getDocData(docItem[40], DOC_DATA.URL),
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
          link: getDocData(docItem[21], DOC_DATA.URL),
        },
        getDocData(docItem[37]) && {
          text: dealInfoFields.anaf,
          value: dealInfoFields.anaf,
          link: getDocData(docItem[37], DOC_DATA.URL),
        },
        {
          text: dealInfoFields.creditOffice,
          value: dealInfoFields.creditOffice,
          link: getDocData(docItem[36], DOC_DATA.URL),
        },
        getDocData(docItem[44]) && {
          text: dealInfoFields.beneficiarReal,
          value: dealInfoFields.beneficiarReal,
          link: getDocData(docItem[44], DOC_DATA.URL),
        },
        getDocData(docItem[42]) && {
          text: dealInfoFields.responsibilityStatement,
          value: dealInfoFields.responsibilityStatement,
          link: getDocData(docItem[42], DOC_DATA.URL),
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
          className={style.info}
          title={staticData.dealInfoTitle}
          params={paramsData}
          layout={LOAN_INFO_LAYOUT.CENTERED}
        />
      );
    }
  }, [
    dealInfo.closingDate,
    dealInfo.documentUnits,
    dealInfo.lastPaymentAmount,
    dealInfo.lastPaymentDate,
    dealInfoFields,
    dealNo,
    staticData.dealInfoTitle,
  ]);

  return (
    <div className={style.deal}>
      {model.notification && (
        <p className={style.notification}>{model.notification}</p>
      )}
      <div className={style.actions__holder}>
        <Actions
          {...actionProps}
          isCabinet={true}
          staticData={staticData}
          layout={ACTIONS_LAYOUT.COLOR}
          dataIsInvalid={model.dataIsInvalid}
          callback={controller.callback}
        />
        <ButtonWidget
          type={BUTTON_TYPE.BUTTON}
          className={classNames(style.button, 'button_big button_green')}
          onClick={() => controller.cabinetPay()}
        >
          {staticData.actions.repayTheLoanOk}
        </ButtonWidget>
      </div>
      {renderDealInfo()}
    </div>
  );
}

export const ViewDeal = observer(View);
