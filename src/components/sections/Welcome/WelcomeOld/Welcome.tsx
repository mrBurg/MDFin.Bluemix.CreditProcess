import React, { useCallback, useContext } from 'react';
import classNames from 'classnames';
import map from 'lodash/map';

import style from './Welcome.module.scss';

import { TWelcomeProps } from './@types';
import { WithTag } from '@components/hocs';
import { ProductSelector } from '@components/ProductSelector/ProductSelectorDefault';
import Image from 'next/image';
import { MainPageCtx } from '@components/MainPage/MainPageOld';

function Welcome(props: TWelcomeProps) {
  const { mainText, description, steps } = props;

  const { hasProductSelector } = useContext(MainPageCtx);

  const renderProductSelector = useCallback(() => {
    if (hasProductSelector) {
      return (
        <div className={style.productSelector}>
          <ProductSelector />
        </div>
      );
    }
  }, [hasProductSelector]);

  return (
    <section className={style.section}>
      <div className={style.sectionBg}>
        <div className={style.sectionBgImg}>
          <Image
            src={'/images/main-page/welcome/background.webp'}
            alt="background"
            // width={1904}
            // height={751}
            layout={'fill'}
            objectFit={'cover'}
            priority
            quality={100}
          />
        </div>
      </div>
      <div className={style.content}>
        <div className={style.mainContent}>
          <WithTag>
            <div className={style.mainText}>{mainText}</div>
          </WithTag>
          {description && (
            <WithTag>
              <p className={style.description}>{description}</p>
            </WithTag>
          )}
          <div className={style.steps}>
            {map(steps, (item, index) => (
              <div key={index} className={style.step}>
                <div
                  className={classNames(style.stepIcon, style[`icon${index}`])}
                />
                <div className={style.stepText}>{item}</div>
              </div>
            ))}
          </div>
        </div>
        {renderProductSelector()}
      </div>
    </section>
  );
}

export { Welcome };
