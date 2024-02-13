import { inject } from 'mobx-react';
import React, { useCallback, useState } from 'react';

import style from './MainFields.module.scss';

import cfg from '@root/config.json';
import { InputWidget, INPUT_TYPE } from '@components/widgets/InputWidget';
import { FIELD_NAME } from '@src/constants';
import { AbstractRoles } from '@src/roles';
import { ReactInputMaskWidget } from '@components/widgets/ReactInputMaskWidget';
import { TMainFieldsProps, TMainFieldsPropsStore } from './@types';
import { getTabIndex } from '@utils';
import { STORE_IDS } from '@stores';
import { TClientPersonalInfo } from '@stores-types/userStore';
import { ButtonWidget, BUTTON_TYPE } from '@components/widgets/ButtonWidget';
import classNames from 'classnames';

function MainFieldsComponent(props: TMainFieldsProps) {
  const { staticData, model, controller, mutable, readonly, userStore } =
    props as TMainFieldsPropsStore;

  const [fieldReadonly, setFieldReadonly] = useState(readonly);
  const [submitEnabled, setSubmitEnabled] = useState(true);

  const onChangeHandler = useCallback(
    (data: any) =>
      userStore.updateClientPersonalInfo({
        [data.name]: data.value.trim().replace(/\s-\s/g, ''),
      } as TClientPersonalInfo),
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

  const confirmPersonalInfo = useCallback(() => {
    setSubmitEnabled(false);

    if (controller.validatePersonalInfo) {
      controller.validatePersonalInfo((result) => {
        if (result) {
          setFieldReadonly(result);
          return userStore.confirmPersonalInfo(setSubmitEnabled);
        }

        setSubmitEnabled(!result);
      });
    }
  }, [controller, userStore]);

  return (
    <>
      <div className={style.mainFields}>
        <InputWidget
          id={`Obligatory-${AbstractRoles.input}-${INPUT_TYPE.TEXT}-${FIELD_NAME.LAST_NAME}`}
          name={FIELD_NAME.LAST_NAME}
          value={userStore.clientPersonalInfo.lastName || ''}
          className={style.inputWidget}
          invalid={model.invalidFieldsList.includes(FIELD_NAME.LAST_NAME)}
          inputClassName={style.input}
          type={INPUT_TYPE.TEXT}
          placeholder={staticData.lastName}
          title={staticData.lastName}
          maxLength={50}
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
          disabled={fieldReadonly}
        />
        <InputWidget
          id={`Obligatory-${AbstractRoles.input}-${INPUT_TYPE.TEXT}-${FIELD_NAME.FIRST_NAME}`}
          name={FIELD_NAME.FIRST_NAME}
          value={userStore.clientPersonalInfo.firstName || ''}
          className={style.inputWidget}
          invalid={model.invalidFieldsList.includes(FIELD_NAME.FIRST_NAME)}
          inputClassName={style.input}
          type={INPUT_TYPE.TEXT}
          placeholder={staticData.firstName}
          title={staticData.firstName}
          maxLength={50}
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
          disabled={fieldReadonly}
        />
        <ReactInputMaskWidget
          id={`Obligatory-${AbstractRoles.input}-${INPUT_TYPE.TEL}-${FIELD_NAME.BIRTH_DATE}`}
          name={FIELD_NAME.BIRTH_DATE}
          value={userStore.clientPersonalInfo.birthDate || ''}
          className={style.inputMaskWidget}
          inputClassName={style.input}
          invalid={model.invalidFieldsList.includes(FIELD_NAME.BIRTH_DATE)}
          type={INPUT_TYPE.TEL}
          mask={cfg.dateMask}
          maskChar={cfg.maskChar}
          placeholder={staticData.birthDate}
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
          disabled={fieldReadonly}
        />
        <ReactInputMaskWidget
          id={`Obligatory-${AbstractRoles.input}-${INPUT_TYPE.TEL}-${FIELD_NAME.PIN}`}
          name={FIELD_NAME.PIN}
          value={userStore.clientPersonalInfo.pin || ''}
          className={style.inputMaskWidget}
          inputClassName={style.input}
          invalid={model.invalidFieldsList.includes(FIELD_NAME.PIN)}
          type={INPUT_TYPE.TEL}
          mask={cfg.pinMask}
          maskChar={cfg.maskChar}
          placeholder={staticData.birthNumber}
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
          disabled={fieldReadonly}
        />
        <InputWidget
          id={`Obligatory-${AbstractRoles.input}-${INPUT_TYPE.TEL}-${FIELD_NAME.PASSPORT}`}
          name={FIELD_NAME.PASSPORT}
          value={userStore.clientPersonalInfo.passport || ''}
          className={style.inputWidget}
          invalid={model.invalidFieldsList.includes(FIELD_NAME.PASSPORT)}
          inputClassName={style.input}
          placeholder={staticData.idNumber}
          maxLength={12}
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
          tabIndex={getTabIndex(0)}
          disabled={fieldReadonly}
        />
      </div>
      {mutable && (
        <div className={style.mainFieldsButtons}>
          <ButtonWidget
            className={classNames(
              style.buttonWidget,
              style.buttonConfirm,
              'button_big button_blue'
            )}
            type={BUTTON_TYPE.BUTTON}
            onClick={() => confirmPersonalInfo()}
            disabled={userStore.clientPersonalInfo.confirmed || !submitEnabled}
          >
            {staticData.confirm}
          </ButtonWidget>
          <ButtonWidget
            className={classNames('button_inline', style.buttonEdit)}
            type={BUTTON_TYPE.BUTTON}
            onClick={() => setFieldReadonly(!fieldReadonly)}
            disabled={userStore.clientPersonalInfo.confirmed || !fieldReadonly}
          >
            {staticData.edit}
          </ButtonWidget>
        </div>
      )}
    </>
  );
}

export const MainFields = inject(STORE_IDS.USER_STORE)(MainFieldsComponent);
