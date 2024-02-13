import { LayoutCtx } from '@components/Layout';
import { ModalWindow } from '@components/popup';
import { MODAL_TYPE } from '@components/popup/ModalWindow/ModalWindow';
import { STORE_IDS } from '@stores';
import size from 'lodash/size';
import { inject, observer } from 'mobx-react';
import React, { useContext, useEffect, useState } from 'react';
import { TRejectNotify, TRejectNotifyStores } from './@types';
import cfg from '@root/config.json';

function RejectNotifyComponent(props: TRejectNotify) {
  const { loanStore, userStore } = props as TRejectNotifyStores;

  const { setBlur } = useContext(LayoutCtx);

  /**Нотификация отказа Транша*/
  const [showNotification, setShowNotification] = useState(false);
  const [startResend, setStartResend] = useState(false);
  /**Конец Нотификации отказа Транша*/

  useEffect(() => {
    const sendResponse = async () => {
      /**Проверка на ответ сервиса нотификации*/
      if (loanStore.cabinetNotify && size(loanStore.cabinetNotify)) {
        /**Подтверждения показания нотификации */
        loanStore.confirmDisplay();

        setShowNotification(true);
        setBlur(true);
      } else {
        /**Переотправлять запрос для получения нотификации */
        const resendResponce = setTimeout(() => {
          loanStore.getNotify(() => setStartResend(!startResend));
        }, cfg.documentResend);

        return () => {
          clearTimeout(resendResponce);
        };
      }
    };

    sendResponse();
  }, [loanStore, setBlur, startResend]);
  return (
    <>
      {showNotification && !!size(loanStore.cabinetNotify) && (
        <ModalWindow
          type={MODAL_TYPE.TRANSPARENT}
          textData={
            loanStore.cabinetNotify.map((item) => item.text) as string[]
          }
          declineHandler={() => {
            setShowNotification(false);
            userStore.getClientNextStep(() => setBlur(false));
          }}
        />
      )}
    </>
  );
}

export const RejectNotify = inject(
  STORE_IDS.LOAN_STORE,
  STORE_IDS.USER_STORE
)(observer(RejectNotifyComponent));
