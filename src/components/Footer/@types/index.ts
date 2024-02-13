import { TJSON } from '@interfaces';

export type TFooterProps = {
  copyright: {
    text: string;
    links: TJSON;
    tags?: TJSON;
  };
  less?: boolean;
  className?: string;
};
