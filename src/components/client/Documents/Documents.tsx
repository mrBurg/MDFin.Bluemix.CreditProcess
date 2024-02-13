import React, { useCallback, useEffect } from 'react';
import { observer } from 'mobx-react';
import map from 'lodash/map';

import style from './Documents.module.scss';

import { TDocumentsProps, TDocumentsPropsStore } from './@types';
import { TDocumentUnit } from '@stores-types/loanStore';
import { Attachments } from '@components/Attachments';
import { CLIENT_TABS, FLOW } from '@src/constants';
import { ClientTabs } from '../ClientTabs';
import { ReloadButtonWidget } from '@components/widgets/ReloadButtonWidget';
import { WithPageContainer } from '@components/hocs/WithPageContainer';
import { ServiceMessage } from '@components/ServiceMessage';

function DocumentsComponent(props: TDocumentsProps) {
  const { userStore, loanStore } = props as TDocumentsPropsStore;

  const onReloadHandler = useCallback(
    (callback: any) => userStore.getClientNextStep(callback),
    [userStore]
  );

  const renderTabs = useCallback(() => {
    if (loanStore.cabinetApplication.flow == FLOW.WIZARD) {
      return (
        <div className={style.tabs}>
          <ClientTabs current={CLIENT_TABS.DOCUMENTS} />
        </div>
      );
    }
  }, [loanStore.cabinetApplication.flow]);

  useEffect(() => {
    userStore.fetchWithAuth(async () => {
      await userStore.getClientNextStep();
      await loanStore.getCabinetApplication();
      loanStore.initAttachmentsForm();
    });
  }, [loanStore, userStore]);

  if (loanStore) {
    const { attachmentsFormStatic, cabinetApplication } = loanStore;

    if (attachmentsFormStatic && cabinetApplication.documentUnits) {
      return (
        <>
          <ServiceMessage className={style.serviceMessage} isCabinet={true} />
          {renderTabs()}
          <WithPageContainer>
            <div className={style.documents}>
              <div className={style.attachments}>
                <h2 className={style.title}>{attachmentsFormStatic.title}</h2>
                {map(
                  cabinetApplication.documentUnits,
                  (item: TDocumentUnit, key) => (
                    <Attachments
                      key={key}
                      locales={attachmentsFormStatic}
                      {...item}
                    />
                  )
                )}
              </div>
            </div>
            <ReloadButtonWidget
              reloadHandler={onReloadHandler}
              className={style.buttonWrap}
            />
          </WithPageContainer>
        </>
      );
    }
  }

  return null;
}

export const Documents = observer(DocumentsComponent);
