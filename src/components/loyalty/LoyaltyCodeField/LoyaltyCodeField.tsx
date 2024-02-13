import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import isEmpty from 'lodash/isEmpty';
import classNames from 'classnames';

import { WithDangerousHTML } from '@components/hocs';
import { ButtonWidget } from '@components/widgets/ButtonWidget';
import { InputWidget, INPUT_TYPE } from '@components/widgets/InputWidget';
import { TChangeEvent, TJSON } from '@interfaces';
import { staticApi, STORE_IDS } from '@stores';
import { TLoyaltyCodeFieldProps, TLoyaltyCodeFieldStores } from './@types';

// import cfg from '@root/config.json';

import style from './LoyaltyCodeField.module.scss';

function LoyaltyCodeFieldComponent(props: TLoyaltyCodeFieldProps) {
  const {
    className,
    loyaltyStore,
    permanentNotify,
    isPlaceholder = true,
    isErrorMessage = true,
    isTitle = true,
    isTooltip = true,
  } = props as TLoyaltyCodeFieldStores;

  // const validator = useRef(new RegExp(cfg.promotionCode));

  const router = useRouter();

  const [codeField, setCodeField] = useState({} as TJSON);
  const [showNotify, setShowNotify] = useState(false);
  const [showReason, setShowReason] = useState(false);
  const [code, setCode] = useState('');
  const [invalid, setInvalid] = useState(false);
  // const [disabled, setDisabled] = useState(false);

  const validateCode = useCallback((value: string) => {
    const codeSizeData = ['{32}']; //validator.current.source.match(/\{\d\}/g);

    if (codeSizeData) {
      const codeSize = codeSizeData[0].replace(/[{}]/g, '');
      const valueValidator = new RegExp(`^.{0,${codeSize}}$`); //new RegExp(`^\\d{0,${codeSize}}$`);

      return valueValidator.test(value);
    }
  }, []);

  const sendCode = useCallback(async () => {
    const isValid = await loyaltyStore.sendLoyaltyCode(code);

    /* if (isValid) {
      return setCode(''); // Стекреть значение
    } */

    setShowReason(!isValid);
    setInvalid(!isValid);
    // setDisabled(Boolean(isValid)); // Заблокировать инпут
  }, [code, loyaltyStore]);

  const onBlurHandler = useCallback(() => {
    if (code) {
      const validationResult = validateCode(code);
      if (validationResult) {
        sendCode();
      }

      // setInvalid(!validator.current.test(code));
      setInvalid(!validationResult);
    }
  }, [code, sendCode, validateCode]);

  const updateCode = useCallback(
    (value: string) => {
      if (validateCode(value)) {
        setCode(value);
        setShowReason(false);
      }

      // if (!value) {
      setInvalid(false);
      // }
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

      setCodeField(staticData.codeField);
    };

    init();
  }, []);

  useEffect(() => {
    if (loyaltyStore.inputAvailable && router.query.lp) {
      const receivedCode = String(router.query.lp);
      const validationResult = validateCode(receivedCode);

      updateCode(receivedCode);

      if (validationResult) {
        setInvalid(validationResult);
      }
    }
  }, [loyaltyStore.inputAvailable, router.query.lp, updateCode, validateCode]);

  /** @deprecated */
  /* useEffect(() => {
    const isValid = validator.current.test(code);

    if (isValid) {
      setInvalid(!isValid);
      sendCode();
    }
  }, [code, sendCode]); */

  if (loyaltyStore.inputAvailable && !isEmpty(codeField)) {
    return (
      <div className={classNames(style.loyaltyCodeWrap, className)}>
        <div className={style.loyaltyCodeMain}>
          {isTitle && (
            <span className={style.loyaltyCodeName}>{codeField.title}</span>
          )}
          <InputWidget
            value={code}
            type={INPUT_TYPE.TEXT}
            onBlur={() => onBlurHandler()}
            onInput={(event: TChangeEvent) =>
              onInputHandler(event.target.value)
            }
            invalid={invalid}
            placeholder={isPlaceholder ? codeField.placeholder : ''}
            aria-label={'promocode'}
            // disabled={disabled}
          />
          {isTooltip && (
            <>
              <ButtonWidget
                onClick={() => setShowNotify(true)}
                onMouseEnter={() => setShowNotify(true)}
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
            </>
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

export const LoyaltyCodeField = inject(STORE_IDS.LOYALTY_STORE)(
  observer(LoyaltyCodeFieldComponent)
);
