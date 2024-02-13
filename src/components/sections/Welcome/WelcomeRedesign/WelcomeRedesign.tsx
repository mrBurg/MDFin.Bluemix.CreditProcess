import React from 'react';
import map from 'lodash/map';

import style from './WelcomeRedesign.module.scss';

import { TWelcomeRedesignProps } from './@types';
import { WithTag } from '@components/hocs';
import { ProductSelectorRedesign } from '@components/ProductSelector/ProductSelectorRedesign';
import Image from 'next/image';

function WelcomeRedesign(props: TWelcomeRedesignProps) {
  const { mainText, description, options } = props;

  return (
    <section className={style.section}>
      <div className={style.content}>
        {/* <div className={style.arrowPrev}>
          <Image
            src={'/images/main-page/welcome/arrow.svg'}
            width={18}
            height={48}
            alt={'arrow'}
          />
        </div> */}
        <div className={style.contentWrap}>
          <div className={style.bannerWrap}>
            <div className={style.banner}>
              <div className={style.mainContent}>
                <WithTag>
                  <h1 className={style.mainText}>{mainText}</h1>
                </WithTag>
                {description && (
                  <WithTag>
                    <p className={style.description}>{description}</p>
                  </WithTag>
                )}

                <div className={style.options}>
                  {map(options, (item, index) => {
                    let iconName = 'file-check-icon.svg';
                    switch (index) {
                      case 0:
                        iconName = 'clock-icon.svg';
                        break;
                      case 1:
                        iconName = 'file-check-icon.svg';
                        break;
                      case 2:
                        iconName = 'calendar-icon.svg';
                        break;
                      default:
                        break;
                    }
                    return (
                      <div key={index} className={style.option}>
                        <div className={style.icon}>
                          <Image
                            src={`/images/main-page/welcome/${iconName}`}
                            width={24}
                            height={24}
                            alt={iconName}
                          />
                        </div>
                        <WithTag>
                          <div>{item}</div>
                        </WithTag>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className={style.mainImage}>
                <Image
                  src={`/images/main-page/welcome/banner-m.webp`}
                  width={500}
                  height={560}
                  priority
                  quality={100}
                  alt={'welcome-banner'}
                />
              </div>
            </div>
          </div>
          <div className={style.productSelector}>
            <ProductSelectorRedesign />
          </div>
        </div>
        {/* <div className={style.arrowNext}>
          <Image
            src={'/images/main-page/welcome/arrow.svg'}
            width={18}
            height={48}
            alt={'arrow'}
          />
        </div> */}
      </div>
    </section>
  );
}

export { WelcomeRedesign };
