import React, { useCallback, useEffect, useRef, useState } from 'react';
import size from 'lodash/size';
import Image from 'next/image';

import style from './AppBanner.module.scss';

import { staticApi } from '@stores';
import { TJSON } from '@interfaces';
import { root, setCookie } from '@utils';
import { COOKIE, EVENT, LINK_RELATION } from '@src/constants';
import { LinkWidget, TARGET } from '@components/widgets/LinkWidget';
import cfg from '@root/config.json';
import classNames from 'classnames';

function AppBanner() {
  const [staticData, setStaticData] = useState({} as TJSON);
  const [isRender, setIsRender] = useState(true);

  const bannerRef = useRef<HTMLDivElement>(null);

  const [hide, setHide] = useState(Boolean(root().scrollY));

  useEffect(() => {
    const onScroll = () => setHide(Boolean(window.scrollY));
    window.addEventListener(EVENT.SCROLL, onScroll);

    return () => window.removeEventListener(EVENT.SCROLL, onScroll);
  }, []);

  /** Get static data */
  useEffect(() => {
    const init = async () => {
      const pageData = await staticApi.fetchStaticData({
        block: 'app-banner',
        path: 'static',
      });

      setStaticData(pageData);
    };

    init();
  }, []);

  /** Close banner button function */
  const bannerClose = useCallback(() => {
    setCookie(COOKIE.APP_BANNER, 1);
    setIsRender(false);
  }, []);

  /** Render component */
  if (size(staticData) && isRender) {
    return (
      <div
        className={classNames(style.container, {
          [style.hide]: hide,
        })}
        ref={bannerRef}
      >
        <div className={style.boxClose}>
          <button className={style.close} onClick={bannerClose}>
            ×
          </button>
        </div>
        {/* <img
          src="/theme/icons/logo_hora.png"
          className={style.logo}
          alt="logo"
        /> */}
        <Image
          src={'/theme/icons/logo_hora.png'}
          alt="Logo"
          width={53}
          height={53}
        />
        <div className={style.boxText}>
          <p className={style.textTitle}>{staticData.title}</p>
          <p className={style.text}>{staticData.text}</p>
        </div>
        <div className={style.boxButton}>
          <LinkWidget
            className={style.button}
            href={cfg.googlePlayUrl}
            target={TARGET.BLANK}
            rel={[LINK_RELATION.NOOPENER, LINK_RELATION.NOREFERRER].join(' ')}
          >
            {staticData.button}
          </LinkWidget>
        </div>
      </div>
    );
  }

  return null;
}

export { AppBanner };
