import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react';

import { gt, isDevice } from '@utils';
import cfg from '@root/config.json';
import { EMouseEvents } from '@src/trackingConstants';
import { WithTag, WithTracking } from '@components/hocs';
import { ATTACHMENT_TYPE, EVENT, FIELD_NAME, SIZE } from '@src/constants';
import { AbstractRoles, NonStandardRoles } from '@src/roles';

import { LoanButton } from '@components/LoanButton';
import { GetAttachment } from '@components/GetAttachment';
import { LoyaltyCodeFieldRedesign } from '@components/loyalty/LoyaltyCodeFieldRedesign';
import { ButtonWidget, BUTTON_TYPE } from '@components/widgets/ButtonWidget';
import { ReactInputMaskWidget } from '@components/widgets/ReactInputMaskWidget';
import { CheckboxWidget } from '@components/widgets/CheckboxWidget';
import { INPUT_TYPE } from '@components/widgets/InputWidget';
import { TCheckboxData } from '@components/widgets/CheckboxWidget/@types';

import { TViewProps } from './@types';
import style from './Authorize.module.scss';
import Image from 'next/image';

function ViewAuthorizeComponent(props: TViewProps) {
  const {
    model: {
      phoneNumber,
      invalidFieldsList,
      formDisabled,
      marketing,
      termsDocType,
      pageStore: { pageData },
      userStore,
    },
    controller: {
      onSubmitHandler,
      onChangeHandlerPhone,
      onChangeHandleCheckBox,
      validateField,
    },
  } = props;

  const [showButton, setShowButton] = useState(
    isDevice(SIZE.XL) ? false : true
  );

  const renderLoanButton = useCallback(() => {
    if (userStore.userLoggedIn) {
      return (
        <LoanButton
          className={style.loanButton}
          label={gt.gettext('Register Loan')}
          idExt="Authorize"
        />
      );
    }

    return (
      <ButtonWidget
        id={'Loan-button-Authorize'}
        className={classNames(style.loanButton)}
        type={BUTTON_TYPE.SUBMIT}
        disabled={formDisabled}
        aria-label={gt.gettext('Register Loan')}
      >
        {gt.gettext('Register Loan')}
      </ButtonWidget>
    );
  }, [formDisabled, userStore.userLoggedIn]);

  const renderFloatButton = useCallback(() => {
    if (userStore.userLoggedIn) {
      return (
        <LoanButton
          className={style.floatButton}
          label={gt.gettext('Start Loan')}
          idExt="Authorize-bottom"
        />
      );
    }

    return (
      <ButtonWidget
        id={'Loan-button-Authorize-bottom'}
        className={classNames(style.floatButton)}
        type={BUTTON_TYPE.SUBMIT}
        disabled={formDisabled}
        aria-label={gt.gettext('Start Loan')}
      >
        {gt.gettext('Start Loan')}
      </ButtonWidget>
    );
  }, [formDisabled, userStore.userLoggedIn]);

  useEffect(() => {
    if (!isDevice(SIZE.XL)) {
      return;
    }

    const onScroll = () => {
      const buttonElement = document.getElementById('Loan-button-Authorize');
      setShowButton(Boolean(buttonElement?.getBoundingClientRect().top! < -12));
    };

    window.addEventListener(EVENT.SCROLL, onScroll);

    return () => window.removeEventListener(EVENT.SCROLL, onScroll);
  }, [userStore.device?.desktop]);

  return (
    <form
      className={style.authorization}
      onSubmit={(event) => onSubmitHandler(event)}
    >
      <div className={style.fieldsContainer}>
        {!userStore.userLoggedIn && (
          <>
            <fieldset className={style.fieldset}>
              <ReactInputMaskWidget
                id={`Authorize-${AbstractRoles.input}-${INPUT_TYPE.TEL}-${FIELD_NAME.PHONE_NUMBER}`}
                name={FIELD_NAME.PHONE_NUMBER}
                value={phoneNumber}
                className={style.inputWidget}
                inputClassName={style.inputRedesign}
                invalid={invalidFieldsList.includes(FIELD_NAME.PHONE_NUMBER)}
                type={INPUT_TYPE.TEL}
                mask={cfg.phoneMask}
                placeholder={
                  pageData.phonePlaceHolder || cfg.phoneMask.replace(/9/g, '*')
                }
                onChange={(event) =>
                  onChangeHandlerPhone({
                    name: event.currentTarget.name,
                    value: event.currentTarget.value,
                  })
                }
                onBlur={(event) =>
                  validateField({
                    name: event.currentTarget.name,
                    value: event.currentTarget.value,
                  })
                }
                disabled={formDisabled}
              />
            </fieldset>

            <WithTag
              tags={{
                terms_and_conditions: (
                  <GetAttachment
                    attachmentType={termsDocType}
                    label={pageData.tagsLabels.terms_and_conditions}
                    key={pageData.tagsLabels.terms_and_conditions}
                  />
                ),
                privacy_policy: (
                  <GetAttachment
                    attachmentType={ATTACHMENT_TYPE.PRIVACY_POLICY}
                    label={pageData.tagsLabels.privacy_policy}
                    key={pageData.tagsLabels.privacy_policy}
                  />
                ),
              }}
            >
              <div className={style.policyTab}>
                {pageData.policyConfirmedRedesign}
              </div>
            </WithTag>
            <div className={style.marketingConfirmation}>
              <CheckboxWidget
                name={FIELD_NAME.MARKETING}
                onChange={(_event, data) =>
                  onChangeHandleCheckBox(data as TCheckboxData)
                }
                invalid={invalidFieldsList.includes(FIELD_NAME.MARKETING)}
                checked={marketing}
                disabled={formDisabled}
                className={style.agree_check}
                aria-label={pageData.marketingConfirmationText}
              />
              <WithTracking
                id={`Authorize-${NonStandardRoles.textWithHTML}`}
                events={[EMouseEvents.CLICK]}
              >
                <div className={style.agree_text}>
                  {pageData.marketingConfirmationText}
                </div>
              </WithTracking>
            </div>
          </>
        )}

        <LoyaltyCodeFieldRedesign className={style.loyaltyCode} />

        <div className={style.loanButtonWrap}>{renderLoanButton()}</div>
        <div
          className={classNames(
            style.floatPanel,
            { [style.show]: showButton },
            'floatPanel floatPanelGap'
          )}
        >
          <div className={style.holder}>
            <div className={style.left}>
              <div className={style.text}>{props.model.floatPanelText}</div>
              <div className={style.button}>{renderFloatButton()}</div>
            </div>
            <div className={style.right}>
              <Image
                width={128}
                height={173}
                src={'/images/main-page/welcome/lady-wow-phone.webp'}
                alt={'lady-wow-image'}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export const ViewAuthorize = observer(ViewAuthorizeComponent);
