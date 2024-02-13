import { LinkProps } from 'next/link';
import { MouseEventHandler } from 'react';
import { TARGET } from '..';

export type TLinkWidgetProps = {
  href: string;
  children: any;
} & Partial<
  {
    notTrack: boolean;
    target: TARGET;
    onClick: MouseEventHandler<HTMLAnchorElement>;
  } & Record<'id' | 'className' | 'rel', string>
> &
  LinkProps;
