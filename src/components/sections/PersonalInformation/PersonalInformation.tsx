import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import concat from 'lodash/concat';
import map from 'lodash/map';
import size from 'lodash/size';

import style from './PersonalInformation.module.scss';

import { STORE_IDS } from '@stores';
import { DataTableGridWidget } from '@components/widgets/DataTableGridWidget';
import {
  TExpiredDocData,
  TPersonalInformation,
  TPersonalInformationStore,
} from './@types';
import { handleErrors } from '@src/utils/handleErrors';
import { TDataTableGridItem } from '@components/widgets/DataTableGridWidget/@types';
import { Preloader } from '@components/Preloader';
import { LinkWidget, TARGET } from '@components/widgets/LinkWidget';
import { MessagePreview } from '@components/popup/MessagePreview';
import { CHANNEL, TContentData } from '@components/popup/MessagePreview/@types';
import { ButtonWidget, BUTTON_LAYOUT } from '@components/widgets/ButtonWidget';

function PersonalInformationComponent(props: TPersonalInformation) {
  const { loanStore, userStore, staticData } =
    props as TPersonalInformationStore;

  const [isRender, setIsRender] = useState(false);
  const [data, setData] = useState<TDataTableGridItem[]>([]);
  const [expiredDocData, setExpiredDocData] = useState({} as TExpiredDocData);
  const [modalWindow, setModalWindow] = useState(false);

  useEffect(() => {
    const prepareData = () => {
      const dynamicData = loanStore.cabinetClientInfo;

      const {
        clientInfo,
        contacts,
        accounts,
        archiveLoanData,
        expiredDocument,
      } = staticData;

      const preparedData: TDataTableGridItem[] = [
        {
          title: clientInfo.title,
          itemData: [
            {
              label: clientInfo.lastName,
              value: dynamicData.lastName,
            },
            { label: clientInfo.firstName, value: dynamicData.firstName },
            { label: clientInfo.pin, value: dynamicData.pin },
            { label: clientInfo.passport, value: dynamicData.passport },
            {
              label: clientInfo.birthDate,
              value: moment(dynamicData.birthDate).format('DD.MM.YYYY'),
            },
            {
              label: clientInfo.expireDate,
              value: moment(dynamicData.expireDate).format('DD.MM.YYYY'),
            },
          ],
        },
        {
          title: contacts.title,
          itemData: concat(
            map(dynamicData.phones, (phoneItem) => ({
              label: contacts.phone[`type${phoneItem.type_id}`],
              value: phoneItem.phoneNumber,
            })),
            map(dynamicData.emails, (emailItem: string) => ({
              label: contacts.email,
              value: emailItem,
            })),
            map(dynamicData.addresses, (addressItem) => ({
              label: contacts.address,
              value: addressItem,
            }))
          ),
        },
        {
          title: accounts.title,
          itemData: map(dynamicData.accounts, (accountItem) => ({
            label: accountItem.bankName && accountItem.bankName.concat(':'),
            value: accountItem.accnum,
          })),
        },
      ];

      if (size(dynamicData.dealDocumentsList)) {
        preparedData.push({
          title: archiveLoanData.title,
          itemData: map(dynamicData.dealDocumentsList, (documentItem) => ({
            label: `${documentItem.dealNo} ${documentItem.dealDate}`,
            value: (
              <ul className={style.archiveLoanData}>
                {map(documentItem.documentUnits, (item, index) => (
                  <li key={index}>
                    {map(item.documents, (document, index) => (
                      <LinkWidget
                        key={index}
                        href={document.url}
                        target={TARGET.BLANK}
                      >
                        {document.filename}
                      </LinkWidget>
                    ))}
                  </li>
                ))}
              </ul>
            ),
          })),
        });
      }

      if (dynamicData.expiredDocument && expiredDocument) {
        preparedData.push({
          title: expiredDocument.title,
          itemData: [
            {
              label: `${dynamicData.expiredDocument.dealno} ${moment
                .parseZone(dynamicData.expiredDocument.created)
                .format('DD.MM.YYYY HH:mm:ss')}`,
              value: (
                <ButtonWidget
                  buttonLayout={BUTTON_LAYOUT.INLINE}
                  className={style.linkBtn}
                  onClick={() => setModalWindow(true)}
                >
                  {
                    expiredDocument[
                      `${dynamicData.expiredDocument.channel}ExpiredDocLabel`
                    ]
                  }
                </ButtonWidget>
              ),
            },
          ],
        });

        setExpiredDocData({
          ...dynamicData.expiredDocument,
        });
      }

      setData(preparedData);
      setIsRender(true);
    };

    userStore.fetchWithAuth(() => {
      if (userStore.userLoggedIn) {
        return loanStore
          .getCabinetClientInfo(true)
          .then(() => prepareData())
          .catch((err) => handleErrors(err));
      }

      userStore.getClientNextStep();
    });
  }, [loanStore, staticData, userStore, userStore.userLoggedIn]);

  if (isRender) {
    return (
      <>
        <DataTableGridWidget data={data} />
        {modalWindow && (
          <MessagePreview
            type={expiredDocData.channel as CHANNEL}
            contentData={expiredDocData as TContentData}
            declineHandler={() => setModalWindow(false)}
          />
        )}
      </>
    );
  }

  return <Preloader />;
}

export const PersonalInformation = inject(
  STORE_IDS.LOAN_STORE,
  STORE_IDS.USER_STORE
)(observer(PersonalInformationComponent));
