import { ReactElement } from 'react';

export type TLinks = {
  [key: string]: Partial<Record<'text' | 'target', string>> & {
    link: string;
  };
};

export type TWithLinkProps = {
  children: ReactElement | ReactElement[];
  links: TLinks;
  linkClassName?: string;
};
