import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react';

import { gt } from '@utils';
import cfg from '@root/config.json';
import { EMouseEvents } from '@src/trackingConstants';
import { WithTag, WithTracking } from '@components/hocs';
import { ATTACHMENT_TYPE, EVENT, FIELD_NAME } from '@src/constants';
import { AbstractRoles, NonStandardRoles, WidgetRoles } from '@src/roles';

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

  const [showButton, setShowButton] = useState(false);

  const renderLoanButton = useCallback(
    (id?: string) => {
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
          id={`Authorize-${WidgetRoles.button}-${BUTTON_TYPE.SUBMIT}${
            id ? '-' + id : ''
          }`}
          className={classNames(style.loanButton)}
          type={BUTTON_TYPE.SUBMIT}
          disabled={formDisabled}
          aria-label={gt.gettext('Register Loan')}
        >
          {gt.gettext('Register Loan')}
        </ButtonWidget>
      );
    },
    [formDisabled, userStore.userLoggedIn]
  );

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
