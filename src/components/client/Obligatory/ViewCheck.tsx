import { inject, observer } from 'mobx-react';
import React from 'react';
import classNames from 'classnames';

import style from './Obligatory.module.scss';
import Checked from '/public/theme/icons/checked_24x24.svg';

import { TViewProps, TViewPropsStore } from './@types';
import { WidgetRoles } from '@src/roles';
import { ButtonWidget, BUTTON_TYPE } from '@components/widgets/ButtonWidget';
import { gt } from '@utils';
import { MainFields } from './MainFields';
import { AdditionalFields } from './AdditionalFields';
import { Policy } from './Policy';
import { LoyaltyCodeField } from '@components/loyalty/LoyaltyCodeField';
import { WithPageContainer } from '@components/hocs/WithPageContainer';
import { STORE_IDS } from '@stores';

function ViewObligatoryCheckComponent(props: TViewProps) {
  const {
    staticData,
    model: { userData, tags, submitEnabled, personalInfoConfirmed },
    controller: { validatePersonalInfo, validateField, addInfo },
    loyaltyStore,
    clientTabs,
  } = props as TViewPropsStore;

  return (
    <>
      {clientTabs}
      <WithPageContainer>
        <div className={style.obligatory}>
          <div>
            <h2 className={style.title}>
              {staticData.title}
              {personalInfoConfirmed && <Checked />}
            </h2>
            <MainFields
              staticData={staticData}
              model={userData}
              controller={{ validatePersonalInfo, validateField }}
              mutable
              readonly
            />
            <h2 className={style.title}>
              {staticData.additionalFieldsTitle}
              {submitEnabled && <Checked />}
            </h2>
            <AdditionalFields
              staticData={staticData}
              model={userData}
              controller={{ validateField }}
            />
            <Policy
              staticData={staticData}
              model={{ ...userData, tags }}
              controller={{ validateField }}
            />
            <div className={style.obligatoryButtons}>
              <ButtonWidget
                id={`Obligatory-${WidgetRoles.button}-${BUTTON_TYPE.BUTTON}`}
                className={classNames(
                  style.buttonWidget,
                  'button_big button_blue'
                )}
                type={BUTTON_TYPE.BUTTON}
                disabled={!(personalInfoConfirmed && submitEnabled)}
                onClick={addInfo}
              >
                {gt.gettext('More')}
              </ButtonWidget>
            </div>
            {loyaltyStore.inputAvailable && (
              <div className={style.obligatoryPromoFields}>
                <LoyaltyCodeField
                  className={style.loyaltyCode}
                  isTooltip={false}
                  isTitle={false}
                  permanentNotify={true}
                />
              </div>
            )}
          </div>
        </div>
      </WithPageContainer>
    </>
  );
}

export const ViewObligatoryCheck = inject(STORE_IDS.LOYALTY_STORE)(
  observer(ViewObligatoryCheckComponent)
);
