import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { observer } from 'mobx-react';
import difference from 'lodash/difference';
import noop from 'lodash/noop';
import reduce from 'lodash/reduce';
import remove from 'lodash/remove';
import size from 'lodash/size';
import union from 'lodash/union';

import style from './Obligatory.module.scss';

import { Preloader } from '@components/Preloader';
import { DIRECTORIES, URIS } from '@routes';
import {
  stopScroll,
  validator,
  prepareClientPersonalInfo,
  prepareClientAddInfo,
  gt,
} from '@utils';
import { TObligatory } from './@types';
import { ViewObligatory } from './View';
import { ViewObligatoryCheck } from './ViewCheck';
import {
  ATTACHMENT_TYPE,
  CLIENT_TABS,
  DOC_TYPE,
  FIELD_NAME,
  FLOW,
  SLUG,
} from '@src/constants';
import {
  GetAttachment,
  GetGeneratedAttachment,
} from '@components/GetAttachment';
import { TJSON } from '@interfaces';
import { ModalWindow } from '@components/popup';
import { ButtonWidget } from '@components/widgets/ButtonWidget';
import { ClientTabs } from '../ClientTabs';

function ObligatoryComponent(props: TObligatory) {
  const { pageStore, userStore, loanStore } = props;

  const defaultHiddenFields = useMemo(
    () => [FIELD_NAME.LOAN_PURPOSE_DESCR],
    []
  );

  const [isRender, setIsRender] = useState(false);
  const [invalidFieldsList, setInvalidFieldsList] = useState([] as string[]);
  const [submitEnabled, setSubmitEnabled] = useState(false);
  const [hiddenFields, setHiddenFields] = useState(defaultHiddenFields);
  const [modalWindow, setModalWindow] = useState(false);

  const clientPersonalInfo = useMemo(
    () => userStore.clientPersonalInfo,
    [userStore.clientPersonalInfo]
  );
  const clientAddInfo = useMemo(
    () => userStore.clientAddInfo,
    [userStore.clientAddInfo]
  );

  const validatePersonalInfoItems = useMemo(
    () => [
      {
        name: FIELD_NAME.LAST_NAME,
        value: clientPersonalInfo.lastName!,
      },
      {
        name: FIELD_NAME.FIRST_NAME,
        value: clientPersonalInfo.firstName!,
      },
      {
        name: FIELD_NAME.BIRTH_DATE,
        value: clientPersonalInfo.birthDate,
      },
      { name: FIELD_NAME.PIN, value: clientPersonalInfo.pin },
      {
        name: FIELD_NAME.PASSPORT,
        value: clientPersonalInfo.passport,
      },
    ],
    [
      clientPersonalInfo.birthDate,
      clientPersonalInfo.firstName,
      clientPersonalInfo.lastName,
      clientPersonalInfo.passport,
      clientPersonalInfo.pin,
    ]
  );

  const validateAddInfoItems = useMemo(
    () => [
      {
        name: FIELD_NAME.INCOME,
        value: clientAddInfo.income,
      },
      {
        name: FIELD_NAME.LOAN_PURPOSE_ID,
        value: clientAddInfo.loanPurpose_id!,
      },
      {
        name: FIELD_NAME.LOAN_PURPOSE_DESCR,
        value: clientAddInfo.loanPurposeDescr,
      },
      {
        name: FIELD_NAME.OTHER_PHONE_NUMBER,
        value: clientAddInfo.otherPhoneNumber,
      },
      {
        name: FIELD_NAME.REQUEST_BIROULDE_CREDIT,
        value: clientAddInfo.requestBirouldeCredit,
      },
      {
        name: FIELD_NAME.CONFIRM_BENEFICIARY,
        value: clientAddInfo.confirmBeneficiary,
      },
    ],
    [
      clientAddInfo.income,
      clientAddInfo.loanPurposeDescr,
      clientAddInfo.loanPurpose_id,
      clientAddInfo.otherPhoneNumber,
      clientAddInfo.requestBirouldeCredit,
      clientAddInfo.confirmBeneficiary,
    ]
  );

  const getInvalidFields = useCallback(
    (validateResult: any, validateItemsNames: any) => {
      if (size(validateResult)) {
        return union(validateResult, invalidFieldsList);
      }

      return difference(invalidFieldsList, validateItemsNames);
    },
    [invalidFieldsList]
  );

  const validateForm = useCallback(
    (validateItems: any) => {
      const validateItemsNames = reduce(
        validateItems,
        (accum, item) => {
          accum.push(item.name);

          return accum;
        },
        [] as string[]
      );

      const validateResult = validator(validateItems, userStore);
      const validatedData = getInvalidFields(
        validateResult,
        validateItemsNames
      );

      setInvalidFieldsList(validatedData);

      return !size(validatedData);
    },
    [getInvalidFields, userStore]
  );

  const onSubmitHandler = useCallback(
    (event: any) => {
      event.preventDefault();

      setSubmitEnabled(false);

      const submitForm = async () => {
        const result = validateForm([
          ...validatePersonalInfoItems,
          ...validateAddInfoItems,
        ]);

        if (!result) {
          return setSubmitEnabled(true);
        }

        const wizardData = await userStore.saveWizardStep(
          URIS.ALL_CLIENT_INFO,
          {
            clientPersonalInfo: prepareClientPersonalInfo(clientPersonalInfo),
            clientAddInfo,
          }
        );

        if (wizardData && wizardData.showWarning) {
          return setModalWindow(true);
        }

        setModalWindow(false);
        userStore.getClientNextStep(() => setSubmitEnabled(true));
      };

      submitForm();
    },
    [
      clientAddInfo,
      clientPersonalInfo,
      userStore,
      validateAddInfoItems,
      validateForm,
      validatePersonalInfoItems,
    ]
  );

  const addInfo = useCallback(async () => {
    setSubmitEnabled(false);

    const result = validateForm([
      ...validatePersonalInfoItems,
      ...validateAddInfoItems,
    ]);

    if (!result) {
      return setSubmitEnabled(true);
    }

    const wizardData = await userStore.saveWizardStep(URIS.ADDITIONAL_INFO, {
      clientAddInfo: prepareClientAddInfo(clientAddInfo),
    });

    if (wizardData && wizardData.showWarning) {
      return setModalWindow(true);
    }

    setModalWindow(false);
    userStore.getClientNextStep(() => setSubmitEnabled(true));
  }, [
    clientAddInfo,
    userStore,
    validateAddInfoItems,
    validateForm,
    validatePersonalInfoItems,
  ]);

  const validateField = useCallback(
    (data: any) => validateForm([data]),
    [validateForm]
  );

  const declineModalWindowHandle = useCallback(() => {
    setSubmitEnabled(true);
    setModalWindow(false);
  }, []);

  const validatePersonalInfo = useCallback(
    (callback = noop) => {
      const result = validateForm(validatePersonalInfoItems);

      callback(result);
    },
    [validateForm, validatePersonalInfoItems]
  );

  const params = useMemo(() => pageStore.params, [pageStore.params]);

  const pageData = useMemo(() => pageStore.pageData, [pageStore.pageData]);

  const userData = useMemo(
    () => ({
      dirLoanPurpose: pageStore.dirLoanPurpose,
      dirLoanPurposeDescr: pageStore.dirLoanPurposeDescr,
      clientAddInfo,
      invalidFieldsList,
      hiddenFields,
    }),
    [
      clientAddInfo,
      hiddenFields,
      invalidFieldsList,
      pageStore.dirLoanPurpose,
      pageStore.dirLoanPurposeDescr,
    ]
  );

  const model = useMemo(
    () => ({
      userData,
      submitEnabled,
      personalInfoConfirmed: clientPersonalInfo.confirmed,
      tags: reduce(
        pageData.tags,
        (accum, item, index) => {
          switch (index) {
            case ATTACHMENT_TYPE.LOAN_TERMS_AND_CONDITIONS:
            case ATTACHMENT_TYPE.PRIVACY_POLICY:
            case ATTACHMENT_TYPE.REAL_BENEFICIARY:
              accum[index] = (
                <GetAttachment
                  key={index}
                  attachmentType={item.type}
                  label={item.label}
                />
              );
              break;
            default:
              accum[index] = (
                <GetGeneratedAttachment
                  key={index}
                  attachmentType={item.type}
                  label={item.label}
                  requestData={{
                    ...prepareClientPersonalInfo(clientPersonalInfo),
                    ...prepareClientAddInfo(clientAddInfo),
                  }}
                />
              );
          }

          return accum;
        },
        {} as TJSON
      ),
    }),
    [clientAddInfo, clientPersonalInfo, pageData.tags, submitEnabled, userData]
  );

  const renderTabs = useCallback(() => {
    if (userStore.flow == FLOW.WIZARD) {
      return (
        <div className={style.tabs}>
          <ClientTabs current={CLIENT_TABS.OBLIGATORY} />
        </div>
      );
    }
  }, [userStore.flow]);

  const renderView = useCallback(() => {
    switch (params.slug) {
      case SLUG.CHECK:
        return (
          <ViewObligatoryCheck
            clientTabs={renderTabs()}
            staticData={pageData}
            model={model}
            controller={{
              validatePersonalInfo,
              validateField,
              addInfo,
            }}
          />
        );
      default:
        return (
          <ViewObligatory
            clientTabs={renderTabs()}
            staticData={pageData}
            model={model}
            controller={{
              onSubmitHandler,
              validateField,
            }}
          />
        );
    }
  }, [
    addInfo,
    model,
    onSubmitHandler,
    pageData,
    params.slug,
    renderTabs,
    validateField,
    validatePersonalInfo,
  ]);

  const renderBackButton = useCallback(() => {
    if (userStore.flow == FLOW.UPSELL) {
      return (
        <ButtonWidget
          onClick={() =>
            loanStore.upsellBack(() => userStore.getClientNextStep())
          }
          className={style.link}
        >
          {pageData.backButtonText}
        </ButtonWidget>
      );
    }
  }, [loanStore, pageData, userStore]);

  useEffect(() => {
    userStore.fetchWithAuth(async () => {
      await userStore.getClientNextStep();
      await pageStore.getDirectory(DIRECTORIES.dirLoanPurpose);

      switch (params.slug) {
        case SLUG.CHECK:
          await userStore.getClientInfo();

          break;
        default:
          await userStore.getAllClientInfo();
      }

      setIsRender(true);
    });
  }, [pageStore, params.slug, userStore]);

  useEffect(
    () =>
      setSubmitEnabled(
        !size(invalidFieldsList) && !!clientAddInfo.requestBirouldeCredit
      ),
    [invalidFieldsList, clientAddInfo.requestBirouldeCredit]
  );

  useEffect(() => {
    const hiddenFields = remove([...defaultHiddenFields], (item) => {
      switch (item) {
        case FIELD_NAME.LOAN_PURPOSE_DESCR:
          return (
            !clientAddInfo.loanPurpose_id ||
            clientAddInfo.loanPurpose_id == DOC_TYPE.idFront
          );
      }
    });

    if (
      !hiddenFields.includes(FIELD_NAME.LOAN_PURPOSE_DESCR) &&
      !size(userData.dirLoanPurposeDescr)
    ) {
      userStore.fetchWithAuth(async () => {
        await pageStore.getDirectory(
          DIRECTORIES.dirLoanPurpose,
          String(clientAddInfo.loanPurpose_id)
        );

        setHiddenFields(hiddenFields);
      });

      return;
    }

    setHiddenFields(hiddenFields);
  }, [
    defaultHiddenFields,
    clientAddInfo.loanPurpose_id,
    userData.dirLoanPurposeDescr,
    pageStore,
    userStore,
  ]);

  useEffect(() => stopScroll(modalWindow), [modalWindow]);

  if (isRender) {
    return (
      <>
        {renderView()}
        {renderBackButton()}
        {modalWindow && !clientAddInfo.confirmANAF && (
          <ModalWindow
            textData={[pageData.ANAFWarning]}
            declineHandler={declineModalWindowHandle}
            staticData={{
              acceptButtonText: gt.gettext('accept'),
              declineButtonText: gt.gettext('decline'),
            }}
          />
        )}
      </>
    );
  }

  return <Preloader />;
}

export const Obligatory = observer(ObligatoryComponent);
