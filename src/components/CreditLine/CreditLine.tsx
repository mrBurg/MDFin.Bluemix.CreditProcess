import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react';

import style from './CreditLine.module.scss';

import { TCreditLine } from './@types';
import { ButtonWidget } from '@components/widgets/ButtonWidget';
import classNames from 'classnames';
import { Preloader } from '@components/Preloader';
import { CreditLineSelector } from '@components/CreditLineSelector';
import { TLoanProposal } from '@stores-types/loanStore';
import { FLOW } from '@src/constants';

function CreditLineComponent(props: TCreditLine) {
  const { loanStore, userStore, pageStore } = props;

  const pageData = useMemo(() => pageStore.pageData, [pageStore]);
  const [loanProposal, setLoanProposal] = useState<TLoanProposal>();
  const [isRender, setIsRender] = useState(false);
  const [isUpsell, setIsUpsell] = useState(false);

  const renderNextButton = useCallback(() => {
    if (isUpsell) {
      return (
        <ButtonWidget
          onClick={() =>
            loanStore.upsellBack(() => userStore.getClientNextStep())
          }
          className={style.link}
        >
          {pageData.backButtonText}
        </ButtonWidget>
      );
    }

    return (
      <ButtonWidget
        onClick={() =>
          loanStore.declineDieal(() => userStore.getClientNextStep())
        }
        className={style.link}
      >
        {pageData.closeButtonText}
      </ButtonWidget>
    );
  }, [
    isUpsell,
    loanStore,
    pageData.backButtonText,
    pageData.closeButtonText,
    userStore,
  ]);

  const renderSelector = useCallback(() => {
    if (
      loanStore.cabinetApplication.loanProposal &&
      loanStore.cabinetApplication.loanProposal.amountSegment
    ) {
      return (
        <CreditLineSelector
          className={classNames({ [style.selector]: !isUpsell })}
          formTitle={pageData.subTitle}
        />
      );
    }
  }, [isUpsell, loanStore.cabinetApplication.loanProposal, pageData.subTitle]);

  useEffect(() => {
    const getDataCabinetApplication = async () => {
      await userStore.getClientNextStep(async () => {
        await loanStore.getCabinetApplication();

        const { loanProposal, flow } = loanStore.cabinetApplication;

        if (flow == FLOW.UPSELL) {
          setIsUpsell(true);
        }

        setLoanProposal(loanProposal);
        setIsRender(true);
      });
    };

    getDataCabinetApplication();
  }, [loanStore, userStore]);

  if (loanProposal && pageData && isRender) {
    return (
      <>
        <div className={style.creditLine}>
          <h1>{pageData.title}</h1>
          {renderSelector()}

          <ButtonWidget
            onClick={() => {
              loanStore.reactivation(() => userStore.getClientNextStep());
            }}
            className={classNames(style.button, 'button_blue')}
          >
            {pageData.buttonText}
          </ButtonWidget>
        </div>
        <div className={style.buttonWrap}>{renderNextButton()}</div>
      </>
    );
  }

  return <Preloader />;
}

export const CreditLine = observer(CreditLineComponent);
