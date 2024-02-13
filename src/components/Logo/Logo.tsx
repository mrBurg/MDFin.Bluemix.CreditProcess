import React, { useMemo } from 'react';
import classNames from 'classnames';
import Image from 'next/image';

import style from './Logo.module.scss';

import { URLS, allowedPages } from '@routes';
import { WidgetRoles } from '@src/roles';
import { TLogoProps, TLogoPropsStore } from './@types';
import { LinkWidget } from '@components/widgets/LinkWidget';
import { inject, observer } from 'mobx-react';
import { STORE_IDS } from '@stores';
import { useRouter } from 'next/router';
import includes from 'lodash/includes';

function LogoComponent(props: TLogoProps) {
  const { className, userStore, ...restProps } = props as TLogoPropsStore;

  const { pathname } = useRouter();

  const disabled = useMemo(
    () =>
      userStore.isCabinet &&
      userStore.userLoggedIn &&
      !includes(allowedPages, pathname),
    [userStore.isCabinet, userStore.userLoggedIn, pathname]
  );

  /** On main & redesign page, and when logo should be disabled - show only logo image without link */
  if (disabled || [URLS.HOME, URLS.redesign].includes(pathname)) {
    return (
      <div className={classNames(style.link, className)}>
        <Image src={'/theme/logo.svg'} alt="Logo" width={200} height={50} />
      </div>
    );
  }

  return (
    <LinkWidget
      id={`Logo-${WidgetRoles.link}`}
      href={URLS.HOME}
      onClick={(event) => {
        event.preventDefault();

        window.location = URLS.HOME as string & Location;
      }}
      className={classNames(style.link, className)}
      {...restProps}
    >
      <Image src={'/theme/logo.svg'} alt="Logo" width={200} height={50} />
    </LinkWidget>
  );
}

export const Logo = inject(STORE_IDS.USER_STORE)(observer(LogoComponent));
