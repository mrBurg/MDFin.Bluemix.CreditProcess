import React from 'react';
import Image from 'next/image';

import { WithTag } from '@components/hocs';
import { TSeoInfoDefaultProps } from './@types';

import style from './SeoInfoDefault.module.scss';

function SeoInfoDefault(props: TSeoInfoDefaultProps) {
  return (
    <section className={style.section}>
      <div className={style.content}>
        <div className={style.topBox}>
          <div className={style.image}>
            <Image
              src={'/images/main-page/seo-info/like-in-red-icon.svg'}
              width={56}
              height={56}
            />
          </div>
          <p className={style.subTitle}>{props.subTitle}</p>
        </div>
        <div className={style.bottomBox}>
          <WithTag>
            <h2 className={style.title}>{props.title}</h2>
            <div className={style.description}>{props.description}</div>
          </WithTag>
        </div>
      </div>
    </section>
  );
}

export { SeoInfoDefault };
