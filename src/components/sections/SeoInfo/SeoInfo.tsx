import React from 'react';

import style from './SeoInfo.module.scss';
import { TSeoInfoProps } from './@types';
import Image from 'next/image';
import { WithTag } from '@components/hocs';

function SeoInfo(props: TSeoInfoProps) {
  return (
    <section className={style.section}>
      <div className={style.content}>
        <div className={style.image}>
          <Image
            src={'/images/main-page/seo-info/zero-percent.webp'}
            alt={'zero-percent-image'}
            width={262}
            height={192}
          />
        </div>
        <WithTag>
          <p className={style.subTitle}>{props.subTitle}</p>
          <h2 className={style.title}>{props.title}</h2>
          <div className={style.description}>{props.description}</div>
        </WithTag>
      </div>
    </section>
  );
}

export { SeoInfo };
