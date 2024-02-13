import React, { useCallback, useState } from 'react';
import { inject } from 'mobx-react';

import style from './Policy.module.scss';

import { STORE_IDS } from '@stores';
import { WithTag } from '@components/hocs';
import { CheckboxWidget } from '@components/widgets/CheckboxWidget';
import { FIELD_NAME } from '@src/constants';
import { TPolicyProps, TPolicyPropsStore } from './@types';
import { TClientAddInfo } from '@stores-types/userStore';
import { ModalWindow } from '@components/popup';
import { MODAL_TYPE } from '@components/popup/ModalWindow/ModalWindow';

function PolicyComponent(props: TPolicyProps) {
  const { staticData, model, userStore, controller } =
    props as TPolicyPropsStore;

  const [modalWindow, setModalWindow] = useState(false);  

  const onChangeHandleCheckBox = useCallback(
    (data: any) => {      
      controller.validateField({ name: data.name, value: data.checked });

      userStore.updateClientAddInfo({
        [data.name]: data.checked,
      } as TClientAddInfo);
    },
    [controller, userStore]
  );

  const acceptModalWindowHandle = useCallback(() => {
    onChangeHandleCheckBox({ 
      name: FIELD_NAME.CONFIRM_BENEFICIARY, checked: true 
    })
    setModalWindow(false);
  }, [onChangeHandleCheckBox]);

  const declineModalWindowHandle = useCallback(() => {
    onChangeHandleCheckBox({ 
      name: FIELD_NAME.CONFIRM_BENEFICIARY, checked: false 
    })
    setModalWindow(false);
  }, [onChangeHandleCheckBox]);  

  const isShowModal = useCallback((data: any) => {
    if (data.name == FIELD_NAME.CONFIRM_BENEFICIARY && !data.checked) {
      return setModalWindow(true);
    }
    setModalWindow(false);
    onChangeHandleCheckBox(data)
  },[onChangeHandleCheckBox])  

  return (
    <div className={style.policy}>
      <h2 className={style.policyTitle}>{staticData.policyTitle}</h2>
      <WithTag tags={model.tags}>
        <p>{staticData.loan_terms_and_conditions}</p>
      </WithTag>
      <div className={style.conditions}>
        <div className={style.agreement}>
          <CheckboxWidget
            name={FIELD_NAME.REQUEST_BIROULDE_CREDIT}
            invalid={model.invalidFieldsList.includes(
              FIELD_NAME.REQUEST_BIROULDE_CREDIT
            )}
            checked={userStore.clientAddInfo.requestBirouldeCredit}
            onChange={(_event, data) => onChangeHandleCheckBox(data)}
          />
          <WithTag tags={model.tags}>
            <div>{staticData.credit_bureau}</div>
          </WithTag>
        </div>
        <div className={style.agreement}>
          <CheckboxWidget
            name={FIELD_NAME.CONFIRM_ANAF}
            invalid={model.invalidFieldsList.includes(FIELD_NAME.CONFIRM_ANAF)}
            checked={userStore.clientAddInfo.confirmANAF}
            onChange={(_event, data) => onChangeHandleCheckBox(data)}
          />
          <WithTag tags={model.tags}>
            <div>{staticData.anaf}</div>
          </WithTag>
        </div>
        <div className={style.agreement}>
          <CheckboxWidget
            name={FIELD_NAME.CONFIRM_BENEFICIARY}
            invalid={model.invalidFieldsList.includes(
              FIELD_NAME.CONFIRM_BENEFICIARY
            )}
            checked={userStore.clientAddInfo.confirmBeneficiary}
            onChange={(_event, data) => isShowModal(data)}
          />
          <WithTag tags={model.tags}>
            <div>{staticData.real_beneficiary}</div>
          </WithTag>
        </div>
      </div>
      {/* <p>{staticData.policyText}</p> */}
      {modalWindow /* && !userStore.clientAddInfo.confirmBeneficiary */ && (
        <ModalWindow
          type={MODAL_TYPE.PROMPT}
          textData={[staticData.real_beneficiaryWarning]}
            acceptHandler={acceptModalWindowHandle}
            declineHandler={declineModalWindowHandle}
            staticData={{
              acceptButtonText: staticData.real_beneficiaryAccept,
              declineButtonText: staticData.real_beneficiaryDecline,
            }}
          />
        )}
    </div>
  );
}

export const Policy = inject(STORE_IDS.USER_STORE)(PolicyComponent);
