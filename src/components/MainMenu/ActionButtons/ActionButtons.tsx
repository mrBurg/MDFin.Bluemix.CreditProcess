import filter from 'lodash/filter';
import map from 'lodash/map';
import { inject, observer } from 'mobx-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import style from './ActionButtons.module.scss';

import SignInIcon from './../icons/sign-in-icon.svg';
import UserIcon from './../icons/user.svg';

import { EVENT } from '@src/constants';
import { STORE_IDS } from '@stores';
import { cabinetMenu, mainMenu } from '@routes';
import { TRouter } from '@src/routes/@types';
import { gt, isDevice } from '@utils';
import { TActionButtons, TActionButtonsStore } from '../ActionButtons/@types';
import { LinkWidget } from '@components/widgets/LinkWidget';
import { ButtonWidget, BUTTON_TYPE } from '@components/widgets/ButtonWidget';

function ActionButtonsComponent(props: TActionButtons) {
  const { userStore } = props as TActionButtonsStore;

  const [showTitle, setShowTitle] = useState(!isDevice());
  const [clientMenu, setClientMenu] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);

  const renderTitle = useCallback(
    (title: string) =>
      showTitle && <span className={style.title}>{gt.gettext(title)}</span>,
    [showTitle]
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
            <LinkWidget
              href={item.href}
              className={style.clientMenuLink}
              aria-label={gt.gettext(item.title)}
            >
              {gt.gettext(item.title)}
            </LinkWidget>
          </li>
        ))}

        <li>
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

  useEffect(() => {
    const buttonClick = (event: MouseEvent) => {
      setClientMenu(event.target == buttonRef.current);
    };

    document.addEventListener(EVENT.CLICK, buttonClick);

    return () => document.removeEventListener(EVENT.CLICK, buttonClick);
  }, []);

  useEffect(() => {
    const detectDeviceType = () => {
      setShowTitle(!isDevice());
    };

    window.addEventListener(EVENT.RESIZE, detectDeviceType);

    return () => window.removeEventListener(EVENT.RESIZE, detectDeviceType);
  }, []);

  return (
    <>
      {filter(mainMenu, (item) => !!item.button).map((item, index) =>
        userStore.userLoggedIn &&
        userStore.userFirstName &&
        userStore.userLastName ? (
          <div key={index} className={style.actions}>
            <ButtonWidget
              className={style.signOut}
              type={BUTTON_TYPE.BUTTON}
              ref={buttonRef}
              aria-label="User menu"
            >
              {renderTitle(
                `${userStore.userFirstName} ${userStore.userLastName}`
              )}
              <UserIcon />
            </ButtonWidget>
            {clientMenu && (
              <div className={style.clientMenuHolder}>{renderClientMenu()}</div>
            )}
          </div>
        ) : (
          <LinkWidget
            key={index}
            href={item.href}
            className={style.signIn}
            aria-label="Sign In"
          >
            {
              <>
                {renderTitle(item.title)}
                <SignInIcon />
              </>
            }
          </LinkWidget>
        )
      )}
    </>
  );
}

export const ActionButtons = inject(STORE_IDS.USER_STORE)(
  observer(ActionButtonsComponent)
);
