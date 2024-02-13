import React from 'react';
import map from 'lodash/map';

import style from './WelcomeRd1.module.scss';

import { TWelcomeRedesignProps } from './@types';
import { WithTag } from '@components/hocs';
import { ProductSelectorRd1 } from '@components/ProductSelector/ProductSelectorRd1';
import Image from 'next/image';
import classNames from 'classnames';

function WelcomeRd1(props: TWelcomeRedesignProps) {
  const { mainText, description, options } = props;

  const renderOptions = () => {
    return (
      <div className={style.options}>
        {map(options, (item, index) => {
          let iconName = 'file-check-icon-white.svg';
          let color = 'blue';
          switch (index) {
            case 0:
              iconName = 'clock-icon-white.svg';
              color = 'blue';
              break;
            case 1:
              iconName = 'file-check-icon-white.svg';
              color = 'red';
              break;
            case 2:
              iconName = 'calendar-icon-white.svg';
              color = 'yellow';
              break;
            default:
              break;
          }
          return (
            <div
              key={index}
              className={classNames(style.option, style[`option-${index}`])}
            >
              <div className={style.iconWrap}>
                <div className={classNames(style.icon, style[`icon-${color}`])}>
                  <Image
                    src={`/images/main-page/welcome/${iconName}`}
                    width={24}
                    height={24}
                    alt={iconName}
                  />
                </div>
              </div>
              <WithTag>
                <div className={style.text}>{item}</div>
              </WithTag>
            </div>
          );
        })}
      </div>
    );
  };

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
          {/* <div className={style.bannerWrap}> */}
          <div className={style.banner}>
            <div className={style.mainContent}>
              <div className={style.mainTextWrap}>
                <WithTag>
                  <h1 className={style.mainText}>{mainText}</h1>
                </WithTag>
              </div>
              {description && (
                <WithTag>
                  <p className={style.description}>{description}</p>
                </WithTag>
              )}
            </div>
            <div className={style.mainImage}>
              <div className={style.img}>
                <Image
                  src={`/images/main-page/welcome/lady-with-phone.webp`}
                  width={260}
                  height={487}
                  priority
                  quality={100}
                  alt={'welcome-banner'}
                />
              </div>
              {renderOptions()}
            </div>
          </div>
          {/* </div> */}
          <div className={style.productSelector}>
            <ProductSelectorRd1 />
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

export { WelcomeRd1 };
