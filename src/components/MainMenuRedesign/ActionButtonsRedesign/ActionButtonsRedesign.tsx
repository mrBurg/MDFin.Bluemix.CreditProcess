import React, { useCallback, useEffect, useRef, useState } from 'react';
import { inject, observer } from 'mobx-react';
import Image from 'next/image';
import filter from 'lodash/filter';
import map from 'lodash/map';

import { STORE_IDS } from '@stores';
import { gt, isDevice } from '@utils';
import { EVENT } from '@src/constants';
import { cabinetMenu, mainMenu } from '@routes';
import { TRouter } from '@src/routes/@types';
import { LinkWidget } from '@components/widgets/LinkWidget';
import { ButtonWidget, BUTTON_TYPE } from '@components/widgets/ButtonWidget';
import {
  TActionButtons,
  TActionButtonsStore,
} from '../ActionButtonsRedesign/@types';
import style from './ActionButtonsRedesign.module.scss';

function ActionButtonsRedesignComponent(props: TActionButtons) {
  const { userStore } = props as TActionButtonsStore;

  const [isMobile, setIsMobile] = useState(isDevice());
  const [clientMenu, setClientMenu] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);

  const renderTitle = useCallback(
    (title: string) => <span className={style.title}>{gt.gettext(title)}</span>,
    []
  );

  const closeMenu = useCallback((event: any) => {
    event.stopPropagation();
    setClientMenu(false);
  }, []);

  const renderClientMenu = useCallback(() => {
    return (
      <ul className={style.clientMenu} onClick={closeMenu} aria-hidden>
        {map(cabinetMenu, (item: TRouter, key: number) => (
          <li className={style.clientMenuItem} key={key}>
            <Image
              src={`/images/header/${item.iconName}`}
              width={16}
              height={16}
              alt={item.iconName}
            />
            <LinkWidget
              href={item.href}
              className={style.clientMenuLink}
              aria-label={gt.gettext(item.title)}
            >
              {gt.gettext(item.title)}
            </LinkWidget>
          </li>
        ))}

        <li className={style.clientMenuItem}>
          <Image
            src={`/images/header/sign-out-alt-icon.svg`}
            width={16}
            height={16}
            alt={'sign-out-alt-icon'}
          />
          <ButtonWidget
            className={style.clientMenuButton}
            type={BUTTON_TYPE.BUTTON}
            onClick={() => userStore.logOut()}
          >
            {gt.gettext('Logout')}
          </ButtonWidget>
        </li>
      </ul>
    );
  }, [closeMenu, userStore]);

  const renderContent = useCallback(() => {
    return filter(mainMenu, (item) => !!item.button).map((item, index) => {
      if (
        userStore.userLoggedIn &&
        userStore.userFirstName &&
        userStore.userLastName
      ) {
        if (isMobile) {
          return null;
        }
        return (
          <div key={index} className={style.actions}>
            <ButtonWidget
              className={style.signOut}
              type={BUTTON_TYPE.BUTTON}
              ref={buttonRef}
              aria-label="User menu"
            >
              <Image
                src={'/images/header/user-icon.svg'}
                width={24}
                height={24}
                alt="sign-in-alt-icon"
              />
              {renderTitle(
                `${userStore.userFirstName} ${userStore.userLastName}`
              )}
            </ButtonWidget>
            {clientMenu && (
              <div className={style.clientMenuHolder}>{renderClientMenu()}</div>
            )}
          </div>
        );
      } else {
        return (
          <LinkWidget
            key={index}
            href={item.href}
            className={style.signIn}
            aria-label={gt.gettext(item.title)}
          >
            {
              <>
                {renderTitle(item.title)}
                <div className={style.image}>
                  <Image
                    src={'/images/header/sign-in-alt-icon.svg'}
                    width={24}
                    height={24}
                    alt="sign-in-alt-icon"
                  />
                </div>
              </>
            }
          </LinkWidget>
        );
      }
    });
  }, [
    clientMenu,
    isMobile,
    renderClientMenu,
    renderTitle,
    userStore.userFirstName,
    userStore.userLastName,
    userStore.userLoggedIn,
  ]);

  useEffect(() => {
    const buttonClick = (event: MouseEvent) => {
      setClientMenu(event.target == buttonRef.current);
    };

    document.addEventListener(EVENT.CLICK, buttonClick);

    return () => document.removeEventListener(EVENT.CLICK, buttonClick);
  }, []);

  useEffect(() => {
    const detectDeviceType = () => {
      setIsMobile(isDevice());
    };
    window.addEventListener(EVENT.RESIZE, detectDeviceType);
    return () => window.removeEventListener(EVENT.RESIZE, detectDeviceType);
  }, []);

  return <>{renderContent()}</>;
}

export const ActionButtonsRedesign = inject(STORE_IDS.USER_STORE)(
  observer(ActionButtonsRedesignComponent)
);
