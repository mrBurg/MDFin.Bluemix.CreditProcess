import React from 'react';
import map from 'lodash/map';
import Image from 'next/image';

import { WithTag } from '@components/hocs';

import { THowDoItProps } from './@types';
import style from './HowDoIt.module.scss';

function HowDoIt(props: THowDoItProps) {
  const { title, subtitle, items } = props;

  return (
    <section className={style.section}>
      <div className={style.content}>
        <WithTag>
          <h2 className={style.title}>{title}</h2>
          <h3 className={style.subtitle}>{subtitle}</h3>
        </WithTag>
        <div className={style.steps}>
          {map(items, (item, index) => {
            let iconName = 'calendar-icon.svg';
            switch (index) {
              case 0:
                iconName = 'calendar-icon.svg';
                break;
              case 1:
                iconName = 'wallet-icon.svg';
                break;
              case 2:
                iconName = 'cards-icon.svg';
                break;
              case 3:
                iconName = 'check-icon.svg';
                break;
              default:
                break;
            }

            return (
              <div key={index} className={style.step}>
                <div className={style.stepIcon}>
                  <Image
                    src={`/images/main-page/how-do-it/${iconName}`}
                    width={77}
                    height={77}
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

export { HowDoIt };
