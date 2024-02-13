import React, { useState, useEffect, useCallback } from 'react';
import size from 'lodash/size';

import { TDeal } from './@types';
import { Preloader } from '@components/Preloader';
import { ViewDeal } from './View';
import cfg from '@root/config.json';

function Deal(props: TDeal) {
  const { userStore, loanStore, pageStore } = props;

  const [isRender, setIsRender] = useState(false);
  const [isInvalidData, setIsInvalidData] = useState(false);

  const cabinetPay = useCallback(() => {
    const dealInfo = loanStore.cabinetDeals.dealInfos[0];

    if (dealInfo.paymentAmount < cfg.minPaymentAmount) {
      return setIsInvalidData(true);
    }

    if (dealInfo) {
      loanStore.cabinetPay({
        dealNo: dealInfo.dealNo,
        paymentAmount: dealInfo.paymentAmount,
        inCabinet: true,
      });
    }

    setIsInvalidData(false);
  }, [loanStore]);

  useEffect(() => {
    userStore.fetchWithAuth(async () => {
      await userStore.getClientNextStep();
      await loanStore.getCabinetDeals();

      setIsRender(true);
    });
  }, [loanStore, userStore]);

  if (isRender && !!size(loanStore.cabinetDeals.dealInfos)) {
    return (
      <ViewDeal
        staticData={pageStore.pageData}
        model={{ ...loanStore.cabinetDeals, dataIsInvalid: isInvalidData }}
        controller={{ cabinetPay, callback: () => setIsInvalidData(false) }}
      />
    );
  }

  return <Preloader />;
}

export { Deal };
