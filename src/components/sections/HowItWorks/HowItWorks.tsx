import React from 'react';
import map from 'lodash/map';

import { WithTag } from '@components/hocs';

import { THowItWorksProps } from './@types';
import style from './HowItWorks.module.scss';

function HowItWorks(props: THowItWorksProps) {
  const { title, subtitle, items, footnote } = props;

  return (
    <section className={style.section}>
      <div className={style.content}>
        <WithTag>
          <h2 className={style.title}>{title}</h2>
          <h3 className={style.subTitle}>{subtitle}</h3>
        </WithTag>

        <div className={style.steps}>
          {map(items, (item, index) => (
            <div key={index} className={style.step}>
              <div className={style.stepIcon}>{index + 1 + '.'}</div>
              <div className={style.stepText}>{item as any}</div>
            </div>
          ))}
        </div>
        <p className={style.footnote}>{footnote}</p>
      </div>
    </section>
  );
}

export { HowItWorks };
