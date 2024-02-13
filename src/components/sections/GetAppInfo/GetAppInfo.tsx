import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import cfg from '@root/config.json';
import { TGetAppInfoProps } from './@types';
import style from './GetAppInfo.module.scss';
import { LinkWidget, TARGET } from '@components/widgets/LinkWidget';

function GetAppInfo(props: TGetAppInfoProps) {
  const [notApp, setNotApp] = useState(false);
  useEffect(() => {
    setNotApp(
      !~navigator.userAgent
        .toLowerCase()
        .search(new RegExp('appname/1.0|iosappname/1.0', 'g'))
    );
  }, []);

  if (notApp) {
    return (
      <section className={style.section}>
        <div className={style.content}>
          <div className={style.background}>
            <div className={style.qrcodeWrap}>
              <div className={style.qrcode}>
                <Image
                  src={'/images/main-page/get-app-info/qrcode.png'}
                  alt={'qrcode'}
                  width={208}
                  height={208}
                />
              </div>
            </div>
            <div className={style.infoWrap}>
              <div className={style.text}>
                <p className={style.title}>{props.title}</p>
                <p className={style.subTitle}>{props.subTitle}</p>
              </div>
              <div className={style.buttonsWrap}>
                <LinkWidget
                  href={`${cfg.googlePlayUrl}&referrer=utm_source%3Dsite%26utm_medium%3Dsite%26utm_campaign%3Dpage`}
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
                  href={`${cfg.appStoreUrl}/?utm_source=site&utm_medium=site&utm_campaign=page`}
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
          </div>
        </div>
      </section>
    );
  }
  return null;
}

export { GetAppInfo };
