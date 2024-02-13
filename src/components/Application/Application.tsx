import { inject, observer } from 'mobx-react';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import isBoolean from 'lodash/isBoolean';
import isUndefined from 'lodash/isUndefined';
import reduce from 'lodash/reduce';
import size from 'lodash/size';

import { Preloader } from '@components/Preloader';
import { TCabinetConfirmData, TPolicyDataState } from './@types';
import { TConfirmData, TEmail, TLoanProposal } from '@stores-types/loanStore';
import { TPolicyData, TPolicyDataKey } from '@components/PolicyInfo/@types';
import { staticApi, STORE_IDS, TStores } from '@stores';
import { ApplicationView } from './View';
import { TCheckboxData } from '@components/widgets/CheckboxWidget/@types';

function ApplicationComponent(props: Record<string, unknown>) {
  const { userStore, pageStore, loanStore } = props as TStores;

  const [isRender, setIsRender] = useState(false);
  const [isSelectorRender, setIsSelectorRender] = useState(false);
  const [checkBoxes, setCheckBoxes] = useState({} as TPolicyData);
  const [isDisabled, setIsDisabled] = useState(true);
  const [invalidFieldsList, setInvalidFieldsList] = useState([] as string[]);
  const [showModalWindow, setShowModalWindow] = useState(false);
  const [agreeDeclarationInfo, setAgreeDeclarationInfo] = useState(false);

  const checkEmail = useRef(false) as Record<'current', boolean | null>;

  const [upsellIsDisabled, setUpsellIsDisabled] = useState(true);

  const isUpsell = useMemo(
    () => loanStore.cabinetApplication.loanProposal?.upsellEnabled,
    [loanStore.cabinetApplication.loanProposal?.upsellEnabled]
  );

  const email = useMemo(
    () => loanStore.cabinetApplication.email?.email || '',
    [loanStore.cabinetApplication.email]
  );

  const showHolidayNotify = useMemo(() => {
    if (loanStore.cabinetApplication.paymentTokenUnit) {
      return !!loanStore.cabinetApplication.paymentTokenUnit.holiday;
    }
  }, [loanStore.cabinetApplication.paymentTokenUnit]);

  const checkBoxesData = useMemo(
    () =>
      reduce(
        checkBoxes,
        (accum, item, key) => {
          accum[key as TPolicyDataKey] = item.checked;

          return accum;
        },
        {} as TPolicyDataState
      ),
    [checkBoxes]
  );

  const getCheckBoxesRequest = useCallback(() => {
    const { loanProposal } = loanStore.cabinetApplication;

    if (loanProposal) {
      return Object.assign(
        {},
        reduce(
          pageStore.pageData.policy,
          (accum, item) => {
            let itemState = loanProposal[item.name as keyof TLoanProposal];

            if (isUndefined(itemState)) {
              itemState = true;
            }

            accum[item.name as TPolicyDataKey] = itemState as boolean;

            return accum;
          },
          {} as TPolicyDataState
        ),
        checkBoxesData
      );
    }

    return null;
  }, [checkBoxesData, loanStore.cabinetApplication, pageStore.pageData.policy]);

  const cabinetDecline = useCallback(async () => {
    await loanStore.cabinetDecline();
    userStore.getClientNextStep();
  }, [loanStore, userStore]);

  const closeDeclarationInfo = useCallback(
    async () => setAgreeDeclarationInfo(false),
    []
  );

  const cabinetConfirm = useCallback(async () => {
    if (size(invalidFieldsList)) {
      return;
    }

    const cabinetConfirmData = {
      ...getCheckBoxesRequest(),
      paymentToken: loanStore.currentPaymentToken,
      email: loanStore.cabinetApplication.email,
    } as TCabinetConfirmData;

    if (
      loanStore.cabinetApplication.loanProposal &&
      loanStore.cabinetApplication.loanProposal.amountSegment
    ) {
      cabinetConfirmData.loanRequest = {
        amount: loanStore.cabinetApplication.loanProposal.amount,
        term: loanStore.cabinetApplication.loanProposal.term,
        termFraction: loanStore.termFraction,
      };
    }

    if (!cabinetConfirmData['agreeDeclaration']) {
      checkBoxes['agreeDeclaration'].accent = true;
      setCheckBoxes(checkBoxes);
      setAgreeDeclarationInfo(true);

      return;
    }

    await loanStore.cabinetConfirm(cabinetConfirmData);
    userStore.getClientNextStep();
  }, [
    checkBoxes,
    getCheckBoxesRequest,
    invalidFieldsList,
    loanStore,
    userStore,
  ]);

  const onChangeCheckbox = useCallback(
    (data: TCheckboxData) => {
      setCheckBoxes({
        ...checkBoxes,
        [data.name]: {
          ...checkBoxes[data.name as TPolicyDataKey],
          checked: data.checked,
          accent: false,
        },
      });
    },
    [checkBoxes]
  );

  const updateEmail = useCallback(
    (email: string) => {
      checkEmail.current = null;

      loanStore.updateStore_Application({
        email: {
          ...(loanStore.cabinetApplication.email as TEmail),
          email,
        },
      });
    },
    [loanStore]
  );

  const onBlurHandler = useCallback(() => {
    const init = async () => {
      const requestData = {} as TConfirmData;

      if (loanStore.cabinetApplication.email) {
        requestData.email = loanStore.cabinetApplication.email;
      }

      if (loanStore.cabinetApplication.paymentTokenUnit) {
        const { paymentTokens } = loanStore.cabinetApplication.paymentTokenUnit;

        if (size(paymentTokens)) {
          requestData.paymentToken = paymentTokens[0];

          const errors = await loanStore.cabinetConfirmCheck(
            Object.assign({}, requestData, getCheckBoxesRequest())
          );

          if (size(errors)) {
            setIsDisabled(true);
            setInvalidFieldsList(errors);

            return;
          }
        }

        setInvalidFieldsList([]);
      }

      setIsDisabled(false);
    };

    init();
  }, [getCheckBoxesRequest, loanStore]);

  const onFocusHandler = useCallback(() => setInvalidFieldsList([]), []);

  const upsellButtonHandler = useCallback(() => {
    userStore.upsellStart(() => setUpsellIsDisabled(false));
    setUpsellIsDisabled(true);
  }, [userStore]);

  useEffect(() => {
    if (isUpsell) {
      setUpsellIsDisabled(!isUpsell);
    }
  }, [isUpsell]);

  useEffect(() => {
    userStore.fetchWithAuth(async () => {
      await userStore.getClientNextStep();
      await loanStore.getCabinetApplication();
      const dynamicData = await staticApi.fetchStaticData({
        block: 'loan-info-form',
        path: 'form dynamic',
      });

      pageStore.pageData = Object.assign({}, pageStore.pageData, dynamicData);
      setIsRender(true);
    });
  }, [loanStore, pageStore, userStore]);

  useEffect(() => {
    const { loanProposal } = loanStore.cabinetApplication;

    if (loanProposal) {
      const checkBoxes = reduce(
        pageStore.pageData.policy,
        (accum, item) => {
          const itemState = loanProposal[item.name as keyof TLoanProposal];

          if (!isUndefined(itemState)) {
            accum[item.name as keyof TPolicyData] = {
              checked: itemState as boolean,
              text: item.text,
            };
          }

          return accum;
        },
        {} as TPolicyData
      );

      if (size(checkBoxes)) {
        setCheckBoxes(checkBoxes);
      }
    }
  }, [loanStore.cabinetApplication, pageStore.pageData.policy]);

  useEffect(() => {
    if (isBoolean(checkEmail.current)) {
      switch (true) {
        case checkEmail.current:
          onBlurHandler();

          checkEmail.current = null;

          break;

        case Boolean(email):
          checkEmail.current = true;

          break;
      }
    }
  }, [onBlurHandler, email]);

  if (isRender) {
    return (
      <ApplicationView
        staticData={pageStore.pageData}
        model={{
          invalidFieldsList,
          isDisabled,
          checkBoxes,
          showModalWindow,
          agreeDeclarationInfo,
          email,
          showHolidayNotify,
          isSelectorRender,
          isUpsell,
          upsellIsDisabled,
        }}
        controller={{
          onChangeCheckbox,
          updateEmail,
          onBlurHandler,
          onFocusHandler,
          cabinetConfirm,
          cabinetDecline,
          closeDeclarationInfo,
          setShowModalWindow,
          setIsSelectorRender,
          upsellButtonHandler,
        }}
      />
    );
  }

  return <Preloader />;
}

export const ApplicationInstance = inject(
  STORE_IDS.PAGE_STORE,
  STORE_IDS.LOAN_STORE,
  STORE_IDS.USER_STORE
)(observer(ApplicationComponent));

function ApplicationHelper(props: any) {
  const { userStore, loanStore } = props;

  useEffect(() => {
    userStore.fetchWithAuth(async () => {
      await loanStore.getCabinetApplication();
    });
  });

  return <ApplicationInstance />;
}

export const Application = inject(
  STORE_IDS.LOAN_STORE,
  STORE_IDS.USER_STORE
)(ApplicationHelper);
