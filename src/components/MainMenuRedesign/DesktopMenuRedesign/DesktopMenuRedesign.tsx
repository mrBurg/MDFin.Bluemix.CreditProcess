import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import filter from 'lodash/filter';

import { gt } from '@utils';
import { mainMenu } from '@routes';
import { WidgetRoles } from '@src/roles';

import { HeaderRedesignConsumer } from '@components/Header/HeaderRedesign';
import { LayoutProviderCtx } from '@context/LayoutProvider';
import { Logo } from '@components/Logo';
import { ActionButtonsRedesign } from '../ActionButtonsRedesign';
import { LinkWidget } from '@components/widgets/LinkWidget';
import { ContactInfo } from '../ContactInfo';
import style from './DesktopMenuRedesign.module.scss';

function DesktopMenuRedesign() {
  const { pathname } = useRouter();
  const { headerLess } = useContext(LayoutProviderCtx);

  return (
    <HeaderRedesignConsumer>
      {() => (
        <div
          className={classNames(style.desktop, {
            [style.desktopLess]: headerLess,
          })}
        >
          <Logo className={classNames(style.logo)} />
          {!headerLess && (
            <div className={style.menu}>
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

              <ContactInfo />

              <ActionButtonsRedesign />
            </div>
          )}
        </div>
      )}
    </HeaderRedesignConsumer>
  );
}

export { DesktopMenuRedesign };
