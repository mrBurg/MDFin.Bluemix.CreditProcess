import Link from 'next/link';
import classNames from 'classnames';
import React, { useMemo } from 'react';

import style from './LinkWidget.module.scss';

import { WithTracking } from '@components/hocs';
import { WidgetRoles } from '@src/roles';
import { EMouseEvents } from '@src/trackingConstants';
import { TLinkWidgetProps } from './@types';

export enum TARGET {
  BLANK = '_blank',
  SELF = '_self',
  TOP = '_top',
}

function LinkWidget(props: TLinkWidgetProps) {
  const {
    id = `LinkWidget-${WidgetRoles.link}`,
    href,
    children,
    className,
    notTrack,
    ...restProps
  } = props;

  const link = useMemo(
    () => (
      <>
        <Link href={href}>
          <a
            role={WidgetRoles.link}
            href={href}
            className={classNames('link-widget', style.linkWidget, className)}
            {...restProps}
          >
            {children}
          </a>
        </Link>
      </>
    ),
    [children, className, href, restProps]
  );

  if (notTrack) {
    return link;
  }

  return (
    <WithTracking id={id} events={[EMouseEvents.CLICK]}>
      {link}
    </WithTracking>
  );
}

export { LinkWidget };
