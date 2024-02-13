import React, {
  MouseEvent,
  useCallback,
  useEffect,
  useState,
  useRef,
  ReactElement,
} from 'react';
import classNames from 'classnames';
import { inject } from 'mobx-react';
import axios from 'axios';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
// import { BrowserView } from 'react-device-detect';
import { useRouter } from 'next/router';

import style from './DeveloperMenu.module.scss';

import { allRoutes, URIS } from '@routes';
import { TRouter } from '@src/routes/@types';
import { STORE_IDS } from '@stores';
import {
  makeStaticUri,
  handleErrors,
  getUrlSlug,
  getFromLocalStorage,
  getMD5,
  clearLocalStorage,
  clearCookie,
} from '@utils';
import { TDeveloperMenuProps, TDeveloperMenuPropsStore } from './@types';
import { BUTTON_TYPE } from '@components/widgets/ButtonWidget';
import { LanguagesSwitcher } from '../LanguagesSwitcher';
import { FINGER_PRINT_KEY, REFRESH_TOKEN_KEY } from '@src/constants';

function DeveloperMenuComponent(props: TDeveloperMenuProps) {
  const { userStore } = props as unknown as TDeveloperMenuPropsStore;

  const router = useRouter();

  const menuRef = useRef<HTMLDivElement>(null);

  const [float, setFloat] = useState(false);
  const [devMenu, setDevMenu] = useState<ReactElement | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const updateStatic = useCallback(async () => {
    try {
      await axios.get(makeStaticUri(URIS.CLEAR_CACHE));
      await axios.get(makeStaticUri(URIS.CLEAR_CONFIG_CACHE));

      router.reload();
    } catch (err) {
      handleErrors(err);
    }
  }, [router]);

  const logout = useCallback(async () => {
    const fingerprint = getFromLocalStorage(FINGER_PRINT_KEY);
    const refreshToken = getFromLocalStorage(getMD5(REFRESH_TOKEN_KEY));

    if (fingerprint && refreshToken) {
      await userStore.logOut();
    }

    clearLocalStorage();
    clearCookie();
    window.location.reload();
  }, [userStore]);

  const renderContent = useCallback(
    () => (
      <div
        ref={menuRef}
        className={classNames(style.developerMenu, {
          [style.scrolled]: scrolled,
        })}
        onDoubleClick={() => setDevMenu(null)}
        onContextMenu={(event: MouseEvent<HTMLDivElement>) => {
          event.preventDefault();

          setFloat(!float);

          if (menuRef && menuRef.current) {
            menuRef.current.style.right = float ? '0' : 'auto';
          }
        }}
        onMouseUp={(event: MouseEvent<HTMLDivElement>) =>
          event.button == 1 && setDevMenu(null)
        }
        onMouseEnter={(event) =>
          setScrolled(event.currentTarget.offsetHeight > window.innerHeight)
        }
        onMouseLeave={() => setScrolled(false)}
        aria-hidden
      >
        <p>Developer Menu</p>
        <ul className={style.list}>
          {map(
            sortBy(allRoutes, (item) => item.title),
            (item: TRouter, index: number) => (
              <li key={index} className={style.item}>
                <button
                  type={BUTTON_TYPE.BUTTON}
                  className={style.link}
                  title={item.href}
                  onClick={() => {
                    const { routeUrl, routeAsPath } = getUrlSlug(item.href);

                    userStore.devMenuAction = true;
                    router.push(routeUrl, routeAsPath);
                  }}
                >
                  {item.title}
                </button>
              </li>
            )
          )}
          <li className={style.item}>
            <button className={style.button} onClick={() => updateStatic()}>
              Clear Cache
            </button>
          </li>
          <li className={style.item}>
            <LanguagesSwitcher />
          </li>
          <li className={style.item}>
            <button className={style.button} onClick={() => logout()}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    ),
    [float, logout, router, scrolled, updateStatic, userStore]
  );

  useEffect(() => {
    setDevMenu(renderContent());
  }, [renderContent]);

  return devMenu;
}

export const DeveloperMenu = inject(STORE_IDS.USER_STORE)(
  DeveloperMenuComponent
);
