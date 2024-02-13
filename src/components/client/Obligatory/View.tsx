import { inject, observer } from 'mobx-react';
import React from 'react';
import classNames from 'classnames';

import style from './Obligatory.module.scss';

import { TViewProps, TViewPropsStore } from './@types';
import { WidgetRoles } from '@src/roles';
import { ButtonWidget, BUTTON_TYPE } from '@components/widgets/ButtonWidget';
import { gt } from '@utils';
import { MainFields } from './MainFields';
import { AdditionalFields } from './AdditionalFields';
import { Policy } from './Policy';
import { LoyaltyCodeField } from '@components/loyalty/LoyaltyCodeField';
import { ServiceMessage } from '@components/ServiceMessage';
import { WithPageContainer } from '@components/hocs/WithPageContainer';
import { STORE_IDS } from '@stores';

function ViewObligatoryComponent(props: TViewProps) {
  const {
    staticData,
    model: { userData, tags, submitEnabled },
    controller: { validateField, onSubmitHandler },
    loyaltyStore,
    clientTabs,
  } = props as TViewPropsStore;

  return (
    <>
      <ServiceMessage className={style.serviceMessage} isCabinet={true} />
      {clientTabs}
      <WithPageContainer>
        <div className={style.obligatory}>
          <form onSubmit={onSubmitHandler}>
            <h2 className={style.title}>{staticData.additionalFieldsTitle}</h2>
            <MainFields
              staticData={staticData}
              model={userData}
              controller={{ validateField }}
            />
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
                id={`Obligatory-${WidgetRoles.button}-${BUTTON_TYPE.SUBMIT}`}
                className={classNames(
                  style.buttonWidget,
                  'button_big button_blue'
                )}
                type={BUTTON_TYPE.SUBMIT}
                disabled={!submitEnabled}
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
          </form>
        </div>
      </WithPageContainer>
    </>
  );
}

export const ViewObligatory = inject(STORE_IDS.LOYALTY_STORE)(
  observer(ViewObligatoryComponent)
);
