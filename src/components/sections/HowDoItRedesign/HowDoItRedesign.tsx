import React from 'react';
import map from 'lodash/map';
import Image from 'next/image';

import style from './HowDoItRedesign.module.scss';
import { THowDoItRedesignProps } from './@types';
import { WithTag } from '@components/hocs';
import classNames from 'classnames';

function HowDoItRedesign(props: THowDoItRedesignProps) {
  const { title, subtitle, items } = props;

  return (
    <section className={style.section}>
      <div className={style.content}>
        <WithTag>
          <h2 className={style.title}>{title}</h2>
          <h3 className={style.subtitle}>{subtitle}</h3>
        </WithTag>

        <div
          className={classNames(style.steps, {
            [style.stepsEven]: items.length % 2 == 0,
          })}
        >
          {map(items, (item, index) => {
            let iconName = 'man-head-icon.svg';
            switch (index) {
              case 0:
                iconName = 'man-head-icon.svg';
                break;
              case 1:
                iconName = 'euro-icon.svg';
                break;
              case 2:
                iconName = 'credit-card-icon.svg';
                break;
              case 3:
                iconName = 'thumbs-up-icon.svg';
                break;
              default:
                break;
            }
            return (
              <div key={index} className={style.step}>
                <div className={style.icon}>
                  <Image
                    src={`/images/main-page/how-do-it/${iconName}`}
                    width={52}
                    height={52}
                    alt={iconName}
                  />
                </div>
                <div className={style.stepText}>
                  {item as unknown as string}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export { HowDoItRedesign };
