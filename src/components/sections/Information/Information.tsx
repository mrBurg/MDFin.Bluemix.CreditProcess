import React from 'react';

import style from './Information.module.scss';

import { WithLink } from '@components/hocs';
import { TInformationProps } from './@types';

/**
 * Использовался для вывода информации по COVID-19
 * Пока, не используется
 */
function Information(props: TInformationProps) {
  const { text, links } = props;

  return (
    <section className={style.section}>
      <div className={style.content}>
        <WithLink links={links} linkClassName={style.link}>
          <div className={style.text}>{text}</div>
        </WithLink>
      </div>
    </section>
  );
}

export { Information };
