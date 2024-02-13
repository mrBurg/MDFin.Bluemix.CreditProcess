import React, { useCallback, useMemo } from 'react';
import classNames from 'classnames';
import isArray from 'lodash/isArray';
import map from 'lodash/map';

import Image from 'next/image';

import style from './Contacts.module.scss';

import { WithDangerousHTML } from '@components/hocs';
import { TJSON } from '@interfaces';
import { CALLBACK_TYPE } from '@src/constants';
import { WidgetRoles } from '@src/roles';
import { TContactsProps, TListItem } from './@types';
import { ShowBlockToDate } from '@components/hocs/ShowBlockToDate';
import { LinkWidget } from '@components/widgets/LinkWidget';

function Contacts(props: TContactsProps) {
  const {
    phones,
    addresses,
    emails,
    pageTitle,
    showTitle = true,
    holidayInfo,
  } = props;

  const sections = useMemo(
    () => ({
      phones,
      addresses,
      emails,
    }),
    [addresses, emails, phones]
  );

  const renderTitle = useCallback((data: any) => {
    let title = data.title;

    if (isArray(title)) {
      title = title.join('');
    }

    return (
      <WithDangerousHTML>
        <div className={style.blockTitle}>{title}</div>
      </WithDangerousHTML>
    );
  }, []);
  const renderHolidays = useCallback(() => {
    if (holidayInfo?.expiryDate && holidayInfo?.workingHours) {
      return (
        <ShowBlockToDate expiryDate={holidayInfo.expiryDate}>
          <div className={style.holidayInfo}>
            <p className={style.holidayInfoTitle}>{holidayInfo.title}</p>
            {map(holidayInfo.workingHours, (item, index) => (
              <WithDangerousHTML key={index}>
                <div>{item}</div>
              </WithDangerousHTML>
            ))}
          </div>
        </ShowBlockToDate>
      );
    }
  }, [holidayInfo]);

  return (
    <section className={style.section}>
      <div className={style.content}>
        {showTitle && <h2 className={style.title}>{pageTitle}</h2>}
        <div className={style.contactsContent}>
          {map(sections, (itemType, itemKey) => {
            const type: string = (CALLBACK_TYPE as TJSON)[itemKey];

            let iconName = 'default';
            switch (itemKey) {
              case 'phones':
                iconName = 'phone-icon.svg';
                break;
              case 'addresses':
                iconName = 'location-icon.svg';
                break;
              case 'emails':
                iconName = 'email-icon.svg';
                break;
              default:
                break;
            }

            return (
              <section key={itemKey} className={style.block}>
                <div className={style.icon}>
                  <Image
                    src={`/images/main-page/contacts/${iconName}`}
                    width={77}
                    height={77}
                    alt={iconName}
                  />
                </div>

                <div className={style.blockContent}>
                  {renderTitle(itemType)}
                  {itemKey == 'phones' && renderHolidays()}
                  <ul className={style.list}>
                    {map(itemType.list, (item: TListItem, index: number) => (
                      <li
                        key={index}
                        className={classNames(style.blockSubTitle)}
                      >
                        {item.text && <span>{item.text}</span>}
                        {item.link && (
                          <span className={'nowrap'}>
                            <LinkWidget
                              id={`Contacts-${WidgetRoles.link}`}
                              href={type ? `${type}:${item.link}` : item.link}
                              className={style.link}
                            >
                              {item.link}
                            </LinkWidget>
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export { Contacts };
