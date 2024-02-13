import React from 'react';
import classNames from 'classnames';

import style from './Authorization.module.scss';

import cfg from '@root/config.json';
import { ATTACHMENT_TYPE, FIELD_NAME, URIS_SUFFIX } from '@src/constants';
import { WithDangerousHTML, WithTag, WithTracking } from '@components/hocs';
import { INPUT_TYPE } from '@components/widgets/InputWidget';
import { AbstractRoles, NonStandardRoles, WidgetRoles } from '@src/roles';
import { ReactInputMaskWidget } from '@components/widgets/ReactInputMaskWidget';
import { OtpOneField } from '@components/Otp/OtpOneField';
import { GetAttachment } from '@components/GetAttachment';
import { CheckboxWidget } from '@components/widgets/CheckboxWidget';
import { EMouseEvents } from '@src/trackingConstants';
import { ButtonWidget, BUTTON_TYPE } from '@components/widgets/ButtonWidget';
import { gt } from '@utils';
import { TViewProps } from './@types';
import { observer } from 'mobx-react';
import { MarketingPopup } from '@components/popup';
import { TCheckboxData } from '@components/widgets/CheckboxWidget/@types';

function ViewAuthorizationComponent(props: TViewProps) {
  const {
    model: {
      phoneNumber,
      invalidFields,
      formDisabled,
      marketing,
      isRenderMarketingPopup,
      termsAndConditionsDocType,
      itsSignUp,
      pageStore: { pageData },
      otpStore,
      formHeader,
    },
    controller: {
      onSubmitHandler,
      onChangeHandlerPhone,
      onChangeHandleCheckBox,
      validateField,
      otpAction,
      marketingAccept,
      marketingDecline,
      marketingClose,
    },
  } = props;

  return (
    <form
      className={style.authorization}
      onSubmit={(event) => onSubmitHandler(event)}
    >
      {formHeader && (
        <>
          <h2 className={style.formTitle}>
            {itsSignUp ? pageData.formTitle : pageData.pageTitle}
          </h2>
          {otpStore.otpReady && (
            <WithDangerousHTML>
              <div>{pageData.otpCallMessage}</div>
            </WithDangerousHTML>
          )}
        </>
      )}
      <div className={style.fieldsContainer}>
        <fieldset className={style.fieldset}>
          <ReactInputMaskWidget
            id={`Authorization-${AbstractRoles.input}-${INPUT_TYPE.TEL}-${FIELD_NAME.PHONE_NUMBER}`}
            name={FIELD_NAME.PHONE_NUMBER}
            value={phoneNumber}
            className={style.inputWidget}
            inputClassName={style.inputSignUp}
            invalid={invalidFields.includes(FIELD_NAME.PHONE_NUMBER)}
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
        {otpStore.otpReady ? (
          <OtpOneField
            className={style.otp}
            action={() => otpAction()}
            page={URIS_SUFFIX.SIGN_UP}
          />
        ) : (
          <>
            {itsSignUp && (
              <>
                <WithTag
                  tags={{
                    terms_and_conditions: (
                      <GetAttachment
                        attachmentType={termsAndConditionsDocType}
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
                    {pageData.policyConfirmed}
                  </div>
                </WithTag>
                <div className={style.marketingConfirmation}>
                  <CheckboxWidget
                    name={FIELD_NAME.MARKETING}
                    onChange={(_event, data) =>
                      onChangeHandleCheckBox(data as TCheckboxData)
                    }
                    invalid={invalidFields.includes(FIELD_NAME.MARKETING)}
                    checked={marketing}
                    disabled={formDisabled}
                    className={style.agree_check}
                  />
                  <WithTracking
                    id={`Otp-${NonStandardRoles.textWithHTML}`}
                    events={[EMouseEvents.CLICK]}
                  >
                    <div className={style.agree_text}>
                      {pageData.marketingConfirmationText}
                    </div>
                  </WithTracking>
                </div>
              </>
            )}
            <ButtonWidget
              id={`Authorization-${WidgetRoles.button}-${BUTTON_TYPE.SUBMIT}`}
              className={classNames(style.button, 'button_big button_blue')}
              type={BUTTON_TYPE.SUBMIT}
              disabled={formDisabled}
            >
              {itsSignUp
                ? gt.gettext(pageData.buttonText)
                : pageData.buttonText}
            </ButtonWidget>
          </>
        )}
      </div>
      <MarketingPopup
        isRender={isRenderMarketingPopup}
        callbackAccept={marketingAccept}
        callbackDecline={marketingDecline}
        callbackClose={marketingClose}
      />
    </form>
  );
}

export const ViewAuthorization = observer(ViewAuthorizationComponent);
