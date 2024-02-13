import React, { useCallback } from 'react';
import classNames from 'classnames';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import size from 'lodash/size';

import cfg from '@root/config.json';
import { WithDangerousHTML, WithTag } from '@components/hocs';
import { TFooterRedesignProps } from './@types';
import { GetAttachment } from '@components/GetAttachment';
import { TJSON } from '@interfaces';
import { LinkWidget, TARGET } from '@components/widgets/LinkWidget';
import Image from 'next/image';
import { WidgetRoles } from '@src/roles';

import styles from './FooterRedesign.module.scss';
import { CALLBACK_TYPE } from '@src/constants';
import { ShowBlockToDate } from '@components/hocs/ShowBlockToDate';

import staticData from './staticData.json';

export enum FOOTER_TYPE {
  LESS = 'less',
  NORMAL = 'normal',
  LOYALTY = 'loyalty',
}

/**
 * @var undefined - стандартный большой футер
 * @var 0 - футер отсутствует
 * @var 1 - футер только Копирайт
 */
export enum FOOTER_STATE {
  NO_FOOTER = 0,
  COPYRIGHT = 1,
}

function FooterRedesign(props: TFooterRedesignProps) {
  const { className, footerType = FOOTER_TYPE.NORMAL } = props;

  const { copyright, footer, tags } = (staticData as TJSON).normal;

  const renderCopyright = useCallback(() => {
    const contentData = <div>{copyright}</div>;

    if (size(tags)) {
      return (
        <div className={styles.copyright}>
          <WithTag
            tags={reduce(
              tags,
              (accum, item, index) => {
                accum[index] =
                  item.tagType == 'link' ? (
                    <LinkWidget
                      key={index}
                      id={`FooterRedesign-${item.type}-${WidgetRoles.link}`}
                      href={item.href}
                      className={styles.link}
                      target={TARGET.BLANK}
                    >
                      {item.label}
                    </LinkWidget>
                  ) : (
                    <GetAttachment
                      key={index}
                      attachmentType={item.type}
                      label={item.label}
                      className={styles.link}
                    />
                  );

                return accum;
              },
              {} as TJSON
            )}
          >
            {contentData}
          </WithTag>
        </div>
      );
    }
    return (
      <div className={styles.copyright}>
        <WithDangerousHTML>{contentData}</WithDangerousHTML>
      </div>
    );
  }, [copyright, tags]);

  const renderFooter = useCallback(() => {
    if (footerType != FOOTER_TYPE.NORMAL) {
      return;
    }

    return (
      <div className={styles.footer}>
        <div className={styles.media}>
          <div>
            <Image
              src={'/images/footer/logo-gray.svg'}
              alt={'logo-gray'}
              width={210}
              height={52}
            />
            <div className={styles.social}>
              <LinkWidget
                href={footer.socialUrl.facebook}
                target={TARGET.BLANK}
              >
                <Image
                  src={'/images/footer/facebook-icon-gray.svg'}
                  alt={'facebook-icon-gray'}
                  width={32}
                  height={32}
                />
              </LinkWidget>
              <LinkWidget
                href={footer.socialUrl.instagram}
                target={TARGET.BLANK}
              >
                <Image
                  src={'/images/footer/instagram-icon-gray.svg'}
                  alt={'instagram-icon-gray'}
                  width={32}
                  height={32}
                />
              </LinkWidget>
              <LinkWidget href={footer.socialUrl.youtube} target={TARGET.BLANK}>
                <Image
                  src={'/images/footer/youtube-icon-gray.svg'}
                  alt={'youtube-icon-gray'}
                  width={32}
                  height={32}
                />
              </LinkWidget>
            </div>
          </div>
          <div className={styles.getApp}>
            <WithDangerousHTML>
              <p>{footer.getApp.title}</p>
            </WithDangerousHTML>
            <LinkWidget
              href={`${cfg.googlePlayUrl}&referrer=utm_source%3Dsite%26utm_medium%3Dsite%26utm_campaign%3Dfooter`}
              target={TARGET.BLANK}
            >
              <Image
                src={'/images/google-play-badge.png'}
                alt={'google-play-badge'}
                width={208}
                height={69}
              />
            </LinkWidget>
            <LinkWidget
              href={`${cfg.appStoreUrl}/?utm_source=site&utm_medium=site&utm_campaign=footer`}
              target={TARGET.BLANK}
            >
              <Image
                src={'/images/app-store-badge.png'}
                alt={'app-store-badge'}
                width={208}
                height={69}
              />
            </LinkWidget>
          </div>
        </div>

        <div className={styles.contact}>
          <h3 className={styles.title}>{footer.contacts.title}</h3>
          <div className={styles.workingHours}>
            <div className={styles.content}>
              {map(footer.contacts.workingHours, (item, index) => (
                <WithDangerousHTML key={index}>
                  <div>{item}</div>
                </WithDangerousHTML>
              ))}
            </div>
          </div>
          {footer.contacts.holidayInfo.expiryDate &&
            footer.contacts.holidayInfo.workingHours && (
              <ShowBlockToDate
                expiryDate={footer.contacts.holidayInfo.expiryDate}
              >
                <div className={styles.holidayInfo}>
                  <div className={styles.content}>
                    <p className={styles.holidayInfoTitle}>
                      {footer.contacts.holidayInfo.title}
                    </p>
                    {map(
                      footer.contacts.holidayInfo.workingHours,
                      (item, index) => (
                        <WithDangerousHTML key={index}>
                          <div>{item}</div>
                        </WithDangerousHTML>
                      )
                    )}
                  </div>
                </div>
              </ShowBlockToDate>
            )}
          <div className={styles.phones}>
            <div className={styles.content}>
              {map(footer.contacts.phones, (item, index) => (
                <div key={index}>
                  {item.text && item.text}
                  {item.link && (
                    <span>
                      <LinkWidget
                        id={`FooterRedesign-${WidgetRoles.link}`}
                        href={`${CALLBACK_TYPE.phones}:${item.link}`}
                      >
                        {item.link}
                      </LinkWidget>
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className={styles.address}>
            <div className={styles.content}>
              <div>{footer.contacts.address.title}</div>
              <div>{footer.contacts.address.text}</div>
            </div>
          </div>
          <div className={styles.email}>
            <div className={styles.content}>
              <LinkWidget
                id={`FooterRedesign-${WidgetRoles.link}-email`}
                href={`${CALLBACK_TYPE.emails}:${footer.contacts.email}`}
                className={styles.link}
              >
                {footer.contacts.email}
              </LinkWidget>
            </div>
          </div>
        </div>

        <div className={styles.menu}>
          {map(footer.menu, (item, index) => (
            <div key={index}>
              {item.url && (
                <LinkWidget
                  id={`FooterRedesign-${WidgetRoles.link}`}
                  href={item.url}
                  className={styles.link}
                >
                  {item.label}
                </LinkWidget>
              )}
            </div>
          ))}
        </div>

        {/* <div className={styles.menu}>
          {map(
            footer.seoPages,
            (item, index) =>
              item.url && (
                <LinkWidget
                  key={index}
                  id={`FooterRedesign-${WidgetRoles.link}`}
                  href={item.url}
                  className={styles.link}
                >
                  {item.label}
                </LinkWidget>
              )
          )}
        </div> */}
      </div>
    );
  }, [footer, footerType]);

  return (
    <footer className={classNames(styles.container, className)}>
      {renderFooter()}
      <hr className={styles.hr} />
      {renderCopyright()}
    </footer>
  );
}

export { FooterRedesign };
