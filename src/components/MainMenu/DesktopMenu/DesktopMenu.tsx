import filter from 'lodash/filter';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';

import style from './DesktopMenu.module.scss';

import { Logo } from '@components/Logo';
import { mainMenu } from '@routes';
import { WidgetRoles } from '@src/roles';
import { gt } from '@utils';
import { HeaderConsumer, HeaderCtx } from '@components/Header/HeaderDefault';
import { ActionButtons } from '../ActionButtons';
import { LinkWidget } from '@components/widgets/LinkWidget';
import { LocaleProviderCtx } from '@context/LocaleProvider';

function DesktopMenu() {
  const { pathname } = useRouter();

  useContext(LocaleProviderCtx);
  const { compressed, less } = useContext(HeaderCtx);

  return (
    <HeaderConsumer>
      {() => (
        <div
          className={classNames(style.desktop, {
            [style.desktopLess]: less,
            [style.desktopCompressed]: compressed,
          })}
        >
          <Logo className={classNames(style.logo)} />
          {!less && (
            <>
              <nav className={style.nav}>
                {filter(mainMenu, (item) => !item.button).map((item, key) => (
                  <LinkWidget
                    key={key}
                    id={`MainMenu-${WidgetRoles.link}`}
                    href={item.href}
                    className={classNames(style.link, {
                      [style.active]: pathname == item.href,
                    })}
                  >
                    {gt.gettext(item.title)}
                  </LinkWidget>
                ))}
              </nav>
              <ActionButtons />
            </>
          )}
        </div>
      )}
    </HeaderConsumer>
  );
}

export { DesktopMenu };
