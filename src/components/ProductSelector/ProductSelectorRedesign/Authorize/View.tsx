import React, { useCallback, useContext, useEffect, useState } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react';

import { gt } from '@utils';
import cfg from '@root/config.json';
import { EMouseEvents } from '@src/trackingConstants';
import { WithTag, WithTracking } from '@components/hocs';
import { ATTACHMENT_TYPE, EVENT, FIELD_NAME } from '@src/constants';
import { AbstractRoles, NonStandardRoles, WidgetRoles } from '@src/roles';
import { GlobalPopupContext } from '@root/pages/_app';

import { MarketingPopup } from '@components/popup';
import { LoanButton } from '@components/LoanButton';
import { GetAttachment } from '@components/GetAttachment';
import { LoyaltyCodeFieldRedesign } from '@components/loyalty/LoyaltyCodeFieldRedesign';
import { ButtonWidget, BUTTON_TYPE } from '@components/widgets/ButtonWidget';
import { ReactInputMaskWidget } from '@components/widgets/ReactInputMaskWidget';
import { CheckboxWidget } from '@components/widgets/CheckboxWidget';
import { InputWidget, INPUT_TYPE } from '@components/widgets/InputWidget';
import { TCheckboxData } from '@components/widgets/CheckboxWidget/@types';

import { TViewProps } from './@types';
import style from './Authorize.module.scss';

function ViewAuthorizeComponent(props: TViewProps) {
  const { setGlobalPopup } = useContext(GlobalPopupContext);
  const [showButton, setShowButton] = useState(false);

  const {
    model: {
      firstName,
      phoneNumber,
      invalidFieldsList,
      formDisabled,
      marketing,
      isRenderMarketingPopup,
      termsDocType,
      pageStore: { pageData },
      userStore,
    },
    controller: {
      onSubmitHandler,
      onChangeHandler,
      onBlurFields,
      onChangeHandlerPhone,
      onChangeHandleCheckBox,
      validateField,
      marketingAccept,
      marketingDecline,
      marketingClose,
    },
  } = props;

  const renderLoanButton = useCallback(
    (id?: string) => {
      if (userStore.userLoggedIn) {
        return (
          <LoanButton
            className={style.loanButton}
            label={gt.gettext('Register Loan')}
          />
        );
      }

      return (
        <ButtonWidget
          id={`Authorize-${WidgetRoles.button}-${BUTTON_TYPE.SUBMIT}${
            id ? '-' + id : ''
          }`}
          className={classNames(style.loanButton)}
          type={BUTTON_TYPE.SUBMIT}
          disabled={formDisabled}
          aria-label="Aplică acum"
        >
          {gt.gettext('Register Loan')}
        </ButtonWidget>
      );
    },
    [formDisabled, userStore.userLoggedIn]
  );

  useEffect(() => {
    setGlobalPopup(
      <MarketingPopup
        isRender={isRenderMarketingPopup}
        callbackAccept={marketingAccept}
        callbackDecline={marketingDecline}
        callbackClose={marketingClose}
        isRedesign={true}
      />
    );
  }, [
    isRenderMarketingPopup,
    marketingAccept,
    marketingClose,
    marketingDecline,
    setGlobalPopup,
  ]);

  useEffect(() => {
    const onScroll = () => setShowButton(Boolean(window.scrollY));

    window.addEventListener(EVENT.SCROLL, onScroll);

    return () => window.removeEventListener(EVENT.SCROLL, onScroll);
  }, []);

  return (
    <form
      className={style.authorization}
      onSubmit={(event) => onSubmitHandler(event)}
    >
      <div className={style.fieldsContainer}>
        {!userStore.userLoggedIn && (
          <>
            <fieldset className={style.fieldset}>
              <InputWidget
                id={`Authorize-${AbstractRoles.input}-${INPUT_TYPE.TEXT}-${FIELD_NAME.FIRST_NAME}`}
                name={FIELD_NAME.FIRST_NAME}
                className={style.inputWidget}
                inputClassName={style.inputRedesign}
                invalid={invalidFieldsList.includes(FIELD_NAME.FIRST_NAME)}
                type={INPUT_TYPE.TEXT}
                value={firstName}
                placeholder={pageData.namePlaceHolder}
                disabled={formDisabled}
                maxLength={40}
                onChange={(event) =>
                  onChangeHandler({
                    name: event.currentTarget.name,
                    value: event.currentTarget.value,
                  })
                }
                onBlur={(event) =>
                  onBlurFields({
                    name: event.currentTarget.name,
                    value: event.currentTarget.value,
                  })
                }
              />

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
          className={classNames(style.loanButtonBottom, {
            [style.show]: showButton,
          })}
        >
          <div className={style.holder}>{renderLoanButton('bottom')}</div>
        </div>
      </div>
    </form>
  );
}

export const ViewAuthorize = observer(ViewAuthorizeComponent);
