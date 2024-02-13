import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { inject, observer } from 'mobx-react';
import isEmpty from 'lodash/isEmpty';
import classNames from 'classnames';

import { WithDangerousHTML } from '@components/hocs';
import { BUTTON_TYPE, ButtonWidget } from '@components/widgets/ButtonWidget';
import { InputWidget, INPUT_TYPE } from '@components/widgets/InputWidget';
import { TChangeEvent, TJSON } from '@interfaces';
import { staticApi, STORE_IDS } from '@stores';
import { TLoyaltyCodeFieldProps, TLoyaltyCodeFieldStores } from './@types';

// import cfg from '@root/config.json';

import style from './LoyaltyCodeFieldRedesign.module.scss';
import { EVENT } from '@src/constants';

function LoyaltyCodeFieldRedesignComponent(props: TLoyaltyCodeFieldProps) {
  const {
    className,
    loyaltyStore,
    permanentNotify,
    isPlaceholder = true,
    isErrorMessage = true,
    isTitle = true,
    isTooltip = true,
  } = props as TLoyaltyCodeFieldStores;

  const buttonRef = useRef<HTMLButtonElement>(null);

  // const validator = useRef(new RegExp(cfg.promotionCode));

  const router = useRouter();

  const [codeField, setCodeField] = useState({} as TJSON);
  const [showNotify, setShowNotify] = useState(false);
  const [showReason, setShowReason] = useState(false);
  const [showField, setShowField] = useState(false);
  const [code, setCode] = useState('');
  const [invalid, setInvalid] = useState(false);
  // const [disabled, setDisabled] = useState(false);

  const validateCode = useCallback((value: string) => {
    const codeSizeData = ['{15}'];

    if (codeSizeData) {
      const codeSize = codeSizeData[0].replace(/[{}]/g, '');
      const valueValidator = new RegExp(`^[A-Za-z0-9-_]{0,${codeSize}}$`); //new RegExp(`^.{0,${codeSize}}$`);
      return valueValidator.test(value);
    }
  }, []);

  const sendCode = useCallback(async () => {
    const isValid = await loyaltyStore.sendLoyaltyCode(code);
    setShowReason(!isValid);
    setInvalid(!isValid);
  }, [code, loyaltyStore]);

  const onBlurHandler = useCallback(() => {
    if (code) {
      const validationResult = validateCode(code);
      if (validationResult) {
        sendCode();
      }

      setInvalid(!validationResult);
    }
  }, [code, sendCode, validateCode]);

  const updateCode = useCallback(
    (value: string) => {
      if (validateCode(value)) {
        setCode(value);
        setShowReason(false);
      }

      setInvalid(false);
    },
    [validateCode]
  );

  const onInputHandler = useCallback(
    (value: string) => updateCode(value),
    [updateCode]
  );

  useEffect(() => {
    const init = async () => {
      const staticData = await staticApi.fetchStaticData({
        block: 'loyalty',
        path: 'static',
      });
      setCodeField(staticData.codeFieldRedesign);
    };

    init();
  }, []);

  useEffect(() => {
    // if (loyaltyStore.inputAvailable && router.query.lp) {
    if (router.query.lp) {
      const receivedCode = String(router.query.lp);
      const validationResult = validateCode(receivedCode);

      updateCode(receivedCode);

      if (validationResult) {
        setInvalid(validationResult);
      }
    }
  }, [router.query.lp, updateCode, validateCode]);

  useEffect(() => {
    const buttonClick = (event: MouseEvent) => {
      setShowNotify(event.target == buttonRef.current);
    };
    document.addEventListener(EVENT.CLICK, buttonClick);
    return () => document.removeEventListener(EVENT.CLICK, buttonClick);
  }, []);

  /** RENDER */
  // if (loyaltyStore.inputAvailable && !isEmpty(codeField)) {
  if (!isEmpty(codeField)) {
    return (
      <div className={classNames(style.loyaltyCodeWrap, className)}>
        <div className={style.loyaltyCodeMain}>
          {isTitle && !showField && (
            <ButtonWidget
              className={style.loyaltyCodeButton}
              type={BUTTON_TYPE.BUTTON}
              onClick={() => setShowField(true)}
              id={'ShowLoyaltyCode-button'}
              aria-label={codeField.title}
            >
              {codeField.title}
            </ButtonWidget>
          )}
          {showField && (
            <InputWidget
              value={code}
              inputClassName={style.inputRedesign}
              type={INPUT_TYPE.TEXT}
              onBlur={() => onBlurHandler()}
              onInput={(event: TChangeEvent) =>
                onInputHandler(event.target.value)
              }
              invalid={invalid}
              placeholder={isPlaceholder ? codeField.placeholder : ''}
              aria-label={'Codul promoțional'}
              // disabled={disabled}
            />
          )}
          {isTooltip && (
            <div className={style.tooltipWrap}>
              <ButtonWidget
                onClick={() => setShowNotify(true)}
                onMouseEnter={() => setShowNotify(true)}
                className={style.tooltipButton}
                id={'LoyaltyCodeTooltip-button'}
                aria-label={'Codul promoțional info'}
                ref={buttonRef}
                type={BUTTON_TYPE.BUTTON}
              >
                {'?'}
              </ButtonWidget>
              {showNotify && (
                <div className={style.loyaltyCodeNotify}>
                  <WithDangerousHTML>
                    <span>{codeField.tooltipNotify}</span>
                  </WithDangerousHTML>
                  <ButtonWidget
                    onClick={() => setShowNotify(false)}
                    className={style.closeNotify}
                  />
                </div>
              )}
            </div>
          )}
        </div>
        {isErrorMessage && (
          <WithDangerousHTML>
            <div
              className={classNames(style.loyaltyCodeError, {
                [style.loyaltyCodeErrorOpen]: showReason,
              })}
            >
              {codeField.errorNotify}
            </div>
          </WithDangerousHTML>
        )}
        {permanentNotify && (
          <WithDangerousHTML>
            <div className={style.tooltipNotify}>{codeField.tooltipNotify}</div>
          </WithDangerousHTML>
        )}
      </div>
    );
  }

  return null;
}

export const LoyaltyCodeFieldRedesign = inject(STORE_IDS.LOYALTY_STORE)(
  observer(LoyaltyCodeFieldRedesignComponent)
);
