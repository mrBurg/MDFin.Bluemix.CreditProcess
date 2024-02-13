import React, { useCallback, useContext, useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import { useRouter } from 'next/router';

import style from './RepaymentForm.module.scss';

import cfg from '@root/config.json';
import { ReactInputMaskWidget } from '@components/widgets/ReactInputMaskWidget';
import { FIELD_NAME, EVENT } from '@src/constants';
import { AbstractRoles, WidgetRoles } from '@src/roles';
import { isDevice } from '@utils';
import { STORE_IDS } from '@stores';
import { TRepaymentFormProps, TRepaymentFormPropsStore } from './@types';
import { ButtonWidget, BUTTON_TYPE } from '@components/widgets/ButtonWidget';
import { InputWidget, INPUT_TYPE } from '@components/widgets/InputWidget';
import { LAYOUT, Repayment } from '@components/Repayment';
import { RepaymentInfoCtx } from '@components/sections/RepaymentInfo';
import { TJSON } from '@interfaces';
import { URLS } from '@routes';

function RepaymentFormComponent(props: TRepaymentFormProps) {
  const { repaymentStore, className, renderTitle } =
    props as TRepaymentFormPropsStore;
  const { setError } = useContext(RepaymentInfoCtx);
  const [isShort, setShort] = useState(isDevice());
  const [receivedData, setReceivedData] = useState({} as TJSON);
  const router = useRouter();

  const submitForm = useCallback(async () => {
    const { formStatic } = repaymentStore;
    const hasDeal = await repaymentStore.getCabinetDeal(receivedData);

    if (hasDeal) {
      setError('');
      repaymentStore.updatePaymentState(true);

      return;
    }

    repaymentStore.setValidForm(false);
    setError(formStatic ? formStatic.loanCanceled : '');
  }, [receivedData, repaymentStore, setError]);

  const onSubmitHandler = useCallback(async () => submitForm(), [submitForm]);

  const onChangeHandler = useCallback(
    (data: Record<'name' | 'value', string>) => {
      repaymentStore.updateDealNo(data.value);
      repaymentStore.setValidForm(true);
    },
    [repaymentStore]
  );

  useEffect(() => {
    const changeWindowSize = () => {
      setShort(isDevice());
    };

    window.addEventListener(EVENT.RESIZE, changeWindowSize);
    changeWindowSize();

    return () => window.removeEventListener(EVENT.RESIZE, changeWindowSize);
  }, []);

  useEffect(() => {
    repaymentStore.initPaymentForm();

    return () => {
      repaymentStore.updatePaymentState(false);
    };
  }, [repaymentStore]);

  useEffect(() => {
    const { dealNo } = receivedData;

    if (dealNo) {
      submitForm();

      router.replace(URLS.REPAYMENT);
    }

    setReceivedData(router.query);
  }, [receivedData, router, submitForm]);

  if (repaymentStore.formStatic) {
    const {
      formStatic,
      repayment,
      cabinetDeal: { dealInfo },
      validForm,
    } = repaymentStore;

    const renderContent = () => {
      if (repayment) {
        return (
          <InputWidget
            value={dealInfo.dealNo}
            className={style.inputWidget}
            inputClassName={style.input}
            placeholderEmbedded
            disabled
          />
        );
      }

      return (
        <form
          onSubmit={(event) => {
            event.preventDefault();

            onSubmitHandler();
          }}
          className={classNames(style.repaymentForm, className)}
        >
          <ReactInputMaskWidget
            id={`RepaymentForm-${AbstractRoles.input}-${INPUT_TYPE.TEXT}`}
            name={FIELD_NAME.PHONE_NUMBER}
            value={dealInfo.dealNo}
            className={style.inputWidget}
            inputClassName={style.input}
            invalid={!validForm}
            type={INPUT_TYPE.TEL}
            mask={cfg.dealNoMask}
            maskChar="*"
            placeholder={cfg.dealNoMask.replace(/9/g, '*')}
            label={formStatic.title}
            onChange={(event) =>
              onChangeHandler({
                name: event.currentTarget.name,
                value: event.currentTarget.value,
              })
            }
            placeholderEmbedded={!isShort}
          />
          <ButtonWidget
            id={`RepaymentForm-${WidgetRoles.button}-${BUTTON_TYPE.SUBMIT}`}
            className={style.button}
            type={BUTTON_TYPE.SUBMIT}
          >
            {formStatic.buttonText}
          </ButtonWidget>
        </form>
      );
    };

    const renderRepayment = () => {
      if (repayment) {
        return <Repayment className={style.repayment} layout={LAYOUT.TABLE} />;
      }
    };

    if (renderTitle) {
      return (
        <>
          <div
            className={classNames(style.header, {
              [style.isRepayment]: repayment,
            })}
          >
            <div className={style.headerItem}>{renderTitle(style.title)}</div>
            <div className={style.headerItem}>{renderContent()}</div>
          </div>
          {renderRepayment()}
        </>
      );
    }

    return (
      <>
        {renderContent()}
        {renderRepayment()}
      </>
    );
  }

  return null;
}

export const RepaymentForm = inject(STORE_IDS.REPAYMENT_STORE)(
  observer(RepaymentFormComponent)
);
