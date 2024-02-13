import React, {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import difference from 'lodash/difference';
import includes from 'lodash/includes';
import reduce from 'lodash/reduce';
import size from 'lodash/size';
import union from 'lodash/union';
import { inject, observer } from 'mobx-react';

import { STORE_IDS } from '@stores';

import { handleErrors, validator } from '@utils';
import { TField, TGetSignUpData } from '@stores-types/userStore';
import { FIELD_NAME, URIS_SUFFIX } from '@src/constants';
import { TCheckboxData } from '@components/widgets/CheckboxWidget/@types';
import {
  TAuthorizationPropsStore,
  TAuthorizeProps,
  TFieldData,
} from './@types';
import { ViewAuthorize } from './View';
import { TProductSelectorFormStatic } from '@stores-types/loanStore';

function AuthorizeComponent(props: TAuthorizeProps) {
  const { loanStore, userStore, otpStore } = props as TAuthorizationPropsStore;

  const [phoneNumber, setPhoneNumber] = useState('');
  const [marketing, setMarketing] = useState(false);
  const [invalidFieldsList, setInvalidFieldsList] = useState([] as string[]);
  const [formDisabled, setFormDisabled] = useState(false);
  const [termsDocType, setTermsDocType] = useState(
    'terms_and_conditions_short'
  );

  /** Список полей для валидации */
  const validateItems = useMemo(
    () => [{ name: FIELD_NAME.PHONE_NUMBER, value: phoneNumber }],
    [phoneNumber]
  );

  /** добавить невалидные/убрать валидные поля из State
   * @param validateResult - список невалидных полей
   * @param validateItemsNames - список имен полей для валидации
   */
  const getInvalidFields = useCallback(
    (validateResult: string[], validateItemsNames: string[]) => {
      if (size(validateResult)) {
        return union(validateResult, invalidFieldsList);
      }
      return difference(invalidFieldsList, validateItemsNames);
    },
    [invalidFieldsList]
  );

  const validateForm = useCallback(
    (validateItems: TField[]) => {
      const validateItemsNames = reduce(
        validateItems,
        (accum, itemName) => {
          accum.push(itemName.name);

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

  /** Старт заявки та одразу запит ОТП-коду */
  const startApplication = useCallback(async () => {
    let {
      loanData: { amount, term },
      termFraction,
    } = loanStore;
    const fixedAmount = true;

    if (amount == 0 || term == 0) {
      await loanStore.getCalculatorParams();

      amount = loanStore.loanData.amount;
      term = loanStore.loanData.term;
      termFraction = loanStore.termFraction;
    }

    const sendOtp = () => {
      //імітація сторінки sign-up. Потрібно для виклику сервісу валідації ОТП.
      otpStore.updateUrisKey(URIS_SUFFIX.SIGN_UP);

      userStore
        .sendUserData({ phoneNumber, marketing }, otpStore, {
          amount,
          term,
          termFraction,
          fixedAmount,
        })
        .then(() => {
          setFormDisabled(true);
          return;
        })
        .catch((err) => {
          handleErrors(err);
        });
    };

    userStore.fetchWithAuth(() => {
      loanStore.getLoanAuthorize(() => sendOtp());
    }, false);
  }, [loanStore, marketing, otpStore, phoneNumber, userStore]);

  /** Старт заявки та редірект на сторінку sign-up */
  const registerUser = useCallback(() => {
    const updateUserData = () => {
      userStore.updateStore_UserData({
        phoneNumber: includes(invalidFieldsList, FIELD_NAME.PHONE_NUMBER)
          ? ''
          : phoneNumber,
        marketing: marketing,
      });
      setFormDisabled(false);
    };

    userStore.fetchWithAuth(() => {
      loanStore.getLoanAuthorize(() => updateUserData());
    }, false);
  }, [userStore, loanStore, invalidFieldsList, phoneNumber, marketing]);

  const onSubmitHandler = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      setFormDisabled(true);

      const submitForm = async () => {
        const res = validateForm(validateItems);

        if (res && marketing) {
          startApplication();
        } else {
          registerUser();
        }
      };

      submitForm();
    },
    [validateForm, validateItems, marketing, startApplication, registerUser]
  );

  const validateField = useCallback(
    (data: TFieldData) => {
      validateForm([{ name: data.name, value: data.value }]);
    },
    [validateForm]
  );

  const onChangeHandlerPhone = useCallback((data: TFieldData) => {
    setPhoneNumber(data.value.replace(/[\s-_]/g, ''));
  }, []);

  const onChangeHandleCheckBox = useCallback((data: TCheckboxData) => {
    setMarketing(data.checked);
  }, []);

  const otpAction = () => {
    otpStore.validateOtp();
  };

  useEffect(() => {
    const init = async () => {
      const termsDocType = await loanStore.getTermsAndConditionsDocType();
      if (termsDocType) {
        setTermsDocType(termsDocType);
      }

      const { phoneNumber } =
        (await userStore.getSignUp_Data()) as TGetSignUpData;

      if (phoneNumber) {
        setPhoneNumber(phoneNumber);
      }
    };

    init();
  }, [loanStore, userStore]);

  /** RENDER */
  return (
    <ViewAuthorize
      model={Object.assign(
        {},
        {
          phoneNumber,
          marketing,
          invalidFieldsList,
          formDisabled,
          termsDocType,
        },
        props as TProductSelectorFormStatic & TAuthorizationPropsStore
      )}
      controller={{
        onSubmitHandler: onSubmitHandler,
        onChangeHandlerPhone: onChangeHandlerPhone,
        onChangeHandleCheckBox: onChangeHandleCheckBox,
        validateField: validateField,
        otpAction: otpAction,
      }}
    />
  );
}

/** Компенент авторизации, для ProductSelector */
export const Authorize = inject(
  STORE_IDS.OTP_STORE,
  STORE_IDS.LOAN_STORE,
  STORE_IDS.USER_STORE,
  STORE_IDS.PAGE_STORE
)(observer(AuthorizeComponent));
