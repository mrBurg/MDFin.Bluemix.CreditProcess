import filter from 'lodash/filter';
import sortBy from 'lodash/sortBy';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import classNames from 'classnames';
import { inject } from 'mobx-react';
import { Router } from 'next/router';

import style from './MobileMenu.module.scss';

import Hamburger from '@components/MainMenu/icons/hamburger.svg';
import Close from '@components/MainMenu/icons/close.svg';

import { EVENT } from '@src/constants';
import { WidgetRoles } from '@src/roles';
import { Logo } from '@components/Logo';
import { mainMenu } from '@routes';
import { TRouter } from '@src/routes/@types';
import { gt, stopScroll } from '@utils';
import { ActionButtons } from '../ActionButtons';
import { HeaderCtx } from '@components/Header/HeaderDefault';
import { STORE_IDS } from '@stores';
import { TMobileMenuProps, TMobileMenuPropsStore } from './@types';
import { LinkWidget } from '@components/widgets/LinkWidget';
import { ButtonWidget, BUTTON_TYPE } from '@components/widgets/ButtonWidget';
import { LocaleProviderCtx } from '@context/LocaleProvider';

export function MobileMenuComponent(props: TMobileMenuProps) {
  const { userStore } = props as TMobileMenuPropsStore;

  useContext(LocaleProviderCtx);
  const { less } = useContext(HeaderCtx);

  const [isOpened, setIsOpened] = useState(false);

  const renderTopMenu = useCallback(() => {
    if (less) {
      return (
        <div className={classNames(style.mobile, style.mobileShort)}>
          <Logo className={classNames(style.logo)} />
        </div>
      );
    }

    return (
      <div className={style.mobile}>
        <ButtonWidget
          id={`Menu-${WidgetRoles.button}`}
          type={BUTTON_TYPE.BUTTON}
          className={style.hamburger}
          onClick={() => setIsOpened(true)}
          aria-label="Menu"
        >
          <Hamburger />
        </ButtonWidget>

        <Logo className={classNames(style.logo)} />
        <ActionButtons />
      </div>
    );
  }, [less]);

  const renderDesiredAction = useCallback(() => {
    if (userStore.userLoggedIn) {
      return (
        <ButtonWidget
          className={style.logout}
          type={BUTTON_TYPE.BUTTON}
          onClick={() => userStore.logOut()}
        >
          {gt.gettext('Logout')}
        </ButtonWidget>
      );
    }

    return filter(mainMenu, (item) => !!item.button).map((item, key) => (
      <LinkWidget
        key={key}
        id={`MainMenu-${WidgetRoles.link}`}
        href={item.href}
        className={style.link}
      >
        {gt.gettext(item.title)}
      </LinkWidget>
    ));
  }, [userStore]);

  const renderDropdownMenu = useCallback(
    () =>
      isOpened && (
        <div className={style.dropdown}>
          <div className={style.mobile}>
            <ButtonWidget
              type={BUTTON_TYPE.BUTTON}
              className={style.hamburger}
              onClick={() => setIsOpened(false)}
            >
              <Close />
            </ButtonWidget>
            <Logo className={classNames(style.logo)} />
            <div className={style.dummy} />
          </div>
          <div className={style.substrate}>
            <nav className={style.nav}>
              {sortBy(mainMenu, (item) => item.index)
                .filter((item) => !item.button)
                .map((item: TRouter, key: number) => (
                  <LinkWidget
                    key={key}
                    id={`MainMenu-${WidgetRoles.link}`}
                    href={item.href}
                    className={style.link}
                  >
                    {gt.gettext(item.title)}
                  </LinkWidget>
                ))}

              {renderDesiredAction()}
            </nav>
          </div>
        </div>
      ),
    [isOpened, renderDesiredAction]
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

export const MobileMenu = inject(STORE_IDS.USER_STORE)(MobileMenuComponent);
