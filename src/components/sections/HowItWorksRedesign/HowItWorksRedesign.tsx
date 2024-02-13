import React, { Fragment } from 'react';
import map from 'lodash/map';
import Image from 'next/image';

import style from './HowItWorksRedesign.module.scss';
import { THowItWorksRedesignProps } from './@types';
import { WithTag } from '@components/hocs';
import { YoutubeWidget } from '@components/widgets/YoutubeWidget';

function HowItWorksRedesign(props: THowItWorksRedesignProps) {
  const { title, subtitle, youtubeID, items, footnote } = props;

  return (
    <section className={style.section}>
      <div className={style.content}>
        <WithTag>
          <h2 className={style.title}>{title}</h2>
          <h3 className={style.subtitle}>{subtitle}</h3>
        </WithTag>

        {youtubeID && (
          <YoutubeWidget videoId={youtubeID} className={style.youtubeWrap} />
        )}

        <div className={style.steps}>
          {map(items, (item, index) => (
            <Fragment key={index}>
              <div className={style.step}>
                <div className={style.stepIcon}>{'0' + (index + 1)}</div>
                <div className={style.stepText}>{item as any}</div>
              </div>
              <div className={style.arrow}>
                <Image
                  src={`/images/main-page/how-it-works/arrow-icon.svg`}
                  width={33}
                  height={16}
                  alt={'arrow-icon'}
                />
              </div>
            </Fragment>
          ))}
        </div>
        <p className={style.footnote}>{footnote}</p>
      </div>
    </section>
  );
}

export { HowItWorksRedesign };
