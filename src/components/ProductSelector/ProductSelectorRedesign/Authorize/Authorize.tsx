import React, {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import difference from 'lodash/difference';
import reduce from 'lodash/reduce';
import size from 'lodash/size';
import union from 'lodash/union';
import { inject, observer } from 'mobx-react';

import { STORE_IDS } from '@stores';

import {
  capitaliseFirstLetter,
  handleErrors,
  stopScroll,
  validator,
} from '@utils';
import { TField, TGetSignUpData } from '@stores-types/userStore';
import { FIELD_NAME, URIS_SUFFIX } from '@src/constants';
import { TCheckboxData } from '@components/widgets/CheckboxWidget/@types';
import { TAuthorizationPropsStore, TFieldData } from './@types';
import { ViewAuthorize } from './View';

function AuthorizeComponent(props: any) {
  const { loanStore, userStore, otpStore } = props as TAuthorizationPropsStore;

  const [firstName, setFirstName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [marketing, setMarketing] = useState(false);
  const [invalidFieldsList, setInvalidFieldsList] = useState([] as string[]);
  const [formDisabled, setFormDisabled] = useState(false);
  const [isRenderMarketingPopup, setIsRenderMarketingPopup] = useState(false);
  const [isUserCloseMarketingPopup, setIsUserCloseMarketingPopup] =
    useState(false);
  const [termsDocType, setTermsDocType] = useState(
    'terms_and_conditions_short'
  );

  /** Список полей для валидации */
  const validateItems = useMemo(
    () => [
      { name: FIELD_NAME.FIRST_NAME, value: firstName },
      { name: FIELD_NAME.PHONE_NUMBER, value: phoneNumber },
    ],
    [firstName, phoneNumber]
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

  const sendUserData = useCallback(async () => {
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

    //імітація сторінки sign-up. Потрібно для виклику сервісу валідації ОТП.
    otpStore.updateUrisKey(URIS_SUFFIX.SIGN_UP);

    const sendOtp = () => {
      userStore
        .sendUserData({ firstName, phoneNumber, marketing }, otpStore, {
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
    });
  }, [firstName, loanStore, marketing, otpStore, phoneNumber, userStore]);

  const updateMarketing = useCallback((value: boolean) => {
    setIsRenderMarketingPopup(false);
    setMarketing(value);

    setIsUserCloseMarketingPopup(true);
    stopScroll(false);
  }, []);

  const marketingClose = useCallback(() => {
    setFormDisabled(false);
    setIsRenderMarketingPopup(false);
    stopScroll(false);
  }, []);

  const onSubmitHandler = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      setFormDisabled(true);

      const submitForm = async () => {
        const res = validateForm(validateItems);
        if (!res) {
          setFormDisabled(false);

          const eventSubmitterId = (event.nativeEvent as SubmitEvent).submitter
            ?.id;
          if (eventSubmitterId?.endsWith('bottom')) window.scrollTo(0, 0);
          return;
        }

        if (!marketing) {
          // показываем  marketingPopup
          setIsRenderMarketingPopup(true);
          stopScroll(true);
          return;
        }

        sendUserData();
      };

      submitForm();
    },
    [marketing, sendUserData, validateForm, validateItems]
  );

  const validateField = useCallback(
    (data: TFieldData) => {
      validateForm([{ name: data.name, value: data.value }]);
    },
    [validateForm]
  );

  const onBlurFields = useCallback(
    (data: TFieldData) => {
      const newValue = capitaliseFirstLetter(data.value);

      if (newValue != data.value) {
        if (data.name == 'firstName') {
          setFirstName(newValue);
        }
      }
      validateField(data);
    },
    [validateField]
  );

  const onChangeHandler = useCallback((data: TFieldData) => {
    setFirstName(data.value);
  }, []);

  const onChangeHandlerPhone = useCallback((data: TFieldData) => {
    setPhoneNumber(data.value.replace(/[\s-_]/g, ''));
  }, []);

  const onChangeHandleCheckBox = useCallback((data: TCheckboxData) => {
    setMarketing(data.checked);
  }, []);

  const otpAction = () => {
    otpStore.validateOtp();
  };

  /** Після закриття маркетингового попапу,
   * потрібно створювати заявку та/або отримувати отп */
  useEffect(() => {
    if (isUserCloseMarketingPopup) {
      sendUserData();
    }
  }, [isUserCloseMarketingPopup, sendUserData]);

  useEffect(() => {
    const init = async () => {
      const termsDocType = await loanStore.getTermsAndConditionsDocType();
      if (termsDocType) {
        setTermsDocType(termsDocType);
      }

      const { phoneNumber, firstName } =
        (await userStore.getSignUp_Data()) as TGetSignUpData;

      if (phoneNumber) {
        setPhoneNumber(phoneNumber);
      }

      if (firstName) {
        setFirstName(firstName);
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
          firstName,
          phoneNumber,
          marketing,
          invalidFieldsList,
          formDisabled,
          isRenderMarketingPopup,
          termsDocType,
        },
        props as TAuthorizationPropsStore
      )}
      controller={{
        onSubmitHandler: onSubmitHandler,
        onChangeHandler: onChangeHandler,
        onBlurFields: onBlurFields,
        onChangeHandlerPhone: onChangeHandlerPhone,
        onChangeHandleCheckBox: onChangeHandleCheckBox,
        validateField: validateField,
        otpAction: otpAction,
        marketingAccept: () => updateMarketing(true),
        marketingDecline: () => updateMarketing(false),
        marketingClose, //: () => marketingClose(),
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
