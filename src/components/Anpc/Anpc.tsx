import React from 'react';
import Image from 'next/image';

import { LinkWidget, TARGET } from '@components/widgets/LinkWidget';
import styles from './Anpc.module.scss';

function Anpc() {
  return (
    <LinkWidget
      href={'https://anpc.ro/ce-este-insolventa-persoanelor-fizice'}
      className={styles.anpc}
      target={TARGET.BLANK}
    >
      <Image
        src={'/images/anpc.svg'}
        alt={'ANPC logo'}
        width={200}
        height={50}
      />
    </LinkWidget>
  );
}

export { Anpc };
