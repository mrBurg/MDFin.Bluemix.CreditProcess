import filter from 'lodash/filter';
import map from 'lodash/map';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import classNames from 'classnames';
import { inject } from 'mobx-react';
import { Router } from 'next/router';
import Image from 'next/image';

import { gt, stopScroll } from '@utils';
import cfg from '@root/config.json';

import style from './MobileMenuRedesign.module.scss';

import Hamburger from '@components/MainMenuRedesign/icons/hamburger.svg';
import Close from '@components/MainMenuRedesign/icons/close.svg';

import { CALLBACK_TYPE, EVENT } from '@src/constants';
import { WidgetRoles } from '@src/roles';
import { Logo } from '@components/Logo';
import { cabinetMenu, mainMenu } from '@routes';
import { TRouter } from '@src/routes/@types';
import { ActionButtonsRedesign } from '../ActionButtonsRedesign';
import { LayoutProviderCtx } from '@context/LayoutProvider';
import { STORE_IDS } from '@stores';
import { TMobileMenuProps, TMobileMenuPropsStore } from './@types';
import { LinkWidget, TARGET } from '@components/widgets/LinkWidget';
import { ButtonWidget, BUTTON_TYPE } from '@components/widgets/ButtonWidget';

export function MobileMenuRedesignComponent(props: TMobileMenuProps) {
  const { userStore } = props as TMobileMenuPropsStore;

  const { headerLess } = useContext(LayoutProviderCtx);

  const [isOpened, setIsOpened] = useState(false);

  const renderTopMenu = useCallback(() => {
    if (headerLess) {
      return (
        <div className={classNames(style.mobile, style.mobileShort)}>
          <Logo className={classNames(style.logo)} />
        </div>
      );
    }

    return (
      <div className={style.mobile}>
        <Logo className={classNames(style.logo)} />

        <div className={style.buttons}>
          <ActionButtonsRedesign />

          <ButtonWidget
            id={`MenuRedesign-${WidgetRoles.button}`}
            type={BUTTON_TYPE.BUTTON}
            className={style.hamburger}
            onClick={() => setIsOpened(true)}
            aria-label="Menu"
          >
            <Hamburger />
          </ButtonWidget>
        </div>
      </div>
    );
  }, [headerLess]);

  const renderClientName = useCallback(() => {
    if (
      userStore.userLoggedIn &&
      userStore.userFirstName &&
      userStore.userLastName
    ) {
      return (
        <div className={style.clientName}>
          <Image
            src={'/images/header/user-icon.svg'}
            width={24}
            height={24}
            alt="sign-in-alt-icon"
          />
          <span className={style.title}>
            {gt.gettext(`${userStore.userFirstName} ${userStore.userLastName}`)}
          </span>
        </div>
      );
    }
  }, [userStore.userFirstName, userStore.userLastName, userStore.userLoggedIn]);

  const renderCabinetMenu = useCallback(() => {
    if (userStore.userLoggedIn) {
      return (
        <>
          {map(cabinetMenu, (item: TRouter, key: number) => (
            <div className={style.cabinetMenuItem} key={key}>
              <Image
                src={`/images/header/${item.iconName}`}
                width={16}
                height={16}
                alt={item.iconName}
              />
              <LinkWidget
                href={item.href}
                className={style.cabinetMenuLink}
                aria-label={gt.gettext(item.title)}
              >
                {gt.gettext(item.title)}
              </LinkWidget>
            </div>
          ))}
          <div className={style.cabinetMenuItem}>
            <Image
              src={`/images/header/sign-out-alt-icon.svg`}
              width={16}
              height={16}
              alt={'sign-out-alt-icon'}
            />
            <ButtonWidget
              className={style.cabinetMenuButton}
              type={BUTTON_TYPE.BUTTON}
              onClick={() => userStore.logOut()}
            >
              {gt.gettext('Logout')}
            </ButtonWidget>
          </div>
          <hr />
        </>
      );
    }
  }, [userStore]);

  const renderContactSocial = useCallback(() => {
    return (
      <div className={style.contactSocial}>
        <div className={style.phoneWrap}>
          <Image
            src={'/images/header/contact-info-icon.svg'}
            width={24}
            height={24}
            alt="contact-info-icon"
          />
          <LinkWidget
            id={`ContactInfo-${WidgetRoles.link}`}
            href={`${CALLBACK_TYPE.phones}:${gt.gettext('hotlinePhone')}`}
            className={style.phone}
          >
            {gt.gettext('hotlinePhone')}
          </LinkWidget>
        </div>
        <div className={style.appWrap}>
          <LinkWidget
            href={`${cfg.googlePlayUrl}&referrer=utm_source%3Dsite%26utm_medium%3Dsite%26utm_campaign%3Dheader`}
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
            href={`${cfg.appStoreUrl}/?utm_source=site&utm_medium=site&utm_campaign=header`}
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
        <div className={style.socialWrap}>
          <LinkWidget href={gt.gettext('facebookUrl')} target={TARGET.BLANK}>
            <Image
              src={'/theme/icons/facebook-yellow-icon.svg'}
              width={32}
              height={32}
              alt={'facebook-yellow-icon'}
            />
          </LinkWidget>

          <LinkWidget href={gt.gettext('instagramUrl')} target={TARGET.BLANK}>
            <Image
              src={'/theme/icons/instagram-yellow-icon.svg'}
              width={32}
              height={32}
              alt={'instagram-yellow-icon'}
            />
          </LinkWidget>

          <LinkWidget href={gt.gettext('youtubeUrl')} target={TARGET.BLANK}>
            <Image
              src={'/theme/icons/youtube-yellow-icon.svg'}
              width={32}
              height={32}
              alt={'youtube-yellow-icon'}
            />
          </LinkWidget>
        </div>
      </div>
    );
  }, []);

  const renderDropdownMenu = useCallback(
    () =>
      isOpened && (
        <div className={style.dropdown}>
          <div className={style.mobile}>
            <Logo className={classNames(style.logo)} />

            <div className={style.buttons}>
              <ActionButtonsRedesign />
              <ButtonWidget
                type={BUTTON_TYPE.BUTTON}
                className={style.hamburger}
                onClick={() => setIsOpened(false)}
              >
                <Close />
              </ButtonWidget>
            </div>
          </div>
          <div className={style.substrate}>
            {renderClientName()}

            <nav className={style.nav}>
              {renderCabinetMenu()}

              {filter(mainMenu, (item) => !item.button).map(
                (item: TRouter, key: number) => (
                  <LinkWidget
                    key={key}
                    id={`MainMenuRedesign-${WidgetRoles.link}`}
                    href={item.href}
                    className={style.link}
                  >
                    {gt.gettext(item.title)}
                  </LinkWidget>
                )
              )}

              {renderContactSocial()}
            </nav>
          </div>
        </div>
      ),
    [isOpened, renderCabinetMenu, renderClientName, renderContactSocial]
  );

  useEffect(
    () => Router.events.on(EVENT.CHANGE_COMPLETE, () => setIsOpened(false)),
    []
  );

  useEffect(() => stopScroll(isOpened), [isOpened]);

  return (
    <>
      {renderTopMenu()}
      {renderDropdownMenu()}
    </>
  );
}

export const MobileMenuRedesign = inject(STORE_IDS.USER_STORE)(
  MobileMenuRedesignComponent
);
