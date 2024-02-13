import { inject } from 'mobx-react';
import React, { useCallback } from 'react';

import style from './AdditionalFields.module.scss';

import cfg from '@root/config.json';
import { InputWidget, INPUT_TYPE } from '@components/widgets/InputWidget';
import { FIELD_NAME } from '@src/constants';
import { AbstractRoles } from '@src/roles';
import { ReactInputMaskWidget } from '@components/widgets/ReactInputMaskWidget';
import { ReactSelectWidget } from '@components/widgets/ReactSelectWidget';
import { InputAutocompleteWidget } from '@components/widgets/InputAutocompleteWidget';
import { TAdditionalFieldsProps, TAdditionalFieldsPropsStore } from './@types';
import { STORE_IDS } from '@stores';
import { TClientAddInfo } from '@stores-types/userStore';
import { TSelectBlurData } from '@components/widgets/ReactSelectWidget/@types';

function AdditionalFieldsComponent(props: TAdditionalFieldsProps) {
  const { staticData, model, controller, userStore, pageStore } =
    props as TAdditionalFieldsPropsStore;

  const onChangeHandler = useCallback(
    (data: any) => {
      let fieldData = data.value;

      switch (data.name) {
        case FIELD_NAME.INCOME:
          fieldData = fieldData.replace(/[^\d]/g, '');
          break;
      }

      userStore.updateClientAddInfo({
        [data.name]: fieldData.trim().replace(/\s-\s/g, ''),
      } as TClientAddInfo);
    },
    [userStore]
  );

  const onBlurHandler = useCallback(
    (data: any) =>
      controller.validateField({
        name: data.name,
        value: data.value,
      }),
    [controller]
  );

  const onChangeSelectHandler = useCallback(
    (data: TSelectBlurData) => {
      if (data.name == FIELD_NAME.LOAN_PURPOSE_ID) {
        pageStore.clearDirectory('dirLoanPurposeDescr');
      }

      userStore.updateClientAddInfo({
        [data.name]: data.value as unknown,
      } as TClientAddInfo);
    },
    [pageStore, userStore]
  );

  const onBlurSelectHandler = useCallback(
    (data: TSelectBlurData) => controller.validateField(data),
    [controller]
  );

  return (
    <div className={style.additionalFields}>
      <InputWidget
        id={`Obligatory-${AbstractRoles.input}-${INPUT_TYPE.TEL}-${FIELD_NAME.INCOME}`}
        name={FIELD_NAME.INCOME}
        value={
          userStore.clientAddInfo.income == 0 || userStore.clientAddInfo.income
            ? String(userStore.clientAddInfo.income)
            : ''
        }
        className={style.inputWidget}
        invalid={model.invalidFieldsList.includes(FIELD_NAME.INCOME)}
        inputClassName={style.input}
        type={INPUT_TYPE.TEL}
        placeholder={staticData.monthlyIncome}
        maxLength={6}
        onChange={(event) =>
          onChangeHandler({
            name: event.currentTarget.name,
            value: event.currentTarget.value,
          })
        }
        onBlur={(event) =>
          onBlurHandler({
            name: event.currentTarget.name,
            value: event.currentTarget.value,
          })
        }
      />
      <ReactSelectWidget
        inputId={`Obligatory-${AbstractRoles.select}-${FIELD_NAME.LOAN_PURPOSE_ID}`}
        name={FIELD_NAME.LOAN_PURPOSE_ID}
        value={userStore.clientAddInfo.loanPurpose_id}
        className={style.selectWidget}
        invalid={model.invalidFieldsList.includes(FIELD_NAME.LOAN_PURPOSE_ID)}
        placeholder={staticData.loanPurpose}
        options={model.dirLoanPurpose}
        onChange={onChangeSelectHandler}
        onBlur={onBlurSelectHandler}
      />
      {!model.hiddenFields.includes(FIELD_NAME.LOAN_PURPOSE_DESCR) && (
        <InputAutocompleteWidget
          id={`Obligatory-${AbstractRoles.input}-${INPUT_TYPE.TEL}-${FIELD_NAME.LOAN_PURPOSE_DESCR}`}
          name={FIELD_NAME.LOAN_PURPOSE_DESCR}
          value={userStore.clientAddInfo.loanPurposeDescr || ''}
          className={style.inputWidget}
          inputClassName={style.input}
          invalid={model.invalidFieldsList.includes(
            FIELD_NAME.LOAN_PURPOSE_DESCR
          )}
          type={INPUT_TYPE.TEXT}
          placeholder={staticData.loanPurposeDescr}
          onChange={(event) =>
            onChangeHandler({
              name: event.currentTarget.name,
              value: event.currentTarget.value,
            })
          }
          onBlur={(event) =>
            onBlurHandler({
              name: event.currentTarget.name,
              value: event.currentTarget.value,
            })
          }
          options={model.dirLoanPurposeDescr}
        />
      )}
      <ReactInputMaskWidget
        id={`Obligatory-${AbstractRoles.input}-${INPUT_TYPE.TEL}-${FIELD_NAME.OTHER_PHONE_NUMBER}`}
        name={FIELD_NAME.OTHER_PHONE_NUMBER}
        value={userStore.clientAddInfo.otherPhoneNumber || ''}
        className={style.inputMaskWidget}
        inputClassName={style.input}
        invalid={model.invalidFieldsList.includes(
          FIELD_NAME.OTHER_PHONE_NUMBER
        )}
        type={INPUT_TYPE.TEL}
        mask={cfg.phoneMask}
        placeholder={staticData.otherPhone}
        onChange={(event) =>
          onChangeHandler({
            name: event.currentTarget.name,
            value: event.currentTarget.value,
          })
        }
        onBlur={(event) =>
          onBlurHandler({
            name: event.currentTarget.name,
            value: event.currentTarget.value,
          })
        }
      />
    </div>
  );
}

export const AdditionalFields = inject(
  STORE_IDS.USER_STORE,
  STORE_IDS.PAGE_STORE
)(AdditionalFieldsComponent);
